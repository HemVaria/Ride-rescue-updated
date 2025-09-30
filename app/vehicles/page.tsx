"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Car, Edit, Plus, Trash2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"

type Vehicle = {
  id?: string
  user_id?: string
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  mileage?: number | null
  created_at?: string
  updated_at?: string
}

export default function VehiclesPage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<Vehicle>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    license_plate: "",
    mileage: null,
  })

  useEffect(() => {
    if (user?.id) void loadVehicles()
  }, [user])

  async function loadVehicles() {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const { data, error, status } = (await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })) as any

      if (error) {
        // Surface more helpful info
        const msg = [error.message, error.hint, error.details, status && `status: ${status}`]
          .filter(Boolean)
          .join(" | ")
        throw new Error(msg || "Unknown database error")
      }
      setVehicles(data || [])
    } catch (e) {
      console.error("Failed to load vehicles", e)
      const fallback =
        "Failed to load vehicles. Ensure the 'vehicles' table exists, RLS policies allow select for your user, and you're signed in."
      setError(e instanceof Error && e.message ? e.message : fallback)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      license_plate: "",
      mileage: null,
    })
    setEditing(null)
    setShowForm(false)
    setError(null)
  }

  function onEdit(v: Vehicle) {
    setFormData({
      id: v.id,
      user_id: v.user_id,
      make: v.make || "",
      model: v.model || "",
      year: v.year || new Date().getFullYear(),
      color: v.color || "",
      license_plate: v.license_plate || "",
      mileage: v.mileage ?? null,
      created_at: v.created_at,
      updated_at: v.updated_at,
    })
    setEditing(v)
    setShowForm(true)
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this vehicle?")) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id)
      if (error) throw error
      await loadVehicles()
    } catch (e: any) {
      console.error("Failed to delete vehicle", e)
      setError(`Failed to delete: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const payload: Partial<Vehicle> = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year) || new Date().getFullYear(),
        color: formData.color.trim(),
        license_plate: formData.license_plate.trim(),
        mileage: formData.mileage === null || formData.mileage === undefined || Number.isNaN(formData.mileage)
          ? null
          : Number(formData.mileage),
        user_id: user.id,
      }

      if (editing?.id) {
        const { error } = await supabase.from("vehicles").update(payload).eq("id", editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("vehicles").insert(payload)
        if (error) throw error
      }

      resetForm()
      await loadVehicles()
    } catch (e: any) {
      console.error("Failed to save vehicle", e)
      setError(`Failed to save: ${e.message}`)
    } finally {
      setLoading(false)
    }
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
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-100 hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">My Vehicles</h1>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <p className="text-sm text-red-300/80 mt-2">
                If this persists, ensure the database exists (see scripts/create-tables.sql) and you are signed in.
              </p>
            </CardContent>
          </Card>
        )}

        {showForm && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>{editing ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      required
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      placeholder="Toyota, Honda, etc."
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Corolla, Civic, etc."
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      required
                      min={1900}
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: Number(e.target.value) || new Date().getFullYear() })
                      }
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="e.g., White"
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license_plate">License Plate *</Label>
                    <Input
                      id="license_plate"
                      required
                      value={formData.license_plate}
                      onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                      placeholder="e.g., MH12 AB 1234"
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (km)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, mileage: e.target.value === "" ? null : Number(e.target.value) })
                      }
                      placeholder="e.g., 52000"
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {loading ? "Saving..." : editing ? "Update Vehicle" : "Add Vehicle"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="border-slate-600">
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
              <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <Card key={v.id} className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-slate-100 text-base">
                    <span>
                      {v.year} {v.make} {v.model}
                    </span>
                    <span className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(v)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {v.id && (
                        <Button variant="ghost" size="icon" onClick={() => onDelete(v.id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">License:</span>
                    <span className="font-medium">{v.license_plate}</span>
                  </div>
                  {v.color && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Color:</span>
                      <span className="font-medium">{v.color}</span>
                    </div>
                  )}
                  {v.mileage != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mileage:</span>
                      <span className="font-medium">{Number(v.mileage).toLocaleString()} km</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Added:</span>
                    <span className="font-medium">{v.created_at ? new Date(v.created_at).toLocaleDateString() : "-"}</span>
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
