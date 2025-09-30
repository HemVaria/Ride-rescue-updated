"use client"

import { useState, useCallback } from "react"

interface Location {
  latitude: number
  longitude: number
  address: string
  accuracy?: number
  timestamp?: number
  addressComponents?: {
    streetNumber?: string
    streetName?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

interface LocationError {
  message: string
  code?: string
  details?: string
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<LocationError | null>(null)

  const getCurrentLocation = useCallback(async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      setError(null)

      if (!navigator.geolocation) {
        const error = {
          message: "Geolocation is not supported by this browser",
          code: "GEOLOCATION_NOT_SUPPORTED",
        }
        setError(error)
        setLoading(false)
        reject(error)
        return
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords

          // Use coordinates as address fallback
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

          // Try to get a more readable address using reverse geocoding
          try {
            // Use a free geocoding service
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            )
            if (response.ok) {
              const data = await response.json()
              if (data.display_name) {
                address = data.display_name
              }
            }
          } catch (geocodeError) {
            console.warn("Reverse geocoding failed, using coordinates:", geocodeError)
          }

          const locationData: Location = {
            latitude,
            longitude,
            address,
            accuracy,
            timestamp: Date.now(),
          }

          setLocation(locationData)
          setLoading(false)
          resolve(locationData)
        },
        (err) => {
          let errorMessage = "Failed to get your location"
          let errorCode = "UNKNOWN_ERROR"
          let errorDetails = ""

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Location access denied"
              errorCode = "PERMISSION_DENIED"
              errorDetails = "Please enable location access in your browser settings"
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable"
              errorCode = "POSITION_UNAVAILABLE"
              errorDetails = "Your device cannot determine your location"
              break
            case err.TIMEOUT:
              errorMessage = "Location request timed out"
              errorCode = "TIMEOUT"
              errorDetails = "Please try again or check your GPS signal"
              break
          }

          const error = { message: errorMessage, code: errorCode, details: errorDetails }
          setError(error)
          setLoading(false)
          reject(error)
        },
        options,
      )
    })
  }, [])

  const updateLocation = useCallback(
    async (input: { address?: string; latitude?: number; longitude?: number }): Promise<Location> => {
      setLoading(true)
      setError(null)

      try {
        if (input.address) {
          // Geocode address using free service
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input.address)}&limit=1`,
          )
          if (response.ok) {
            const data = await response.json()
            if (data.length > 0) {
              const result = data[0]
              const locationData: Location = {
                latitude: Number.parseFloat(result.lat),
                longitude: Number.parseFloat(result.lon),
                address: result.display_name,
                timestamp: Date.now(),
              }
              setLocation(locationData)
              setLoading(false)
              return locationData
            }
          }
          throw new Error("Address not found")
        } else if (input.latitude !== undefined && input.longitude !== undefined) {
          // Use provided coordinates
          let address = `${input.latitude.toFixed(6)}, ${input.longitude.toFixed(6)}`

          // Try reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${input.latitude}&lon=${input.longitude}&zoom=18&addressdetails=1`,
            )
            if (response.ok) {
              const data = await response.json()
              if (data.display_name) {
                address = data.display_name
              }
            }
          } catch (geocodeError) {
            console.warn("Reverse geocoding failed:", geocodeError)
          }

          const locationData: Location = {
            latitude: input.latitude,
            longitude: input.longitude,
            address,
            timestamp: Date.now(),
          }
          setLocation(locationData)
          setLoading(false)
          return locationData
        } else {
          throw new Error("Invalid location input")
        }
      } catch (err: any) {
        const error = {
          message: err.message || "Failed to update location",
          code: "UPDATE_FAILED",
          details: "Please check your input and try again",
        }
        setError(error)
        setLoading(false)
        throw error
      }
    },
    [],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Calculate distance (metres) and rough driving duration (string) between two lat/lng pairs
   */
  const calculateDistance = useCallback(
    (
      origin: { lat: number; lng: number },
      destination: { lat: number; lng: number },
    ): { distance: number; duration: string } => {
      const R = 6371e3 // Earth radius in metres
      const toRad = (deg: number) => (deg * Math.PI) / 180
      const dLat = toRad(destination.lat - origin.lat)
      const dLng = toRad(destination.lng - origin.lng)
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) * Math.sin(dLng / 2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // metres

      // very rough ETA: assume 40 km/h urban avg
      const mins = Math.round((distance / 1000 / 40) * 60)
      const duration = mins < 60 ? `${mins} min` : `${Math.round(mins / 60)} hr`

      return { distance: Math.round(distance), duration }
    },
    [],
  )

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    updateLocation,
    clearError,
    calculateDistance,
  }
}
