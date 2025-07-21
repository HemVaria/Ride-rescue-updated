"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Maximize2, Minimize2, Layers, Route } from "lucide-react"
import { isGoogleMapsAvailable } from "@/lib/google-maps"

interface GoogleMapViewProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{
    id: string
    position: { lat: number; lng: number }
    title: string
    info?: string
    type?: "user" | "provider" | "emergency"
  }>
  onMarkerClick?: (markerId: string) => void
  showTraffic?: boolean
  showDirections?: boolean
  directionsTo?: { lat: number; lng: number }
  className?: string
  height?: string
}

export function GoogleMapView({
  center = { lat: 28.6139, lng: 77.209 }, // Default to Delhi
  zoom = 13,
  markers = [],
  onMarkerClick,
  showTraffic = false,
  showDirections = false,
  directionsTo,
  className = "",
  height = "400px",
}: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const trafficLayerRef = useRef<any>(null)
  const directionsServiceRef = useRef<any>(null)
  const directionsRendererRef = useRef<any>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !isGoogleMapsAvailable()) return

    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#1f2937" }],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1f2937" }],
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#8b5cf6" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#374151" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0f172a" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      mapInstanceRef.current = map
      directionsServiceRef.current = new window.google.maps.DirectionsService()
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#8b5cf6",
          strokeWeight: 4,
        },
      })
      directionsRendererRef.current.setMap(map)

      setIsMapReady(true)
    }

    if (window.google && window.google.maps) {
      initMap()
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps)
          initMap()
        }
      }, 100)

      return () => clearInterval(checkGoogleMaps)
    }
  }, [center, zoom])

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: markerData.type === "user" ? "#8b5cf6" : markerData.type === "emergency" ? "#ef4444" : "#10b981",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      if (markerData.info) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #1f2937; padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold;">${markerData.title}</h3>
              <p style="margin: 0; font-size: 14px;">${markerData.info}</p>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker)
          onMarkerClick?.(markerData.id)
        })
      }

      markersRef.current.push(marker)
    })
  }, [markers, isMapReady, onMarkerClick])

  // Handle traffic layer
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return

    if (showTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new window.google.maps.TrafficLayer()
      }
      trafficLayerRef.current.setMap(mapInstanceRef.current)
    } else {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null)
      }
    }
  }, [showTraffic, isMapReady])

  // Handle directions
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady || !showDirections || !directionsTo) return

    const request = {
      origin: center,
      destination: directionsTo,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }

    directionsServiceRef.current.route(request, (result: any, status: string) => {
      if (status === "OK") {
        directionsRendererRef.current.setDirections(result)
      }
    })
  }, [center, directionsTo, showDirections, isMapReady])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!isGoogleMapsAvailable()) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="p-6 text-center">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Map view not available</p>
          <p className="text-sm text-gray-500">Google Maps integration is not configured</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`relative ${isFullscreen ? "fixed inset-0 z-50" : ""} ${className}`}>
      <Card className="bg-gray-800 border-gray-700 h-full">
        <CardContent className="p-0 relative">
          <div ref={mapRef} style={{ height: isFullscreen ? "100vh" : height }} className="w-full rounded-lg" />

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-white/90 text-gray-900 border-gray-300 hover:bg-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>

          {/* Map Legend */}
          {markers.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-900">Your Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-900">Service Provider</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-900">Emergency</span>
              </div>
            </div>
          )}

          {/* Traffic Badge */}
          {showTraffic && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-orange-500/20 text-orange-400">
                <Layers className="w-3 h-3 mr-1" />
                Traffic Layer
              </Badge>
            </div>
          )}

          {/* Directions Badge */}
          {showDirections && (
            <div className="absolute top-12 left-4">
              <Badge className="bg-blue-500/20 text-blue-400">
                <Route className="w-3 h-3 mr-1" />
                Directions
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
