"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { Car, Plus, Edit, Trash2, Fuel, Wrench, Calendar, AlertTriangle, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  license_plate: string
  fuel_type: string
  mileage?: number
  last_service?: string
  next_service?: string
  insurance_expiry?: string
  created_at: string
}

interface ServiceRecord {
  id: string
  vehicle_id: string
  service_type: string
  description: string
  cost: number
  service_date: string
  mechanic_name?: string
  location?: string
}

export default function GaragePage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")

  /* ---------- form state ---------- */
  const [vehicleForm, setVehicleForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    license_plate: "",
    fuel_type: "Petrol",
    mileage: "",
  })

  const [serviceForm, setServiceForm] = useState({
    service_type: "",
    description: "",
    cost: "",
    service_date: new Date().toISOString().split("T")[0],
    mechanic_name: "",
    location: "",
  })

  /* ---------- load data ---------- */
  useEffect(() => {
    if (user) {
      loadVehicles()
      loadServiceRecords()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
    if (!error) setVehicles(data ?? [])
  }

  const loadServiceRecords = async () => {
    const { data, error } = await supabase
      .from("service_records")
      .select(
        `
        *,
        vehicles (make, model, license_plate)
      `,
      )
      .eq("vehicles.user_id", user?.id)
      .order("service_date", { ascending: false })

    if (!error) setServiceRecords(data ?? [])
    setLoading(false)
  }

  /* ---------- helpers ---------- */
  const upcomingServices = vehicles.filter((v) => {
    if (!v.next_service) return false
    const diff = (new Date(v.next_service).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 30
  })

  const recordsForVehicle = (id: string) => serviceRecords.filter((r) => r.vehicle_id === id)

  /* ---------- mutations ---------- */
  const addVehicle = async (e: FormEvent) => {
    e.preventDefault()
    await supabase.from("vehicles").insert([
      {
        ...vehicleForm,
        mileage: vehicleForm.mileage ? Number(vehicleForm.mileage) : null,
        user_id: user?.id,
      },
    ])
    setShowAddVehicle(false)
    setVehicleForm({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      license_plate: "",
      fuel_type: "Petrol",
      mileage: "",
    })
    loadVehicles()
  }

  const deleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return
    await supabase.from("vehicles").delete().eq("id", id)
    loadVehicles()
  }

  const addRecord = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedVehicle) return
    await supabase.from("service_records").insert([
      {
        ...serviceForm,
        cost: Number(serviceForm.cost),
        vehicle_id: selectedVehicle,
      },
    ])
    setServiceForm({
      service_type: "",
      description: "",
      cost: "",
      service_date: new Date().toISOString().split("T")[0],
      mechanic_name: "",
      location: "",
    })
    loadServiceRecords()
  }

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    )
  }

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300">
              Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">My Garage</h1>
          <Button onClick={() => setShowAddVehicle(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* upcoming alert */}
        {upcomingServices.length > 0 && (
          <Card className="mb-6 bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4 flex items-center space-x-2">
              <AlertTriangle className="text-yellow-400 w-5 h-5" />
              <div>
                <h3 className="font-semibold text-yellow-400">Upcoming Services</h3>
                <p className="text-yellow-300 text-sm">
                  {upcomingServices.length} vehicle(s) need service in the next 30&nbsp;days
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="border-slate-700 bg-slate-900">
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-emerald-600">
              <Car className="w-4 h-4 mr-2" />
              Vehicles ({vehicles.length})
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-emerald-600">
              <Wrench className="w-4 h-4 mr-2" />
              Service Records ({serviceRecords.length})
            </TabsTrigger>
          </TabsList>

          {/* vehicles tab */}
          <TabsContent value="vehicles">
            {vehicles.length === 0 ? (
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Car className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                  <p className="mb-4 text-slate-400">Add your first vehicle to start tracking maintenance.</p>
                  <Button onClick={() => setShowAddVehicle(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vehicle
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => (
                  <Card key={v.id} className="bg-slate-900 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          {v.make} {v.model}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 text-slate-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteVehicle(v.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className="bg-slate-800 text-slate-300">{v.year}</Badge>
                        <Badge className="bg-slate-800 text-slate-300">{v.fuel_type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-400">Plate: {v.license_plate}</p>
                      {v.mileage && <p className="text-sm text-slate-400">Mileage: {v.mileage.toLocaleString()} km</p>}

                      {v.next_service && (
                        <p className="text-sm">Next&nbsp;Service: {new Date(v.next_service).toLocaleDateString()}</p>
                      )}

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Fuel className="mr-1 h-4 w-4" />
                          Fuel Log
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Wrench className="mr-1 h-4 w-4" />
                          Service
                        </Button>
                      </div>

                      <p className="text-xs text-slate-500">Services: {recordsForVehicle(v.id).length}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* add vehicle modal */}
            {showAddVehicle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <Card className="w-full max-w-md border-slate-700 bg-slate-900">
                  <CardHeader>
                    <CardTitle>Add Vehicle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addVehicle} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="make">Make</Label>
                          <Input
                            id="make"
                            value={vehicleForm.make}
                            onChange={(e) =>
                              setVehicleForm({
                                ...vehicleForm,
                                make: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <Input
                            id="model"
                            value={vehicleForm.model}
                            onChange={(e) =>
                              setVehicleForm({
                                ...vehicleForm,
                                model: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            type="number"
                            value={vehicleForm.year}
                            onChange={(e) =>
                              setVehicleForm({
                                ...vehicleForm,
                                year: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="fuel">Fuel</Label>
                          <Select
                            value={vehicleForm.fuel_type}
                            onValueChange={(v) =>
                              setVehicleForm({
                                ...vehicleForm,
                                fuel_type: v,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Petrol">Petrol</SelectItem>
                              <SelectItem value="Diesel">Diesel</SelectItem>
                              <SelectItem value="CNG">CNG</SelectItem>
                              <SelectItem value="Electric">Electric</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="plate">License Plate</Label>
                        <Input
                          id="plate"
                          value={vehicleForm.license_plate}
                          onChange={(e) =>
                            setVehicleForm({
                              ...vehicleForm,
                              license_plate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="mileage">Mileage (km)</Label>
                        <Input
                          id="mileage"
                          type="number"
                          value={vehicleForm.mileage}
                          onChange={(e) =>
                            setVehicleForm({
                              ...vehicleForm,
                              mileage: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setShowAddVehicle(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                          Add
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* service tab */}
          <TabsContent value="services">
            <Card className="mb-6 bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Add Service Record</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addRecord} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <Label>Vehicle</Label>
                      <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.make} {v.model} ({v.license_plate})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Input
                        value={serviceForm.service_type}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            service_type: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Cost (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={serviceForm.cost}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            cost: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={serviceForm.service_date}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            service_date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Mechanic / Shop</Label>
                      <Input
                        value={serviceForm.mechanic_name}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            mechanic_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input
                      value={serviceForm.location}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!selectedVehicle}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* list */}
            {serviceRecords.length === 0 ? (
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Wrench className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                  <p className="text-slate-400">No service records yet. Use the form above to add one.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {serviceRecords.map((rec) => (
                  <Card key={rec.id} className="bg-slate-900 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center space-x-2">
                            <h3 className="font-semibold">{rec.service_type}</h3>
                            <Badge className="bg-emerald-500/20 text-emerald-400">₹{rec.cost}</Badge>
                          </div>
                          {rec.description && <p className="mb-2 text-slate-300">{rec.description}</p>}
                          <div className="flex flex-wrap items-center space-x-4 text-sm text-slate-400">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(rec.service_date).toLocaleDateString()}</span>
                            </span>
                            {rec.mechanic_name && (
                              <span className="flex items-center space-x-1">
                                <Wrench className="h-4 w-4" />
                                <span>{rec.mechanic_name}</span>
                              </span>
                            )}
                            {rec.location && (
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{rec.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
