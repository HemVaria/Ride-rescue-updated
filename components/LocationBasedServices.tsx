"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Phone, Star, Navigation, Search, Map, CheckCircle, Clock } from "lucide-react"
import { useServiceAreas } from "@/hooks/useServiceAreas"
import { LeafletMap } from "@/components/ui/leaflet-map"

interface LocationBasedServicesProps {
  userLocation?: {
    latitude: number
    longitude: number
    address?: string
  }
  selectedService?: string
  onMechanicSelect?: (mechanic: any) => void
}

export function LocationBasedServices({ userLocation, selectedService, onMechanicSelect }: LocationBasedServicesProps) {
  const { serviceAreas, loading, error, usingFallback } = useServiceAreas()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>("all")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [showMap, setShowMap] = useState(false)
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null)
  const [showLocationDialog, setShowLocationDialog] = useState(false)

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Filter and sort service areas - SHOW ALL BY DEFAULT
  const filteredAreas = useMemo(() => {
    if (!Array.isArray(serviceAreas)) return []

    return serviceAreas
      .filter((area) => {
        // Area name filter
        if (selectedArea !== "all" && area.name !== selectedArea) return false

        // Search term filter
        if (searchTerm && !area.name.toLowerCase().includes(searchTerm.toLowerCase())) return false

        // Service type filter - only apply if specifically selected
        if (selectedServiceFilter !== "all") {
          const hasService =
            area.mechanics &&
            Array.isArray(area.mechanics) &&
            area.mechanics.some(
              (mechanic: any) =>
                mechanic.services &&
                Array.isArray(mechanic.services) &&
                mechanic.services.some((service: string) =>
                  service.toLowerCase().includes(selectedServiceFilter.toLowerCase()),
                ),
            )
          if (!hasService) return false
        }

        // Selected service filter from parent - only apply if specifically selected
        if (selectedService && selectedService !== "" && selectedService !== "all") {
          const hasSelectedService =
            area.mechanics &&
            Array.isArray(area.mechanics) &&
            area.mechanics.some(
              (mechanic: any) =>
                mechanic.services &&
                Array.isArray(mechanic.services) &&
                mechanic.services.some((service: string) =>
                  service.toLowerCase().includes(selectedService.toLowerCase()),
                ),
            )
          if (!hasSelectedService) return false
        }

        return true
      })
      .map((area) => {
        // Add distance if user location is available
        if (userLocation && area.latitude && area.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            area.latitude,
            area.longitude,
          )
          return { ...area, distance }
        }
        return area
      })
      .sort((a, b) => {
        // Sort by distance if available, otherwise by name
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance
        }
        return a.name.localeCompare(b.name)
      })
  }, [serviceAreas, searchTerm, selectedServiceFilter, selectedArea, userLocation, selectedService])

  // Get unique areas for filter
  const uniqueAreas = useMemo(() => {
    if (!Array.isArray(serviceAreas)) return []
    return [...new Set(serviceAreas.map((area) => area.name))].sort()
  }, [serviceAreas])

  // Get unique services for filter
  const uniqueServices = useMemo(() => {
    if (!Array.isArray(serviceAreas)) return []
    const services = new Set<string>()
    serviceAreas.forEach((area) => {
      if (area.mechanics && Array.isArray(area.mechanics)) {
        area.mechanics.forEach((mechanic: any) => {
          if (mechanic.services && Array.isArray(mechanic.services)) {
            mechanic.services.forEach((service: string) => services.add(service))
          }
        })
      }
    })
    return Array.from(services).sort()
  }, [serviceAreas])

  // Prepare map markers
  const mapMarkers = useMemo(() => {
    const markers = []

    // Add user location marker
    if (userLocation) {
      markers.push({
        id: "user-location",
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        title: "Your Location",
        info: userLocation.address || "Current Position",
        type: "user" as const,
      })
    }

    // Add service area markers
    if (Array.isArray(filteredAreas)) {
      filteredAreas.forEach((area) => {
        if (area.latitude && area.longitude && area.mechanics && Array.isArray(area.mechanics)) {
          markers.push({
            id: area.id.toString(),
            position: { lat: area.latitude, lng: area.longitude },
            title: `${area.name} Service Area`,
            info: `${area.mechanics.length} mechanics available • ${area.mechanics.map((m) => m.services?.slice(0, 2).join(", ")).join(" • ")}`,
            type: "provider" as const,
          })
        }
      })
    }

    return markers
  }, [filteredAreas, userLocation])

  const handleMechanicSelect = (mechanic: any, area: any) => {
    setSelectedMechanic({ ...mechanic, area })
    setShowLocationDialog(true)
  }

  const handleConfirmLocation = () => {
    if (selectedMechanic && onMechanicSelect) {
      onMechanicSelect(selectedMechanic)
    }
    setShowLocationDialog(false)
    setSelectedMechanic(null)
  }

  const handleCallMechanic = (phone: string) => {
    if (typeof window !== "undefined") {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        window.location.href = `tel:${phone}`
      } else {
        navigator.clipboard
          .writeText(phone)
          .then(() => {
            alert(`Phone number ${phone} copied to clipboard!`)
          })
          .catch(() => {
            alert(`Contact: ${phone}`)
          })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading nearby services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-slate-700/50 p-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100 hover:bg-slate-700/50 focus:border-emerald-500 focus:ring-emerald-500 cursor-pointer transition-all duration-200">
              <SelectValue placeholder="Select Service Area" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600 shadow-xl">
              <SelectItem value="all" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                All Service Areas ({uniqueAreas.length} available)
              </SelectItem>
              {uniqueAreas.map((area) => (
                <SelectItem
                  key={area}
                  value={area}
                  className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer transition-colors duration-150"
                >
                  📍 {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedServiceFilter} onValueChange={setSelectedServiceFilter}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100 hover:bg-slate-700/50 focus:border-emerald-500 focus:ring-emerald-500 cursor-pointer transition-all duration-200">
              <SelectValue placeholder="Select Service Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600 shadow-xl">
              <SelectItem value="all" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                All Services ({uniqueServices.length} types)
              </SelectItem>
              {uniqueServices.map((service) => (
                <SelectItem
                  key={service}
                  value={service}
                  className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer transition-colors duration-150"
                >
                  🔧 {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowMap(!showMap)}
            className="flex items-center space-x-2 border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 hover:border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500 cursor-pointer transition-all duration-200"
          >
            <Map className="w-4 h-4" />
            <span>{showMap ? "Hide Map" : "Show Map"}</span>
          </Button>
        </div>

        {/* Filter Status Indicators */}
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedArea !== "all" && (
            <Badge
              variant="secondary"
              className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30 cursor-pointer hover:bg-emerald-500/30 transition-colors"
              onClick={() => setSelectedArea("all")}
            >
              📍 {selectedArea} ✕
            </Badge>
          )}
          {selectedServiceFilter !== "all" && (
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-blue-400 border-blue-400/30 cursor-pointer hover:bg-blue-500/30 transition-colors"
              onClick={() => setSelectedServiceFilter("all")}
            >
              🔧 {selectedServiceFilter} ✕
            </Badge>
          )}
          {(selectedArea !== "all" || selectedServiceFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedArea("all")
                setSelectedServiceFilter("all")
                setSearchTerm("")
              }}
              className="text-slate-400 hover:text-slate-200 h-6 px-2 text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-emerald-400">All Services Available by Default</h3>
            <div className="mt-2 text-sm text-emerald-300">
              <p>
                Showing all service providers from Gujarat database. Use filters above to narrow down your search.
                {usingFallback && " Currently using live CSV data with accurate locations and contact info."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-slate-700/50 overflow-hidden shadow-xl">
          <div className="h-96">
            <LeafletMap
              center={
                userLocation
                  ? { lat: userLocation.latitude, lng: userLocation.longitude }
                  : { lat: 22.3072, lng: 73.1812 }
              }
              zoom={userLocation ? 12 : 11}
              markers={mapMarkers}
              className="w-full h-full"
              onMarkerClick={(markerId) => {
                const area = filteredAreas.find((a) => a.id.toString() === markerId)
                if (area && area.mechanics && area.mechanics.length > 0) {
                  handleMechanicSelect(area.mechanics[0], area)
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">
            Available Services ({Array.isArray(filteredAreas) ? filteredAreas.length : 0} areas found)
          </h3>
          {userLocation && (
            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
              <MapPin className="w-3 h-3 mr-1" />
              Location detected
            </Badge>
          )}
          {selectedService && selectedService !== "" && (
            <Badge className="bg-emerald-500/20 text-emerald-400">Filtered: {selectedService}</Badge>
          )}
        </div>

        {Array.isArray(filteredAreas) && filteredAreas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAreas.map((area) => (
              <Card
                key={area.id}
                className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/80 transition-all duration-200 shadow-xl"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-100">{area.name}</CardTitle>
                      {area.distance && (
                        <p className="text-sm text-emerald-400 font-medium">{area.distance.toFixed(1)} km away</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                      {area.mechanics && Array.isArray(area.mechanics) ? area.mechanics.length : 0} mechanics
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {area.mechanics &&
                    Array.isArray(area.mechanics) &&
                    area.mechanics.slice(0, 2).map((mechanic: any, index: number) => (
                      <div key={index} className="border border-slate-700/50 rounded-lg p-3 bg-slate-800/30">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-slate-100">{mechanic.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-slate-300 ml-1">{mechanic.rating}/5</span>
                              </div>
                              {mechanic.verified && (
                                <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {mechanic.services &&
                            Array.isArray(mechanic.services) &&
                            mechanic.services.slice(0, 3).map((service: string, serviceIndex: number) => (
                              <Badge
                                key={serviceIndex}
                                variant="secondary"
                                className="text-xs bg-emerald-500/20 text-emerald-400"
                              >
                                {service}
                              </Badge>
                            ))}
                          {mechanic.services && Array.isArray(mechanic.services) && mechanic.services.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-slate-600/50 text-slate-300">
                              +{mechanic.services.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleCallMechanic(mechanic.phone)}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50"
                            onClick={() => handleMechanicSelect(mechanic, area)}
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Select
                          </Button>
                        </div>
                      </div>
                    ))}

                  {area.mechanics && Array.isArray(area.mechanics) && area.mechanics.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/50"
                      onClick={() => onMechanicSelect && onMechanicSelect(area)}
                    >
                      View {area.mechanics.length - 2} more mechanics
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-100 mb-2">No services found</h3>
            <p className="text-slate-400">
              Try adjusting your search criteria or check back later for more service providers in your area.
            </p>
          </div>
        )}
      </div>

      {/* Location Confirmation Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Confirm Service Location</span>
            </DialogTitle>
          </DialogHeader>

          {selectedMechanic && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-100 mb-2">{selectedMechanic.name}</h3>
                <p className="text-sm text-slate-300 mb-2">{selectedMechanic.address}</p>
                <p className="text-sm text-slate-400 mb-3">{selectedMechanic.area?.name}</p>

                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-slate-300 ml-1">{selectedMechanic.rating}/5</span>
                  </div>
                  {selectedMechanic.verified && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Verified</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedMechanic.services &&
                    Array.isArray(selectedMechanic.services) &&
                    selectedMechanic.services.map((service: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400">
                        {service}
                      </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
                  <div>
                    <span>Lat: </span>
                    <span className="font-mono text-slate-300">{selectedMechanic.area?.latitude?.toFixed(6)}</span>
                  </div>
                  <div>
                    <span>Lng: </span>
                    <span className="font-mono text-slate-300">{selectedMechanic.area?.longitude?.toFixed(6)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs text-slate-500 mb-4">
                  <Clock className="w-3 h-3" />
                  <span>Available 24/7 for emergencies</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLocationDialog(false)}
                  className="flex-1 border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmLocation}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Location
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
