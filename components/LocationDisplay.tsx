"use client"

import { useState } from "react"
import { MapPin, RefreshCw, Edit3, Check, X, AlertCircle, Clock, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useLocation } from "@/hooks/useLocation"

export interface LocationDisplayProps {
  /**
   * Fires when the user clicks “Confirm Location”.
   */
  onLocationConfirm?: (loc: {
    latitude: number
    longitude: number
    address: string
  }) => void
  /**
   * Show / hide various action buttons.
   */
  showConfirmButton?: boolean
  showEditButton?: boolean
  showMapButton?: boolean
  /**
   * When `compact` is true the component collapses into a small line-item.
   */
  compact?: boolean
  className?: string
}

export function LocationDisplay({
  onLocationConfirm,
  showConfirmButton = false,
  showEditButton = true,
  showMapButton = true,
  compact = false,
  className = "",
}: LocationDisplayProps) {
  /* ------------------------------------------------------------------ */
  /* hooks & local state                                                */
  /* ------------------------------------------------------------------ */
  const { location, loading, error, getCurrentLocation, updateLocation, clearError } = useLocation()

  const [isEditing, setIsEditing] = useState(false)
  const [editedAddress, setEditedAddress] = useState("")
  const [saving, setSaving] = useState(false)

  /* ------------------------------------------------------------------ */
  /* helpers                                                            */
  /* ------------------------------------------------------------------ */
  const accuracyBadge = location?.accuracy ? (
    <Badge
      className={
        location.accuracy <= 10
          ? "bg-green-500/20 text-green-400 text-xs"
          : location.accuracy <= 50
            ? "bg-yellow-500/20 text-yellow-400 text-xs"
            : "bg-red-500/20 text-red-400 text-xs"
      }
    >
      ±{Math.round(location.accuracy)} m
    </Badge>
  ) : null

  const ageString = (() => {
    if (!location?.timestamp) return null
    const minutes = Math.floor((Date.now() - location.timestamp) / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} h ago`
    const days = Math.floor(hours / 24)
    return `${days} d ago`
  })()

  /* ------------------------------------------------------------------ */
  /* event handlers                                                     */
  /* ------------------------------------------------------------------ */
  const handleSave = async () => {
    if (!editedAddress.trim()) return
    setSaving(true)
    try {
      await updateLocation({ address: editedAddress.trim() })
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleConfirm = () => {
    if (location && onLocationConfirm) onLocationConfirm(location)
  }

  const openInMaps = () => {
    if (!location) return
    window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, "_blank")
  }

  /* ------------------------------------------------------------------ */
  /* compact mode                                                       */
  /* ------------------------------------------------------------------ */
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <MapPin className="w-4 h-4 text-purple-400" />
        <span className="truncate text-sm">{location?.address ?? "Location unavailable"}</span>
        {showEditButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditedAddress(location?.address ?? "")
              setIsEditing(true)
            }}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  /* ------------------------------------------------------------------ */
  /* full card                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            Your Location
          </span>
          <span className="flex items-center gap-2">
            {accuracyBadge}
            <Button variant="ghost" size="icon" disabled={loading} onClick={() => getCurrentLocation()}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* -------------------------------------------------------------- */}
        {/* error banner                                                  */}
        {/* -------------------------------------------------------------- */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/10 p-3">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <div className="flex-1 text-sm text-red-300">{error.message}</div>
            <Button size="icon" variant="ghost" onClick={clearError} className="text-red-300">
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* address (view / edit)                                         */}
        {/* -------------------------------------------------------------- */}
        <div className="space-y-2">
          <Label className="text-sm">Address</Label>

          {isEditing ? (
            <>
              <Input
                value={editedAddress}
                onChange={(e) => setEditedAddress(e.target.value)}
                className="bg-gray-900 text-white"
                placeholder="Enter address"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving || !editedAddress.trim()}>
                  {saving ? <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> : <Check className="mr-1 h-3 w-3" />}
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-1 h-3 w-3" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-gray-900 p-3">
              <p>{location?.address ?? "—"}</p>
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* coordinates + meta                                            */}
        {/* -------------------------------------------------------------- */}
        {location && (
          <>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-900 p-3 text-sm font-mono">
              <div>
                <span className="text-gray-400">Lat:</span> {location.latitude.toFixed(6)}
              </div>
              <div>
                <span className="text-gray-400">Lng:</span> {location.longitude.toFixed(6)}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {ageString}
              </span>
              {location.accuracy && <>±{Math.round(location.accuracy)} m</>}
            </div>
          </>
        )}

        {/* -------------------------------------------------------------- */}
        {/* action buttons                                                */}
        {/* -------------------------------------------------------------- */}
        <div className="flex flex-wrap gap-2">
          {showEditButton && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditedAddress(location?.address ?? "")
                setIsEditing(true)
              }}
            >
              <Edit3 className="mr-1 h-3 w-3" />
              Edit
            </Button>
          )}

          {showMapButton && location && (
            <Button variant="outline" size="sm" onClick={openInMaps}>
              <Map className="mr-1 h-3 w-3" />
              Open Map
            </Button>
          )}

          {showConfirmButton && location && (
            <Button size="sm" onClick={handleConfirm}>
              <Check className="mr-1 h-3 w-3" />
              Confirm
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LocationDisplay
