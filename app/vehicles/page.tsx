"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Car, Plus, Trash2, Edit2, Calendar, FileText, Palette } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Tilt } from "@/components/ui/tilt"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  vin?: string
}

export default function VehiclesPage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    license_plate: "",
    vin: "",
  })

  useEffect(() => {
    if (user) {
      loadVehicles()
    }
  }, [user])

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setVehicles(data || [])
    } catch (error) {
      console.error("Error loading vehicles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingVehicle) {
        const { error } = await supabase
          .from("vehicles")
          .update(formData)
          .eq("id", editingVehicle.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("vehicles").insert([
          {
            ...formData,
            user_id: user?.id,
          },
        ])

        if (error) throw error
      }

      setIsDialogOpen(false)
      setEditingVehicle(null)
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        color: "",
        license_plate: "",
        vin: "",
      })
      loadVehicles()
    } catch (error) {
      console.error("Error saving vehicle:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return

    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id)
      if (error) throw error
      loadVehicles()
    } catch (error) {
      console.error("Error deleting vehicle:", error)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      license_plate: vehicle.license_plate,
      vin: vehicle.vin || "",
    })
    setIsDialogOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              My Vehicles
            </h1>
            <p className="text-slate-400">Manage your registered vehicles</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingVehicle(null)
                  setFormData({
                    make: "",
                    model: "",
                    year: new Date().getFullYear(),
                    color: "",
                    license_plate: "",
                    vin: "",
                  })
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
              <DialogHeader>
                <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      className="bg-slate-800 border-slate-600"
                      placeholder="e.g. Toyota"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="bg-slate-800 border-slate-600"
                      placeholder="e.g. Camry"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="bg-slate-800 border-slate-600"
                      placeholder="e.g. Silver"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license_plate">License Plate</Label>
                  <Input
                    id="license_plate"
                    value={formData.license_plate}
                    onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                    className="bg-slate-800 border-slate-600"
                    placeholder="e.g. GJ06AB1234"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN (Optional)</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    className="bg-slate-800 border-slate-600"
                    placeholder="Vehicle Identification Number"
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {vehicles.length === 0 ? (
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No vehicles added</h3>
              <p className="text-slate-400 mb-4">Add your vehicle details to request services faster</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {vehicles.map((vehicle) => (
              <motion.div key={vehicle.id} variants={itemVariants}>
                <Tilt rotationFactor={5} isRevese>
                  <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-colors group">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <Car className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-slate-100">
                            {vehicle.make} {vehicle.model}
                          </CardTitle>
                          <p className="text-sm text-slate-400">{vehicle.year}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(vehicle)}
                          className="h-8 w-8 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(vehicle.id)}
                          className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-slate-500 flex items-center">
                            <FileText className="w-3 h-3 mr-1" /> License Plate
                          </p>
                          <p className="text-slate-200 font-mono bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50 inline-block">
                            {vehicle.license_plate}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-500 flex items-center">
                            <Palette className="w-3 h-3 mr-1" /> Color
                          </p>
                          <p className="text-slate-200">{vehicle.color}</p>
                        </div>
                      </div>
                      {vehicle.vin && (
                        <div className="pt-2 border-t border-slate-700/50">
                          <p className="text-xs text-slate-500 mb-1">VIN</p>
                          <p className="text-xs text-slate-400 font-mono">{vehicle.vin}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
