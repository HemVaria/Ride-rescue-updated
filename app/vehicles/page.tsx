"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Car, Plus, Edit, Trash2, Fuel, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"

interface Vehicle {
  id?: number
  user_id?: string
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  vin?: string
  fuel_type?: string
  insurance_company?: string
  insurance_policy?: string
  insurance_expiry?: string
  registration_expiry?: string
  last_service_date?: string
  next_service_due?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export default function VehiclesPage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vehicleColumns, setVehicleColumns] = useState<string[]>([])
  const [columnsLoaded, setColumnsLoaded] = useState(false)

  const [formData, setFormData] = useState<Vehicle>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    license_plate: "",
    vin: "",
    fuel_type: "",
    insurance_company: "",
    insurance_policy: "",
    insurance_expiry: "",
    registration_expiry: "",
    last_service_date: "",
    next_service_due: "",
    notes: "",
  })

  // Detect available columns in the vehicles table
  useEffect(() => {
    const detectVehicleColumns = async () => {
      try {
        // Try to get table structure by querying with limit 0
        const { data, error } = await supabase.from("vehicles").select("*").limit(0)

        if (!error) {
          // If successful, we can infer columns from the response structure
          // For now, set basic columns that should always exist
          const basicColumns = ["make", "model", "year", "color", "license_plate", "user_id"]

          // Try to detect additional columns by attempting a test query
          const { error: testError } = await supabase
            .from("vehicles")
            .select(
              "fuel_type, insurance_company, insurance_expiry, registration_expiry, last_service_date, next_service_due, notes, vin",
            )
            .limit(0)

          if (!testError) {
            // Extended columns are available
            setVehicleColumns([
              ...basicColumns,
              "fuel_type",
              "insurance_company",
              "insurance_policy",
              "insurance_expiry",
              "registration_expiry",
              "last_service_date",
              "next_service_due",
              "notes",
              "vin",
            ])
          } else {
            // Only basic columns available
            setVehicleColumns(basicColumns)
          }
        } else {
          // Fallback to basic columns
          setVehicleColumns(["make", "model", "year", "color", "license_plate", "user_id"])
        }
      } catch (err) {
        console.error("Error detecting columns:", err)
        // Fallback to basic columns
        setVehicleColumns(["make", "model", "year", "color", "license_plate", "user_id"])
      } finally {
        setColumnsLoaded(true)
      }
    }

    detectVehicleColumns()
  }, [])

  useEffect(() => {
    if (user && columnsLoaded) {
      loadVehicles()
    }
  }, [user, columnsLoaded])

  const sanitizeVehicleData = (data: Vehicle) => {
    const sanitized: any = {}

    // Only include columns that exist in the table
    Object.keys(data).forEach((key) => {
      if (vehicleColumns.includes(key)) {
        const value = data[key as keyof Vehicle]

        // Convert empty strings and NaN to null for database
        if (value === "" || value === null || value === undefined || (typeof value === "number" && isNaN(value))) {
          sanitized[key] = null
        } else {
          sanitized[key] = value
        }
      }
    })

    return sanitized
  }

  const loadVehicles = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setVehicles(data || [])
    } catch (err) {
      console.error("Error loading vehicles:", err)
      setError("Failed to load vehicles")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const vehicleData = sanitizeVehicleData({
        ...formData,
        user_id: user.id,
      })

      if (editingVehicle) {
        const { error } = await supabase.from("vehicles").update(vehicleData).eq("id", editingVehicle.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("vehicles").insert(vehicleData)

        if (error) throw error
      }

      // Reset form and reload vehicles
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        color: "",
        license_plate: "",
        vin: "",
        fuel_type: "",
        insurance_company: "",
        insurance_policy: "",
        insurance_expiry: "",
        registration_expiry: "",
        last_service_date: "",
        next_service_due: "",
        notes: "",
      })
      setShowAddForm(false)
      setEditingVehicle(null)
      loadVehicles()
    } catch (err: any) {
      console.error("Error saving vehicle:", err)
      setError(`Error saving vehicle: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setFormData(vehicle)
    setEditingVehicle(vehicle)
    setShowAddForm(true)
  }

  const handleDelete = async (vehicleId: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId)

      if (error) throw error
      loadVehicles()
    } catch (err: any) {
      console.error("Error deleting vehicle:", err)
      setError(`Error deleting vehicle: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      license_plate: "",
      vin: "",
      fuel_type: "",
      insurance_company: "",
      insurance_policy: "",
      insurance_expiry: "",
      registration_expiry: "",
      last_service_date: "",
      next_service_due: "",
      notes: "",
    })
    setShowAddForm(false)
    setEditingVehicle(null)
    setError(null)
  }

  const isFieldAvailable = (fieldName: string) => {
    return vehicleColumns.includes(fieldName)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300">Please log in to manage your vehicles</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-100 hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-slate-100">My Vehicles</h1>
        <Button
          onClick={() => setShowAddForm(true)}
          disabled={!columnsLoaded}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Vehicle Form */}
        {showAddForm && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="space-y-2">
                    <Label htmlFor="make" className="text-slate-300">
                      Make *
                    </Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      placeholder="Toyota, Honda, etc."
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-slate-300">
                      Model *
                    </Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Camry, Civic, etc."
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-slate-300">
                      Year *
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: Number.parseInt(e.target.value) || new Date().getFullYear() })
                      }
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-slate-300">
                      Color *
                    </Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="Red, Blue, etc."
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license_plate" className="text-slate-300">
                      License Plate *
                    </Label>
                    <Input
                      id="license_plate"
                      value={formData.license_plate}
                      onChange={(e) => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
                      placeholder="GJ01AB1234"
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  {isFieldAvailable("vin") && (
                    <div className="space-y-2">
                      <Label htmlFor="vin" className="text-slate-300">
                        VIN
                      </Label>
                      <Input
                        id="vin"
                        value={formData.vin || ""}
                        onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                        placeholder="Vehicle Identification Number"
                        className="bg-slate-800 border-slate-600 text-slate-100"
                      />
                    </div>
                  )}

                  {isFieldAvailable("fuel_type") && (
                    <div className="space-y-2">
                      <Label htmlFor="fuel_type" className="text-slate-300">
                        Fuel Type
                      </Label>
                      <Select
                        value={formData.fuel_type || ""}
                        onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="petrol" className="text-slate-100">
                            Petrol
                          </SelectItem>
                          <SelectItem value="diesel" className="text-slate-100">
                            Diesel
                          </SelectItem>
                          <SelectItem value="cng" className="text-slate-100">
                            CNG
                          </SelectItem>
                          <SelectItem value="electric" className="text-slate-100">
                            Electric
                          </SelectItem>
                          <SelectItem value="hybrid" className="text-slate-100">
                            Hybrid
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {isFieldAvailable("insurance_company") && (
                    <div className="space-y-2">
                      <Label htmlFor="insurance_company" className="text-slate-300">
                        Insurance Company
                      </Label>
                      <Input
                        id="insurance_company"
                        value={formData.insurance_company || ""}
                        onChange={(e) => setFormData({ ...formData, insurance_company: e.target.value })}
                        placeholder="ICICI Lombard, HDFC ERGO, etc."
                        className="bg-slate-800 border-slate-600 text-slate-100"
                      />
                    </div>
                  )}

                  {isFieldAvailable("insurance_policy") && (
                    <div className="space-y-2">
                      <Label htmlFor="insurance_policy" className="text-slate-300">
                        Policy Number
                      </Label>
                      <Input
                        id="insurance_policy"
                        value={formData.insurance_policy || ""}
                        onChange={(e) => setFormData({ ...formData, insurance_policy: e.target.value })}
                        placeholder="Policy number"
                        className="bg-slate-800 border-slate-600 text-slate-100"
                      />
                    </div>
                  )}

                  {isFieldAvailable("insurance_expiry") && (
                    <div className="space-y-2">
                      <Label htmlFor="insurance_expiry" className="text-slate-300">
                        Insurance Expiry
                      </Label>
                      <Input
                        id="insurance_expiry"
                        type="date"
                        value={formData.insurance_expiry || ""}
                        onChange={(e) => setFormData({ ...formData, insurance_expiry: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                      />
                    </div>
                  )}

                  {isFieldAvailable("registration_expiry") && (
                    <div className="space-y-2">
                      <Label htmlFor="registration_expiry" className="text-slate-300">
                        Registration Expiry
                      </Label>
                      <Input
                        id="registration_expiry"
                        type="date"
                        value={formData.registration_expiry || ""}
                        onChange={(e) => setFormData({ ...formData, registration_expiry: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                      />
                    </div>
                  )}

                  {isFieldAvailable("last_service_date") && (
                    <div className="space-y-2">
                      <Label htmlFor="last_service_date" className="text-slate-300">
                        Last Service Date
                      </Label>
                      <Input
                        id="last_service_date"
                        type="date"
                        value={formData.last_service_date || ""}
                        onChange={(e) => setFormData({ ...formData, last_service_date: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                      />
                    </div>
                  )}

                  {isFieldAvailable("next_service_due") && (
                    <div className="space-y-2">
                      <Label htmlFor="next_service_due" className="text-slate-300">
                        Next Service Due
                      </Label>
                      <Input
                        id="next_service_due"
                        type="date"
                        value={formData.next_service_due || ""}
                        onChange={(e) => setFormData({ ...formData, next_service_due: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                      />
                    </div>
                  )}
                </div>

                {isFieldAvailable("notes") && (
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-300">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ""}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes about your vehicle..."
                      className="bg-slate-800 border-slate-600 text-slate-100"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {loading ? "Saving..." : editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-slate-600 text-slate-300 bg-transparent hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Vehicles List */}
        {loading && vehicles.length === 0 ? (
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="w-8 h-8 mx-auto mb-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              <p className="text-slate-300">Loading vehicles...</p>
            </CardContent>
          </Card>
        ) : vehicles.length === 0 ? (
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-8 text-center">
              <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No vehicles added yet</h3>
              <p className="text-slate-400 mb-4">Add your first vehicle to get started with roadside assistance</p>
              <Button
                onClick={() => setShowAddForm(true)}
                disabled={!columnsLoaded}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-slate-100">
                    <div className="flex items-center space-x-2">
                      <Car className="w-5 h-5 text-emerald-400" />
                      <span>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vehicle)}
                        className="text-slate-400 hover:text-slate-100"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vehicle.id!)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Color:</span>
                      <p className="text-slate-200">{vehicle.color}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">License:</span>
                      <p className="text-slate-200 font-mono">{vehicle.license_plate}</p>
                    </div>
                    {vehicle.fuel_type && (
                      <div>
                        <span className="text-slate-400">Fuel:</span>
                        <p className="text-slate-200 capitalize">{vehicle.fuel_type}</p>
                      </div>
                    )}
                    {vehicle.insurance_company && (
                      <div>
                        <span className="text-slate-400">Insurance:</span>
                        <p className="text-slate-200">{vehicle.insurance_company}</p>
                      </div>
                    )}
                  </div>

                  {/* Expiry Alerts */}
                  <div className="space-y-2">
                    {vehicle.insurance_expiry && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Insurance Expiry:</span>
                        <Badge
                          className={
                            new Date(vehicle.insurance_expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              ? "bg-red-500/20 text-red-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }
                        >
                          {new Date(vehicle.insurance_expiry).toLocaleDateString()}
                        </Badge>
                      </div>
                    )}
                    {vehicle.registration_expiry && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Registration Expiry:</span>
                        <Badge
                          className={
                            new Date(vehicle.registration_expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              ? "bg-red-500/20 text-red-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }
                        >
                          {new Date(vehicle.registration_expiry).toLocaleDateString()}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Link href={`/vehicles/${vehicle.id}/fuel-tracker`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-600 text-slate-300 bg-transparent hover:bg-slate-800"
                      >
                        <Fuel className="w-4 h-4 mr-1" />
                        Fuel Tracker
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 text-slate-300 bg-transparent hover:bg-slate-800"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Service Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
