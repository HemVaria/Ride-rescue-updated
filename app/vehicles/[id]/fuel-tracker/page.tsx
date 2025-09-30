"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Fuel, Plus, TrendingUp, TrendingDown, Calendar, MapPin, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useGoogleMaps } from "@/hooks/useGoogleMaps"
import { supabase } from "@/lib/supabase"

interface FuelEntry {
  id?: number
  vehicle_id: number
  date: string
  odometer_reading: number
  fuel_amount: number
  fuel_cost: number
  fuel_type: string
  location?: string
  location_lat?: number
  location_lng?: number
  notes?: string
  created_at?: string
}

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  license_plate: string
  fuel_type?: string
}

export default function FuelTrackerPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const { location } = useGoogleMaps()
  const vehicleId = Number.parseInt(params.id)

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FuelEntry>({
    vehicle_id: vehicleId,
    date: new Date().toISOString().split("T")[0],
    odometer_reading: 0,
    fuel_amount: 0,
    fuel_cost: 0,
    fuel_type: "petrol",
    location: "",
    notes: "",
  })

  useEffect(() => {
    if (user && vehicleId) {
      loadVehicle()
      loadFuelEntries()
    }
  }, [user, vehicleId])

  useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        location: location.address,
        location_lat: location.latitude,
        location_lng: location.longitude,
      }))
    }
  }, [location])

  const loadVehicle = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .eq("user_id", user?.id)
        .single()

      if (error) throw error
      setVehicle(data)

      // Set default fuel type from vehicle
      if (data.fuel_type) {
        setFormData((prev) => ({ ...prev, fuel_type: data.fuel_type }))
      }
    } catch (err: any) {
      console.error("Error loading vehicle:", err)
      setError("Vehicle not found")
    }
  }

  const loadFuelEntries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("fuel_entries")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("date", { ascending: false })

      if (error) throw error
      setFuelEntries(data || [])
    } catch (err: any) {
      console.error("Error loading fuel entries:", err)
      setError("Failed to load fuel entries")
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
      const { error } = await supabase.from("fuel_entries").insert({
        ...formData,
        vehicle_id: vehicleId,
      })

      if (error) throw error

      // Reset form
      setFormData({
        vehicle_id: vehicleId,
        date: new Date().toISOString().split("T")[0],
        odometer_reading: 0,
        fuel_amount: 0,
        fuel_cost: 0,
        fuel_type: vehicle?.fuel_type || "petrol",
        location: location?.address || "",
        location_lat: location?.latitude,
        location_lng: location?.longitude,
        notes: "",
      })
      setShowAddForm(false)
      loadFuelEntries()
    } catch (err: any) {
      console.error("Error saving fuel entry:", err)
      setError(`Error saving fuel entry: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    if (fuelEntries.length < 2) return null

    const sortedEntries = [...fuelEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    let totalDistance = 0
    let totalFuel = 0
    let totalCost = 0
    const mileageReadings: number[] = []

    for (let i = 1; i < sortedEntries.length; i++) {
      const current = sortedEntries[i]
      const previous = sortedEntries[i - 1]

      const distance = current.odometer_reading - previous.odometer_reading
      if (distance > 0) {
        totalDistance += distance
        totalFuel += current.fuel_amount
        totalCost += current.fuel_cost

        const mileage = distance / current.fuel_amount
        if (mileage > 0 && mileage < 50) {
          // Reasonable mileage range
          mileageReadings.push(mileage)
        }
      }
    }

    const avgMileage =
      mileageReadings.length > 0 ? mileageReadings.reduce((a, b) => a + b, 0) / mileageReadings.length : 0

    const costPerKm = totalDistance > 0 ? totalCost / totalDistance : 0

    return {
      totalDistance,
      totalFuel,
      totalCost,
      avgMileage,
      costPerKm,
      entriesCount: fuelEntries.length,
    }
  }

  const stats = calculateStats()

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300">Please log in to access fuel tracker</div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300">Loading vehicle...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <Link href="/vehicles">
          <Button variant="ghost" size="sm" className="text-slate-100 hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-slate-100">Fuel Tracker</h1>
          <p className="text-sm text-slate-400">
            {vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.license_plate}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
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

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-slate-100">{stats.avgMileage.toFixed(1)}</p>
                <p className="text-sm text-slate-400">km/L Average</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Fuel className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-slate-100">₹{stats.costPerKm.toFixed(2)}</p>
                <p className="text-sm text-slate-400">Cost per km</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="w-5 h-5 text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-slate-100">{stats.totalDistance}</p>
                <p className="text-sm text-slate-400">Total km</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-slate-100">{stats.entriesCount}</p>
                <p className="text-sm text-slate-400">Fill-ups</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Fuel Entry Form */}
        {showAddForm && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Add Fuel Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-slate-300">
                      Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="odometer" className="text-slate-300">
                      Odometer Reading (km) *
                    </Label>
                    <Input
                      id="odometer"
                      type="number"
                      value={formData.odometer_reading}
                      onChange={(e) =>
                        setFormData({ ...formData, odometer_reading: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Current km reading"
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuel_amount" className="text-slate-300">
                      Fuel Amount (L) *
                    </Label>
                    <Input
                      id="fuel_amount"
                      type="number"
                      step="0.01"
                      value={formData.fuel_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, fuel_amount: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Liters filled"
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuel_cost" className="text-slate-300">
                      Total Cost (₹) *
                    </Label>
                    <Input
                      id="fuel_cost"
                      type="number"
                      step="0.01"
                      value={formData.fuel_cost}
                      onChange={(e) => setFormData({ ...formData, fuel_cost: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="Amount paid"
                      required
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuel_type" className="text-slate-300">
                      Fuel Type
                    </Label>
                    <select
                      id="fuel_type"
                      value={formData.fuel_type}
                      onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                      className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100"
                    >
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="cng">CNG</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-300">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Fuel station location"
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-slate-300">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    rows={2}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {loading ? "Saving..." : "Add Entry"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-slate-600 text-slate-300 bg-transparent hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Fuel Entries List */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Fuel History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && fuelEntries.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 mx-auto mb-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                <p className="text-slate-300">Loading fuel entries...</p>
              </div>
            ) : fuelEntries.length === 0 ? (
              <div className="text-center py-8">
                <Fuel className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2">No fuel entries yet</h3>
                <p className="text-slate-400 mb-4">Start tracking your fuel consumption</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Entry
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fuelEntries.map((entry, index) => {
                  const nextEntry = fuelEntries[index + 1]
                  let mileage = null
                  let distance = null

                  if (nextEntry && entry.odometer_reading > nextEntry.odometer_reading) {
                    distance = entry.odometer_reading - nextEntry.odometer_reading
                    mileage = distance / entry.fuel_amount
                  }

                  return (
                    <div key={entry.id} className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-200">{new Date(entry.date).toLocaleDateString()}</span>
                          <Badge className="bg-slate-700 text-slate-300 capitalize">{entry.fuel_type}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-slate-100">₹{entry.fuel_cost}</p>
                          <p className="text-sm text-slate-400">{entry.fuel_amount}L</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Odometer:</span>
                          <p className="text-slate-200 font-mono">{entry.odometer_reading} km</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Price/L:</span>
                          <p className="text-slate-200">₹{(entry.fuel_cost / entry.fuel_amount).toFixed(2)}</p>
                        </div>
                        {mileage && (
                          <div>
                            <span className="text-slate-400">Mileage:</span>
                            <p className="text-emerald-400 font-semibold">{mileage.toFixed(1)} km/L</p>
                          </div>
                        )}
                        {distance && (
                          <div>
                            <span className="text-slate-400">Distance:</span>
                            <p className="text-slate-200">{distance} km</p>
                          </div>
                        )}
                      </div>

                      {entry.location && (
                        <div className="mt-2 flex items-center space-x-1 text-sm">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-400">{entry.location}</span>
                        </div>
                      )}

                      {entry.notes && (
                        <div className="mt-2 text-sm">
                          <span className="text-slate-400">Notes: </span>
                          <span className="text-slate-300">{entry.notes}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
