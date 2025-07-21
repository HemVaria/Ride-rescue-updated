"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, AlertTriangle, MapPin, Clock, Phone, Settings, Plus, Target, Home, Wrench, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useGoogleMaps } from "@/hooks/useGoogleMaps"
import dynamic from "next/dynamic"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "/services", icon: Wrench },
  { name: "Dashboard", url: "/dashboard", icon: Car },
  { name: "Contact", url: "/contact", icon: Phone },
]

const GoogleMapView = dynamic(() => import("@/components/GoogleMapView").then(mod => mod.GoogleMapView), { ssr: false })
const EnhancedLocationPicker = dynamic(() => import("@/components/EnhancedLocationPicker").then(mod => mod.EnhancedLocationPicker), { ssr: false })
const LocationBasedServices = dynamic(() => import("@/components/LocationBasedServices").then(mod => mod.LocationBasedServices), { ssr: false })

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { location, getCurrentLocation, isLoaded, calculateDistance } = useGoogleMaps()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [nearbyProviders, setNearbyProviders] = useState<any[]>([])
  const [showNearbyServices, setShowNearbyServices] = useState(false)
  const router = useRouter()

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return "Guest"

    // Try to get full name from user metadata
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }

    // Fallback to email username
    if (user.email) {
      return user.email.split("@")[0]
    }

    return "User"
  }

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  useEffect(() => {
    if (user && isLoaded) {
      getCurrentLocation()
    }
  }, [user, isLoaded, getCurrentLocation])

  useEffect(() => {
    if (location) {
      loadNearbyProviders()
    }
  }, [location])

  const loadUserData = async () => {
    if (!user) return

    const { data: vehiclesData } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (vehiclesData) {
      setVehicles(vehiclesData)
      if (vehiclesData.length > 0) {
        setSelectedVehicle(vehiclesData[0])
      }
    }

    const { data: requestsData } = await supabase
      .from("service_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    if (requestsData) {
      setRecentRequests(requestsData)
    }
  }

  const loadNearbyProviders = async () => {
    if (!location) return

    const { data: providersData } = await supabase.from("service_providers").select("*").eq("verified", true)

    if (providersData) {
      const providersWithDistance = providersData
        .map((provider) => {
          if (!provider.location_lat || !provider.location_lng) return null

          const distance = calculateDistance(
            { lat: location.latitude, lng: location.longitude },
            { lat: provider.location_lat, lng: provider.location_lng },
          )

          if (distance.distance > 50000) return null

          return {
            ...provider,
            distance: distance.distance,
            eta: distance.duration,
          }
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)

      setNearbyProviders(providersWithDistance)
    }
  }

  const handleEmergencyRequest = async () => {
    if (!user || !location) return

    const { data, error } = await supabase
      .from("service_requests")
      .insert({
        user_id: user.id,
        vehicle_id: selectedVehicle?.id,
        service_type: "emergency",
        status: "pending",
        location_lat: location.latitude,
        location_lng: location.longitude,
        location_address: location.address,
      })
      .select()
      .single()

    if (!error && data) {
      router.push(`/emergency/${data.id}`)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300 bg-slate-900/80 backdrop-blur-xl rounded-lg p-8 border border-slate-700/50">
          Loading...
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="px-6 py-8 pt-32">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section with User Name */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-slate-100 flex items-center space-x-3">
                  <span>Welcome back, {getUserDisplayName()}!</span>
                  <User className="w-8 h-8 text-emerald-400" />
                </h1>
                <p className="text-slate-400">Your roadside assistance dashboard</p>
              </div>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Emergency Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>Emergency Assistance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleEmergencyRequest}
                    disabled={!location}
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Phone className="w-12 h-12" />
                      <span>SOS</span>
                      <span className="text-sm font-normal">Get Help Now</span>
                    </div>
                  </Button>
                </div>

                {location && (
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200 truncate">{location.address}</span>
                    </div>
                    {location.accuracy && (
                      <div className="mt-1">
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30">
                          ±{Math.round(location.accuracy)}m accuracy
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setShowLocationPicker(true)}
                  className="w-full border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Update Location
                </Button>
              </CardContent>
            </Card>

            {/* Current Vehicle */}
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-100">
                  <div className="flex items-center space-x-2">
                    <Car className="w-5 h-5 text-emerald-400" />
                    <span>Current Vehicle</span>
                  </div>
                  <Link href="/vehicles">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedVehicle ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Car className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-100">
                          {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                        </h3>
                        <p className="text-slate-400">
                          {selectedVehicle.color} • {selectedVehicle.license_plate}
                        </p>
                      </div>
                    </div>

                    {vehicles.length > 1 && (
                      <div className="flex space-x-2">
                        {vehicles.map((vehicle) => (
                          <Button
                            key={vehicle.id}
                            variant={selectedVehicle.id === vehicle.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedVehicle(vehicle)}
                            className={
                              selectedVehicle.id === vehicle.id
                                ? "bg-emerald-600 text-white"
                                : "border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50"
                            }
                          >
                            {vehicle.make} {vehicle.model}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No vehicles added yet</p>
                    <Link href="/vehicles">
                      <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                        Add Your First Vehicle
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Services */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100">Quick Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Car, label: "Jump Start", color: "from-blue-500 to-blue-600" },
                  { icon: Settings, label: "Tire Change", color: "from-green-500 to-green-600" },
                  { icon: AlertTriangle, label: "Fuel Delivery", color: "from-orange-500 to-orange-600" },
                  { icon: Phone, label: "Lockout", color: "from-purple-500 to-purple-600" },
                ].map((service, index) => (
                  <Link key={index} href="/services">
                    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105">
                      <CardContent className="p-4 text-center">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                        >
                          <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-slate-200">{service.label}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nearby Services Toggle */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-100">
                <span>Nearby Services</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNearbyServices(!showNearbyServices)}
                  className="border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50"
                >
                  {showNearbyServices ? "Hide" : "Show"} Services
                </Button>
              </CardTitle>
            </CardHeader>
            {showNearbyServices && (
              <CardContent>
                <LocationBasedServices
                  userLocation={location || undefined}
                  onMechanicSelect={(mechanic) => {
                    console.log("Selected mechanic:", mechanic)
                  }}
                />
              </CardContent>
            )}
          </Card>

          {/* Google Maps Integration */}
          {location && (
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <GoogleMapView
                center={{ lat: location.latitude, lng: location.longitude }}
                markers={[
                  {
                    id: "user",
                    position: { lat: location.latitude, lng: location.longitude },
                    title: "Your Location",
                    info: location.address,
                    type: "user",
                  },
                  ...nearbyProviders.map((provider) => ({
                    id: provider.id,
                    position: { lat: provider.location_lat, lng: provider.location_lng },
                    title: provider.name,
                    info: `${provider.eta} • Rating: ${provider.rating}`,
                    type: "provider" as const,
                  })),
                ]}
                height="400px"
                showTraffic={false}
                showDirections={false}
                onMarkerClick={(markerId) => {
                  console.log("Selected provider:", markerId)
                }}
              />
            </div>
          )}

          {/* Recent Activity */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-100">
                <span>Recent Activity</span>
                <Link href="/history">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  >
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">{request.service_type}</p>
                          <p className="text-sm text-slate-400">{new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          request.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : request.status === "pending"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-slate-500/20 text-slate-400"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Location Picker Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-100">
                  <span>Update Location</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLocationPicker(false)}
                    className="text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedLocationPicker
                  onLocationConfirm={(newLocation) => {
                    setShowLocationPicker(false)
                  }}
                  initialLocation={location || undefined}
                  title="Select Your Location"
                  showMap={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
