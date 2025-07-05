// Google Maps API utilities
declare global {
  interface Window {
    google: any
  }
}

let isGoogleMapsLoaded = false
let isGoogleMapsLoading = false
let googleMapsPromise: Promise<void> | null = null

/**
 * Loads Google Maps if it's not already present.
 * You can optionally pass an `apiKey` – if omitted we assume the script tag
 * was injected by `GoogleMapsScript` (server component).
 */
export const loadGoogleMaps = (apiKey?: string): Promise<void> => {
  // Already loaded
  if (isGoogleMapsLoaded) return Promise.resolve()

  // Already loading somewhere else
  if (googleMapsPromise) return googleMapsPromise

  // If the global object is there we’re done
  if (typeof window !== "undefined" && window.google && window.google.maps) {
    isGoogleMapsLoaded = true
    return Promise.resolve()
  }

  // No script tag yet and no apiKey provided → we just wait for a tag that
  // another part of the app might inject (e.g. GoogleMapsScript in <head />)
  if (!apiKey) {
    googleMapsPromise = new Promise((resolve) => {
      const poll = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(poll)
          isGoogleMapsLoaded = true
          resolve()
        }
      }, 100)
    })
    return googleMapsPromise
  }

  // Inject a script tag ourselves when an apiKey is provided
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onload = () => {
      isGoogleMapsLoaded = true
      isGoogleMapsLoading = false
      resolve()
    }
    script.onerror = (err) => {
      console.error("Failed to load Google Maps:", err)
      isGoogleMapsLoading = false
      reject(err)
    }
    document.head.appendChild(script)
    isGoogleMapsLoading = true
  })

  return googleMapsPromise
}

export const isGoogleMapsAvailable = (): boolean =>
  typeof window !== "undefined" && !!window.google && !!window.google.maps

// Geocoding service
export class GoogleMapsGeocoder {
  private geocoder: any

  constructor() {
    if (isGoogleMapsAvailable()) {
      this.geocoder = new window.google.maps.Geocoder()
    }
  }

  async geocodeAddress(address: string): Promise<any> {
    if (!this.geocoder) {
      throw new Error("Google Maps Geocoder not available")
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results: any[], status: string) => {
        if (status === "OK" && results[0]) {
          const result = results[0]
          const location = result.geometry.location

          resolve({
            latitude: location.lat(),
            longitude: location.lng(),
            address: result.formatted_address,
            addressComponents: this.parseAddressComponents(result.address_components),
            placeId: result.place_id,
          })
        } else {
          reject(new Error(`Geocoding failed: ${status}`))
        }
      })
    })
  }

  async reverseGeocode(lat: number, lng: number): Promise<any> {
    if (!this.geocoder) {
      throw new Error("Google Maps Geocoder not available")
    }

    return new Promise((resolve, reject) => {
      const latlng = new window.google.maps.LatLng(lat, lng)

      this.geocoder.geocode({ location: latlng }, (results: any[], status: string) => {
        if (status === "OK" && results[0]) {
          const result = results[0]

          resolve({
            latitude: lat,
            longitude: lng,
            address: result.formatted_address,
            addressComponents: this.parseAddressComponents(result.address_components),
            placeId: result.place_id,
          })
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`))
        }
      })
    })
  }

  private parseAddressComponents(components: any[]): any {
    const parsed: any = {}

    components.forEach((component) => {
      const types = component.types

      if (types.includes("street_number")) {
        parsed.streetNumber = component.long_name
      }
      if (types.includes("route")) {
        parsed.streetName = component.long_name
      }
      if (types.includes("locality")) {
        parsed.city = component.long_name
      }
      if (types.includes("administrative_area_level_1")) {
        parsed.state = component.long_name
      }
      if (types.includes("postal_code")) {
        parsed.postalCode = component.long_name
      }
      if (types.includes("country")) {
        parsed.country = component.long_name
      }
    })

    return parsed
  }
}

// Places service
export class GooglePlacesService {
  private service: any
  private sessionToken: any

  constructor() {
    if (isGoogleMapsAvailable()) {
      this.service = new window.google.maps.places.AutocompleteService()
      this.sessionToken = new window.google.maps.places.AutocompleteSessionToken()
    }
  }

  async getPlacePredictions(input: string, options: any = {}): Promise<any[]> {
    if (!this.service) {
      return []
    }

    return new Promise((resolve, reject) => {
      const request = {
        input,
        sessionToken: this.sessionToken,
        ...options,
      }

      this.service.getPlacePredictions(request, (predictions: any[], status: string) => {
        if (status === "OK" && predictions) {
          resolve(predictions)
        } else if (status === "ZERO_RESULTS") {
          resolve([])
        } else {
          reject(new Error(`Places prediction failed: ${status}`))
        }
      })
    })
  }
}

// Directions service
export class GoogleMapsDirectionsService {
  private service: any

  constructor() {
    if (isGoogleMapsAvailable()) {
      this.service = new window.google.maps.DirectionsService()
    }
  }

  async getDirections(origin: any, destination: any, options: any = {}): Promise<any> {
    if (!this.service) {
      throw new Error("Google Maps Directions service not available")
    }

    return new Promise((resolve, reject) => {
      const request = {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        ...options,
      }

      this.service.route(request, (result: any, status: string) => {
        if (status === "OK") {
          resolve(result)
        } else {
          reject(new Error(`Directions request failed: ${status}`))
        }
      })
    })
  }
}
