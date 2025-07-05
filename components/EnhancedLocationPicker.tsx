"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Check, AlertCircle, Clock, Map, Target, Search } from "lucide-react"
import { useGoogleMaps } from "@/hooks/useGoogleMaps"
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete"
import { GoogleMapView } from "./GoogleMapView"

interface EnhancedLocationPickerProps {
  onLocationConfirm: (location: { latitude: number; longitude: number; address: string }) => void
  initialLocation?: { latitude: number; longitude: number; address: string }
  title?: string
  showMap?: boolean
  className?: string
}

export function EnhancedLocationPicker({
  onLocationConfirm,
  initialLocation,
  title = "Select Your Location",
  showMap = true,
  className = "",
}: EnhancedLocationPickerProps) {
  const {
    isLoaded,
    isLoading,
    location,
    error,
    getCurrentLocation,
    updateLocation,
    clearError,
    isGoogleMapsAvailable,
  } = useGoogleMaps()

  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [confirmationStep, setConfirmationStep] = useState(false)
  const [activeTab, setActiveTab] = useState("current")

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation)
    } else if (location) {
      setSelectedLocation(location)
    }
  }, [initialLocation, location])

  const handleGetCurrentLocation = async () => {
    try {
      const currentLocation = await getCurrentLocation()
      setSelectedLocation(currentLocation)
      setActiveTab("current")
    } catch (err) {
      console.error("Failed to get current location:", err)
    }
  }

  const handlePlaceSelect = async (place: any) => {
    try {
      const result = await updateLocation({ address: place.description })
      setSelectedLocation(result)
      setActiveTab("search")
    } catch (err) {
      console.error("Failed to select place:", err)
    }
  }

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setConfirmationStep(true)
    }
  }

  const handleFinalConfirm = () => {
    if (selectedLocation) {
      onLocationConfirm(selectedLocation)
    }
  }

  const getAccuracyBadge = (accuracy?: number) => {
    if (!accuracy) return null

    let color = "bg-gray-500/20 text-gray-400"
    let text = "Unknown"

    if (accuracy <= 10) {
      color = "bg-green-500/20 text-green-400"
      text = "High Accuracy"
    } else if (accuracy <= 50) {
      color = "bg-yellow-500/20 text-yellow-400"
      text = "Medium Accuracy"
    } else {
      color = "bg-red-500/20 text-red-400"
      text = "Low Accuracy"
    }

    return (
      <Badge className={`${color} text-xs`}>
        {text} (±{Math.round(accuracy)}m)
      </Badge>
    )
  }

  const getTimestamp = (timestamp?: number) => {
    if (!timestamp) return null

    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (confirmationStep && selectedLocation) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span>Confirm Your Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Details */}
          <div className="bg-gray-900 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-2">Selected Location</h4>
                <p className="text-gray-300 mb-3">{selectedLocation.address}</p>

                {selectedLocation.addressComponents && (
                  <div className="space-y-1 text-sm text-gray-400">
                    {selectedLocation.addressComponents.streetNumber &&
                      selectedLocation.addressComponents.streetName && (
                        <p>
                          <span className="text-gray-500">Street: </span>
                          {selectedLocation.addressComponents.streetNumber}{" "}
                          {selectedLocation.addressComponents.streetName}
                        </p>
                      )}
                    {selectedLocation.addressComponents.city && (
                      <p>
                        <span className="text-gray-500">City: </span>
                        {selectedLocation.addressComponents.city}
                      </p>
                    )}
                    {selectedLocation.addressComponents.state && (
                      <p>
                        <span className="text-gray-500">State: </span>
                        {selectedLocation.addressComponents.state}
                      </p>
                    )}
                    {selectedLocation.addressComponents.postalCode && (
                      <p>
                        <span className="text-gray-500">PIN Code: </span>
                        {selectedLocation.addressComponents.postalCode}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-700 text-sm">
                  <div>
                    <span className="text-gray-500">Latitude:</span>
                    <p className="text-white font-mono">{selectedLocation.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Longitude:</span>
                    <p className="text-white font-mono">{selectedLocation.longitude.toFixed(6)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {getAccuracyBadge(selectedLocation.accuracy)}
                {selectedLocation.timestamp && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{getTimestamp(selectedLocation.timestamp)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Preview */}
          {showMap && isGoogleMapsAvailable && (
            <GoogleMapView
              center={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
              zoom={16}
              markers={[
                {
                  id: "selected",
                  position: { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
                  title: "Selected Location",
                  info: selectedLocation.address,
                  type: "user",
                },
              ]}
              height="200px"
            />
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setConfirmationStep(false)}
              className="flex-1 border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
            >
              Back to Edit
            </Button>
            <Button onClick={handleFinalConfirm} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
              <Check className="w-4 h-4 mr-2" />
              Confirm Location
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <MapPin className="w-5 h-5 text-purple-400" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 text-sm">{error.message}</p>
              {error.details && <p className="text-red-300 text-xs mt-1">{error.details}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={clearError} className="text-red-400 hover:text-red-300 p-1">
              ×
            </Button>
          </div>
        )}

        {/* Location Selection Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="current" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Current Location
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-2" />
              Search Address
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="text-center py-4">
              <Navigation className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">Use your device's GPS to get your current location</p>
              <Button
                onClick={handleGetCurrentLocation}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Get Current Location
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Search for an address</label>
              <GooglePlacesAutocomplete
                onPlaceSelect={handlePlaceSelect}
                placeholder="Enter street address, landmark, or area..."
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">Try: "Connaught Place, New Delhi" or "Mumbai Central Station"</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="bg-gray-900 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Selected Location</h4>
                <p className="text-gray-300 text-sm mb-2">{selectedLocation.address}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>
                    <span>Lat: </span>
                    <span className="font-mono text-white">{selectedLocation.latitude.toFixed(6)}</span>
                  </div>
                  <div>
                    <span>Lng: </span>
                    <span className="font-mono text-white">{selectedLocation.longitude.toFixed(6)}</span>
                  </div>
                </div>
              </div>
              {getAccuracyBadge(selectedLocation.accuracy)}
            </div>

            <div className="flex space-x-2">
              {showMap && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`
                    window.open(url, "_blank")
                  }}
                  className="border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                >
                  <Map className="w-3 h-3 mr-1" />
                  View on Map
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleConfirmLocation}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Check className="w-3 h-3 mr-1" />
                Use This Location
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
