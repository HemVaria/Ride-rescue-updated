"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Maximize2, Minimize2, RefreshCw } from "lucide-react"
import { LeafletMap } from "@/components/ui/leaflet-map"

interface MapViewProps {
  location?: {
    latitude: number
    longitude: number
    address: string
    accuracy?: number
  }
  providers?: Array<{
    id: string
    name: string
    latitude: number
    longitude: number
    eta: string
    rating: number
  }>
  height?: string
  showControls?: boolean
  onLocationUpdate?: (location: { latitude: number; longitude: number; address: string }) => void
  center: { lat: number; lng: number }
  zoom?: number
  className?: string
}

export function MapView({
  location,
  providers = [],
  height = "400px",
  showControls = true,
  onLocationUpdate,
  center,
  zoom = 13,
  className = "",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Initialize map with OpenStreetMap (free alternative to Google Maps)
  useEffect(() => {
    if (!mapRef.current || !location) return

    const initMap = async () => {
      try {
        // Create a simple map using Leaflet-like approach with static tiles
        const mapContainer = mapRef.current!
        mapContainer.innerHTML = ""

        // Create map wrapper
        const mapWrapper = document.createElement("div")
        mapWrapper.style.cssText = `
          width: 100%;
          height: 100%;
          position: relative;
          background: #1f2937;
          border-radius: 8px;
          overflow: hidden;
        `

        // Create tile layer using OpenStreetMap
        const tileLayer = document.createElement("div")
        tileLayer.style.cssText = `
          width: 100%;
          height: 100%;
          background-image: url('https://tile.openstreetmap.org/${Math.floor(Math.log2((156543.03392 * Math.cos((location.latitude * Math.PI) / 180)) / 256))}/${Math.floor(((location.longitude + 180) / 360) * Math.pow(2, Math.floor(Math.log2((156543.03392 * Math.cos((location.latitude * Math.PI) / 180)) / 256))))}/${Math.floor(((1 - Math.log(Math.tan((location.latitude * Math.PI) / 180) + 1 / Math.cos((location.latitude * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, Math.floor(Math.log2((156543.03392 * Math.cos((location.latitude * Math.PI) / 180)) / 256))))}.png');
          background-size: cover;
          background-position: center;
          position: relative;
        `

        // Create location marker
        const marker = document.createElement("div")
        marker.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: #8b5cf6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          z-index: 10;
        `

        // Add accuracy circle if available
        if (location.accuracy) {
          const accuracyCircle = document.createElement("div")
          const radiusInPixels = Math.min(location.accuracy / 10, 100) // Approximate conversion
          accuracyCircle.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${radiusInPixels * 2}px;
            height: ${radiusInPixels * 2}px;
            border: 2px solid #8b5cf6;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.1);
            z-index: 5;
          `
          tileLayer.appendChild(accuracyCircle)
        }

        // Add provider markers
        providers.forEach((provider, index) => {
          const providerMarker = document.createElement("div")
          const offsetX = (provider.longitude - location.longitude) * 100 // Approximate positioning
          const offsetY = (location.latitude - provider.latitude) * 100

          providerMarker.style.cssText = `
            position: absolute;
            top: calc(50% + ${offsetY}px);
            left: calc(50% + ${offsetX}px);
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background: #f59e0b;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 8;
          `

          // Add provider tooltip
          const tooltip = document.createElement("div")
          tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            margin-bottom: 4px;
            opacity: 0;
            transition: opacity 0.2s;
          `
          tooltip.textContent = `${provider.name} (${provider.eta})`

          providerMarker.appendChild(tooltip)
          providerMarker.addEventListener("mouseenter", () => {
            tooltip.style.opacity = "1"
          })
          providerMarker.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0"
          })

          tileLayer.appendChild(providerMarker)
        })

        tileLayer.appendChild(marker)
        mapWrapper.appendChild(tileLayer)

        // Add address overlay
        const addressOverlay = document.createElement("div")
        addressOverlay.style.cssText = `
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 20;
        `
        addressOverlay.textContent = location.address
        mapWrapper.appendChild(addressOverlay)

        mapContainer.appendChild(mapWrapper)
        setMapLoaded(true)
        setMapError(null)
      } catch (error) {
        console.error("Map initialization failed:", error)
        setMapError("Failed to load map")
        setMapLoaded(false)
      }
    }

    initMap()
  }, [location, providers])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      window.open(url, "_blank")
    }
  }

  const refreshMap = () => {
    setMapLoaded(false)
    setMapError(null)
    // Trigger re-render
    setTimeout(() => {
      if (mapRef.current && location) {
        // Re-initialize map
        const event = new Event("resize")
        window.dispatchEvent(event)
      }
    }, 100)
  }

  if (!location) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No location data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span>Location Map</span>
            {location.accuracy && (
              <Badge className="bg-green-500/20 text-green-400 text-xs">±{Math.round(location.accuracy)}m</Badge>
            )}
          </div>
          {showControls && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={refreshMap} className="text-gray-400 hover:text-white p-1">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-white p-1"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <LeafletMap
          center={center}
          zoom={zoom}
          height={isFullscreen ? "calc(100vh - 200px)" : height}
          className={className}
          markers={providers.map((provider) => ({
            id: provider.id,
            position: { lat: provider.latitude, lng: provider.longitude },
            tooltip: `${provider.name} (${provider.eta})`,
          }))}
        />
        {mapError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">{mapError}</p>
              <Button onClick={openInGoogleMaps} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Navigation className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
            </div>
          </div>
        ) : !mapLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Loading map...</p>
            </div>
          </div>
        ) : null}

        {showControls && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-400">
              {providers.length > 0 && (
                <span>
                  {providers.length} service provider{providers.length !== 1 ? "s" : ""} nearby
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={openInGoogleMaps}
              className="border-gray-600 text-gray-300 bg-transparent"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Open in Maps
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MapView
