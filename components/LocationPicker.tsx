"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Loader2, AlertCircle, Check, X, Map, Target } from "lucide-react"
import { useLocation } from "@/hooks/useLocation"

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address: string }) => void
  initialLocation?: { latitude: number; longitude: number; address: string }
  title?: string
  showMap?: boolean
  allowManualCoordinates?: boolean
}

export function LocationPicker({
  onLocationSelect,
  initialLocation,
  title = "Select Location",
  showMap = true,
  allowManualCoordinates = false,
}: LocationPickerProps) {
  const { location, loading, error, getCurrentLocation, updateLocation, clearError } = useLocation()

  const [manualAddress, setManualAddress] = useState("")
  const [manualLat, setManualLat] = useState("")
  const [manualLng, setManualLng] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [inputMode, setInputMode] = useState<"address" | "coordinates">("address")

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
    } catch (err) {
      console.error("Failed to get location:", err)
    }
  }

  const handleAddressSearch = async () => {
    if (!manualAddress.trim()) return

    setSearchLoading(true)
    clearError()

    try {
      const result = await updateLocation({ address: manualAddress.trim() })
      setSelectedLocation(result)
      setManualAddress("")
    } catch (err) {
      console.error("Address search failed:", err)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleCoordinateSearch = async () => {
    const lat = Number.parseFloat(manualLat)
    const lng = Number.parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng)) {
      return
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return
    }

    setSearchLoading(true)
    clearError()

    try {
      const result = await updateLocation({ latitude: lat, longitude: lng })
      setSelectedLocation(result)
      setManualLat("")
      setManualLng("")
    } catch (err) {
      console.error("Coordinate search failed:", err)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation)
    }
  }

  const openInMaps = () => {
    if (selectedLocation) {
      const url = `https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current/Selected Location Display */}
          {selectedLocation && (
            <div className="bg-gray-900 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">Selected Location</h4>
                  <p className="text-sm text-gray-300 mb-2">{selectedLocation.address}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>
                      <span>Lat: </span>
                      <span className="font-mono">{selectedLocation.latitude.toFixed(6)}</span>
                    </div>
                    <div>
                      <span>Lng: </span>
                      <span className="font-mono">{selectedLocation.longitude.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
                {selectedLocation.accuracy && (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    ±{Math.round(selectedLocation.accuracy)}m
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
                {showMap && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInMaps}
                    className="border-gray-600 text-gray-300 bg-transparent"
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

          {/* Error Display */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-400 text-sm">{error.message}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearError} className="text-red-400 hover:text-red-300 p-1">
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Get Current Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Current Location</Label>
            <Button
              onClick={handleGetCurrentLocation}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Use Current Location
                </>
              )}
            </Button>
          </div>

          {/* Manual Input Mode Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={inputMode === "address" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("address")}
              className={
                inputMode === "address" ? "bg-purple-600 text-white" : "border-gray-600 text-gray-300 bg-transparent"
              }
            >
              Address
            </Button>
            {allowManualCoordinates && (
              <Button
                variant={inputMode === "coordinates" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("coordinates")}
                className={
                  inputMode === "coordinates"
                    ? "bg-purple-600 text-white"
                    : "border-gray-600 text-gray-300 bg-transparent"
                }
              >
                Coordinates
              </Button>
            )}
          </div>

          {/* Address Input */}
          {inputMode === "address" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Enter Address</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter street address, city, or landmark..."
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="flex-1 bg-gray-900 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === "Enter" && handleAddressSearch()}
                  disabled={searchLoading}
                />
                <Button
                  onClick={handleAddressSearch}
                  disabled={searchLoading || !manualAddress.trim()}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Try: "123 Main St, New York" or "Central Park, NYC"</p>
            </div>
          )}

          {/* Coordinates Input */}
          {inputMode === "coordinates" && allowManualCoordinates && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Enter Coordinates</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    placeholder="Latitude"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white"
                    disabled={searchLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">-90 to 90</p>
                </div>
                <div>
                  <Input
                    placeholder="Longitude"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white"
                    disabled={searchLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">-180 to 180</p>
                </div>
              </div>
              <Button
                onClick={handleCoordinateSearch}
                disabled={searchLoading || !manualLat.trim() || !manualLng.trim()}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white"
              >
                {searchLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Find Location
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
