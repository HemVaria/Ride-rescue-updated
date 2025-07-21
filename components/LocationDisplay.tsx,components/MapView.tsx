"use client"

\`\`\`tsx

interface LocationDisplayProps {
  latitude: number | null
  longitude: number | null
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ latitude, longitude }) => {
  return (
    <div>
      {latitude !== null && longitude !== null ? (
        <p>
          Latitude: {latitude}, Longitude: {longitude}
        </p>
      ) : (
        <p>Location not available.</p>
      )}
    </div>
  )
}

export default LocationDisplay
\`\`\`

\`\`\`tsx
// components/MapView.tsx
import type React from "react"
import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFuaWVsYmVuaW5pIiwiYSI6ImNsa3B5c2VwZTA4YnkzcG1yZ3RkMXV6a2wifQ.i9-iEd9a0t-y9G0_X-z-yg"

interface MapViewProps {
  latitude: number | null
  longitude: number | null
}

const MapView: React.FC<MapViewProps> = ({ latitude, longitude }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (latitude === null || longitude === null) {
      return
    }

    if (map.current) return // map already initialized

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom: 12,
    })

    map.current.on("load", () => {
      new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current!)
    })

    return () => map.current?.remove()
  }, [latitude, longitude])

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
}

export default MapView
\`\`\`
