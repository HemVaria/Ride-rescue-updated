"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
// @ts-ignore
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiMzRjgzRjgiLz4KPHBhdGggZD0iTTEyLjUgNDFMMTIuNSAyNSIgc3Ryb2tlPSIjM0Y4M0Y4IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiMzRjgzRjgiLz4KPHBhdGggZD0iTTEyLjUgNDFMMTIuNSAyNSIgc3Ryb2tlPSIjM0Y4M0Y4IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+",
  shadowUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIyMC41IiByeD0iMjAuNSIgcnk9IjIwLjUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4=",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Custom icons
const createCustomIcon = (color: string, type: "user" | "provider") => {
  const iconSvg =
    type === "user"
      ? `<svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C19.4036 0 25 5.59644 25 12.5C25 19.4036 19.4036 25 12.5 25C5.59644 25 0 19.4036 0 12.5C0 5.59644 5.59644 0 12.5 0Z" fill="${color}"/>
        <path d="M12.5 41L12.5 25" stroke="${color}" strokeWidth="2"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      </svg>`
      : `<svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C19.4036 0 25 5.59644 25 12.5C25 19.4036 19.4036 25 12.5 25C5.59644 25 0 19.4036 0 12.5C0 5.59644 5.59644 0 12.5 0Z" fill="${color}"/>
        <path d="M12.5 41L12.5 25" stroke="${color}" strokeWidth="2"/>
        <path d="M8 10L12.5 14.5L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`

  return L.divIcon({
    html: iconSvg,
    className: "custom-div-icon",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
}

interface MapMarker {
  id: string
  position: { lat: number; lng: number }
  title: string
  info: string
  type: "user" | "provider"
}

interface LeafletMapProps {
  center: { lat: number; lng: number }
  zoom?: number
  markers?: MapMarker[]
  height?: string
  className?: string
  onMarkerClick?: (markerId: string) => void
}

function MapController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [map, center, zoom])

  return null
}

export function LeafletMap({
  center,
  zoom = 13,
  markers = [],
  height = "400px",
  className = "",
  onMarkerClick,
}: LeafletMapProps) {
  const mapRef = useRef<any | null>(null)

  useEffect(() => {
    // Invalidate size when component mounts to fix display issues
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize()
      }, 100)
    }
  }, [])

  return (
    <div style={{ height }} className={className}>
      {/* @ts-ignore */}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance: any) => { mapRef.current = mapInstance; }}
      >
        {/* @ts-ignore */}
        <TileLayer
          attribution={"&copy; OpenStreetMap contributors"}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          crossOrigin="anonymous"
        />

        <MapController center={center} zoom={zoom} />

        {markers.map((marker) => (
          // @ts-ignore
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            icon={createCustomIcon(marker.type === "user" ? "#3B82F6" : "#10B981", marker.type) as any}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(marker.id)
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-lg mb-2">{marker.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{marker.info}</p>
                {marker.type === "provider" && (
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                      onClick={() => { if (typeof window !== "undefined") window.open(`tel:+918200487838`, "_self") }}
                    >
                      Call
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}`,
                            "_blank",
                          )
                        }
                      }}
                    >
                      Navigate
                    </button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
