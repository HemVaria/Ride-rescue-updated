"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Maximize2, Minimize2 } from "lucide-react"

/**
 * VERY light-weight “map” implementation that just embeds a static
 * OpenStreetMap tile and shows markers.  Meant as a placeholder
 * until a full mapping library (Leaflet, Google Maps, etc.) is wired up.
 */
export interface MapViewProps {
  location?: { latitude: number; longitude: number; address: string }
  /**
   * Extra markers – e.g. service providers.
   */
  markers?: Array<{
    id: string
    latitude: number
    longitude: number
    label: string
  }>
  height?: string
  className?: string
}

export function MapView({ location, markers = [], height = "400px", className = "" }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setFullscreen] = useState(false)

  /* paint a very simple “static map” onto the div -------------------- */
  useEffect(() => {
    if (!mapRef.current || !location) return

    const container = mapRef.current
    container.innerHTML = "" // clear previous render

    /* tile */
    const tile = document.createElement("div")
    tile.style.width = "100%"
    tile.style.height = "100%"
    tile.style.background = "#0f172a url('https://tile.openstreetmap.org/0/0/0.png') center/cover"
    container.appendChild(tile)

    /* user marker */
    const user = document.createElement("div")
    user.style.position = "absolute"
    user.style.left = "50%"
    user.style.top = "50%"
    user.style.transform = "translate(-50%, -50%)"
    user.style.width = "20px"
    user.style.height = "20px"
    user.style.borderRadius = "50%"
    user.style.background = "#8b5cf6"
    tile.appendChild(user)

    /* extra markers */
    markers.forEach((m, idx) => {
      const mk = document.createElement("div")
      mk.title = m.label
      mk.style.position = "absolute"
      mk.style.left = `${50 + (idx + 1) * 10}%`
      mk.style.top = `${50}%`
      mk.style.transform = "translate(-50%, -50%)"
      mk.style.width = "14px"
      mk.style.height = "14px"
      mk.style.borderRadius = "50%"
      mk.style.background = "#f59e0b"
      tile.appendChild(mk)
    })
  }, [location, markers])

  /* ------------------------------------------------------------------ */
  /* helpers                                                            */
  /* ------------------------------------------------------------------ */
  const openInMaps = () => {
    if (!location) return
    window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, "_blank")
  }

  /* ------------------------------------------------------------------ */
  /* render                                                             */
  /* ------------------------------------------------------------------ */
  if (!location) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-400">No location data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${isFullscreen ? "fixed inset-4 z-50" : ""} ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-400" />
            Map
          </span>
          <span className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={openInMaps}>
              <Navigation className="h-4 w-4" />
            </Button>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div
          ref={mapRef}
          style={{ height: isFullscreen ? "calc(100vh - 200px)" : height }}
          className="w-full overflow-hidden rounded-lg"
        >
          {/* the dummy map is painted by useEffect */}
        </div>
      </CardContent>
    </Card>
  )
}

export default MapView
