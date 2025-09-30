"use client"

import { useState, useEffect, useCallback } from "react"
import { loadGoogleMaps, isGoogleMapsAvailable, GoogleMapsGeocoder, GooglePlacesService } from "@/lib/google-maps"

interface Location {
  latitude: number
  longitude: number
  address: string
  addressComponents?: any
  accuracy?: number
  timestamp?: number
  placeId?: string
}

interface LocationError {
  message: string
  code?: string
  details?: string
}

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<LocationError | null>(null)
  const [geocoder, setGeocoder] = useState<GoogleMapsGeocoder | null>(null)
  const [placesService, setPlacesService] = useState<GooglePlacesService | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    const initGoogleMaps = async () => {
      setIsLoading(true)
      try {
        await loadGoogleMaps()
        setIsLoaded(true)

        if (isGoogleMapsAvailable()) {
          setGeocoder(new GoogleMapsGeocoder())
          setPlacesService(new GooglePlacesService())
        }
      } catch (err) {
        console.warn("Google Maps initialization failed, using fallback:", err)
        setIsLoaded(true) // Still set to true to allow fallback functionality
      } finally {
        setIsLoading(false)
      }
    }

    initGoogleMaps()
  }, [])

  const getCurrentLocation = useCallback(async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      setError(null)

      if (!navigator.geolocation) {
        const error = {
          message: "Geolocation is not supported by this browser",
          code: "GEOLOCATION_NOT_SUPPORTED",
        }
        setError(error)
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

          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          let addressComponents = undefined
          let placeId = undefined

          // Try to get address using Google Maps if available
          if (geocoder && isGoogleMapsAvailable()) {
            try {
              const result = await geocoder.reverseGeocode(latitude, longitude)
              address = result.address
              addressComponents = result.addressComponents
              placeId = result.placeId
            } catch (err) {
              console.warn("Google Maps reverse geocoding failed, using coordinates:", err)
            }
          }

          const locationData: Location = {
            latitude,
            longitude,
            address,
            addressComponents,
            accuracy,
            timestamp: Date.now(),
            placeId,
          }

          setLocation(locationData)
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
          reject(error)
        },
        options,
      )
    })
  }, [geocoder])

  const updateLocation = useCallback(
    async (input: { address?: string; latitude?: number; longitude?: number }): Promise<Location> => {
      setError(null)

      try {
        if (input.address && geocoder && isGoogleMapsAvailable()) {
          // Geocode address using Google Maps
          const result = await geocoder.geocodeAddress(input.address)
          const locationData: Location = {
            ...result,
            timestamp: Date.now(),
          }
          setLocation(locationData)
          return locationData
        } else if (input.latitude !== undefined && input.longitude !== undefined) {
          // Use provided coordinates
          let address = `${input.latitude.toFixed(6)}, ${input.longitude.toFixed(6)}`
          let addressComponents = undefined
          let placeId = undefined

          // Try reverse geocoding if Google Maps is available
          if (geocoder && isGoogleMapsAvailable()) {
            try {
              const result = await geocoder.reverseGeocode(input.latitude, input.longitude)
              address = result.address
              addressComponents = result.addressComponents
              placeId = result.placeId
            } catch (err) {
              console.warn("Reverse geocoding failed:", err)
            }
          }

          const locationData: Location = {
            latitude: input.latitude,
            longitude: input.longitude,
            address,
            addressComponents,
            timestamp: Date.now(),
            placeId,
          }
          setLocation(locationData)
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
        throw error
      }
    },
    [geocoder],
  )

  const searchPlaces = useCallback(
    async (query: string): Promise<any[]> => {
      if (!placesService || !isGoogleMapsAvailable()) {
        return []
      }

      try {
        const predictions = await placesService.getPlacePredictions(query, {
          types: ["address"],
          componentRestrictions: { country: "in" }, // Restrict to India
        })
        return predictions
      } catch (err) {
        console.warn("Places search failed:", err)
        return []
      }
    },
    [placesService],
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
    isLoaded,
    isLoading,
    location,
    error,
    getCurrentLocation,
    updateLocation,
    searchPlaces,
    clearError,
    isGoogleMapsAvailable: isGoogleMapsAvailable(),
    calculateDistance,
  }
}
