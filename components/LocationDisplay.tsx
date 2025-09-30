"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Edit3, Check, X, AlertCircle, RefreshCw, Clock, Map } from "lucide-react"
import { useLocation } from "@/hooks/useLocation"

export interface LocationDisplayProps {
  address: string
  coordinates?: { lat: number; lng: number }
  onLocationConfirm?: (location: { latitude: number; longitude: number; address: string }) => void
  showConfirmButton?: boolean
  showEditButton?: boolean
  showMapButton?: boolean
  compact?: boolean
  className?: string
}

export function LocationDisplay({
  address,
  coordinates,
  onLocationConfirm,
  showConfirmButton = false,
  showEditButton = true,
  showMapButton = true,
  compact = false,
  className = "",
}: LocationDisplayProps) {
  const { location, loading, error, getCurrentLocation, updateLocation, clearError } = useLocation()

  const [isEditing, setIsEditing] = useState(false)
  const [editedAddress, setEditedAddress] = useState("")
  const [editLoading, setEditLoading] = useState(false)

  const handleEdit = () => {
    setEditedAddress(location?.address || "")
    setIsEditing(true)
    clearError()
  }

  const handleSaveEdit = async () => {
    if (!editedAddress.trim()) return

    setEditLoading(true)
    try {
      await updateLocation({ address: editedAddress.trim() })
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to update location:", err)
    } finally {
      setEditLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedAddress("")
    clearError()
  }

  const handleRefreshLocation = async () => {
    try {
      await getCurrentLocation()
    } catch (err) {
      console.error("Failed to refresh location:", err)
    }
  }

  const handleConfirmLocation = () => {
    if (location && onLocationConfirm) {
      onLocationConfirm(location)
    }
  }

  const getAccuracyBadge = () => {
    if (!location?.accuracy) return null

    const accuracy = location.accuracy
    let color = "bg-gray-500/20 text-gray-400"
    let text = "Unknown"

    if (accuracy <= 10) {
      color = "bg-green-500/20 text-green-400"
      text = "High"
    } else if (accuracy <= 50) {
      color = "bg-yellow-500/20 text-yellow-400"
      text = "Medium"
    } else {
      color = "bg-red-500/20 text-red-400"
      text = "Low"
    }

    return (
      <Badge className={`${color} text-xs`}>
        {text} ({Math.round(accuracy)}m)
      </Badge>
    )
  }

  const getTimestamp = () => {
    if (!location?.timestamp) return null

    const now = Date.now()
    const diff = now - location.timestamp
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {location ? (
            <p className="text-sm text-gray-300 truncate">{location.address}</p>
          ) : (
            <p className="text-sm text-gray-500">Location not available</p>
          )}
        </div>
        {showEditButton && (
          <Button variant="ghost" size="sm" onClick={handleEdit} className="text-gray-400 hover:text-white p-1">
            <Edit3 className="w-3 h-3" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            {getAccuracyBadge()}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshLocation}
              disabled={loading}
              className="text-gray-400 hover:text-white p-1"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-medium">{error.message}</p>
              {error.details && <p className="text-red-300 text-xs mt-1">{error.details}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={clearError} className="text-red-400 hover:text-red-300 p-1">
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {location ? (
          <div className="space-y-4">
            {/* Address Display/Edit */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Address</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                    placeholder="Enter your address..."
                    className="bg-gray-900 border-gray-600 text-white"
                    disabled={editLoading}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={editLoading || !editedAddress.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {editLoading ? (
                        <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                      ) : (
                        <Check className="w-3 h-3 mr-1" />
                      )}
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={editLoading}
                      className="border-gray-600 text-gray-300 bg-transparent"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-white font-medium">{location.address}</p>
                  {location.addressComponents && (
                    <div className="mt-2 space-y-1 text-sm text-gray-400">
                      {location.addressComponents.streetNumber && location.addressComponents.streetName && (
                        <p>
                          {location.addressComponents.streetNumber} {location.addressComponents.streetName}
                        </p>
                      )}
                      {location.addressComponents.city && (
                        <p>
                          {location.addressComponents.city}, {location.addressComponents.state}{" "}
                          {location.addressComponents.postalCode}
                        </p>
                      )}
                      {location.addressComponents.country && <p>{location.addressComponents.country}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Coordinates */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Coordinates</Label>
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Latitude:</span>
                    <p className="text-white font-mono">{location.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Longitude:</span>
                    <p className="text-white font-mono">{location.longitude.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{getTimestamp()}</span>
              </div>
              {location.accuracy && <span>±{Math.round(location.accuracy)}m accuracy</span>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {!isEditing && showEditButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="border-gray-600 text-gray-300 bg-transparent"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit Address
                </Button>
              )}

              {showMapButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
                    if (typeof window !== "undefined") {
                      window.open(url, "_blank")
                    }
                  }}
                  className="border-gray-600 text-gray-300 bg-transparent"
                >
                  <Map className="w-3 h-3 mr-1" />
                  View on Map
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshLocation}
                disabled={loading}
                className="border-gray-600 text-gray-300 bg-transparent"
              >
                <Navigation className="w-3 h-3 mr-1" />
                Update Location
              </Button>

              {showConfirmButton && (
                <Button
                  size="sm"
                  onClick={handleConfirmLocation}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Confirm Location
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">{loading ? "Getting your location..." : "Location not available"}</p>
            <Button
              onClick={handleRefreshLocation}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Current Location
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LocationDisplay
