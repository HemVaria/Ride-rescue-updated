"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Mechanic {
  id: string
  name: string
  phone: string
  services: string[]
  rating: number
  verified: boolean
  address: string
}

interface ServiceArea {
  id: string
  name: string
  latitude: number
  longitude: number
  mechanics: Mechanic[]
}

export function useServiceAreas() {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    loadServiceAreas()
  }, [])

  const loadServiceAreas = async () => {
    try {
      setLoading(true)

      // Try to load from database first
      const { data: dbData, error: dbError } = await supabase.from("service_areas").select("*").order("name")

      if (dbError || !dbData || dbData.length === 0) {
        // Use fallback CSV data
        setUsingFallback(true)
        setServiceAreas(getFallbackServiceAreas())
        setError(null)
      } else {
        setUsingFallback(false)
        setServiceAreas(dbData)
        setError(null)
      }
    } catch (err) {
      console.error("Error loading service areas:", err)
      setUsingFallback(true)
      setServiceAreas(getFallbackServiceAreas())
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const getFallbackServiceAreas = (): ServiceArea[] => {
    return [
      {
        id: "1",
        name: "Akota Circle",
        latitude: 22.2928,
        longitude: 73.2081,
        mechanics: [
          {
            id: "m1",
            name: "Rajesh Auto Garage",
            phone: "+919876543210",
            services: ["Engine Repair", "AC Service", "General Service", "Brake Service"],
            rating: 4.5,
            verified: true,
            address: "Shop 149, Akota Circle, Vadodara",
          },
          {
            id: "m2",
            name: "Akota Motors",
            phone: "+919876543211",
            services: ["Emergency Towing", "Jump Start Service", "Fuel Delivery"],
            rating: 4.2,
            verified: true,
            address: "Near Akota Circle, Vadodara",
          },
        ],
      },
      {
        id: "2",
        name: "Alkapuri",
        latitude: 22.3178,
        longitude: 73.1734,
        mechanics: [
          {
            id: "m3",
            name: "Alkapuri Service Center",
            phone: "+919876543212",
            services: ["Engine Repair", "AC Service", "Brake Service", "General Service"],
            rating: 4.7,
            verified: true,
            address: "RC Dutt Road, Alkapuri, Vadodara",
          },
          {
            id: "m4",
            name: "Quick Fix Auto",
            phone: "+919876543213",
            services: ["Lockout Service", "Jump Start Service", "Emergency Towing"],
            rating: 4.3,
            verified: false,
            address: "Alkapuri Main Road, Vadodara",
          },
        ],
      },
      {
        id: "3",
        name: "Karelibaug",
        latitude: 22.3039,
        longitude: 73.1812,
        mechanics: [
          {
            id: "m5",
            name: "Karelibaug Motors",
            phone: "+919876543214",
            services: ["Engine Repair", "AC Service", "Fuel Delivery", "General Service"],
            rating: 4.4,
            verified: true,
            address: "Karelibaug Main Road, Vadodara",
          },
        ],
      },
      {
        id: "4",
        name: "Mandvi",
        latitude: 22.3178,
        longitude: 73.1812,
        mechanics: [
          {
            id: "m6",
            name: "Mandvi Auto Garage",
            phone: "+919876543215",
            services: ["Engine Repair", "AC Service", "Brake Service"],
            rating: 4.1,
            verified: true,
            address: "Mandvi Main Road, Vadodara",
          },
          {
            id: "m7",
            name: "24x7 Emergency Service",
            phone: "+919876543216",
            services: ["Emergency Towing", "Jump Start Service", "Lockout Service", "Fuel Delivery"],
            rating: 4.6,
            verified: true,
            address: "Mandvi Circle, Vadodara",
          },
        ],
      },
      {
        id: "5",
        name: "Fatehgunj",
        latitude: 22.3176,
        longitude: 73.1896,
        mechanics: [
          {
            id: "m8",
            name: "Fatehgunj Motors",
            phone: "+919876543217",
            services: ["Engine Repair", "AC Service", "General Service"],
            rating: 4.3,
            verified: true,
            address: "Fatehgunj Main Road, Vadodara",
          },
        ],
      },
      {
        id: "6",
        name: "Sayajigunj",
        latitude: 22.3072,
        longitude: 73.1812,
        mechanics: [
          {
            id: "m9",
            name: "Sayajigunj Service Center",
            phone: "+919876543218",
            services: ["Engine Repair", "AC Service", "Brake Service", "General Service"],
            rating: 4.5,
            verified: true,
            address: "Sayajigunj Main Road, Vadodara",
          },
        ],
      },
      {
        id: "7",
        name: "Waghodia Road",
        latitude: 22.2847,
        longitude: 73.1434,
        mechanics: [
          {
            id: "m10",
            name: "Waghodia Road Garage",
            phone: "+919876543219",
            services: ["Engine Repair", "Emergency Towing", "General Service"],
            rating: 4.2,
            verified: true,
            address: "Waghodia Road, Vadodara",
          },
        ],
      },
      {
        id: "8",
        name: "Gotri",
        latitude: 22.3511,
        longitude: 73.2069,
        mechanics: [
          {
            id: "m11",
            name: "Gotri Auto Center",
            phone: "+919876543220",
            services: ["Engine Repair", "AC Service", "Jump Start Service", "General Service"],
            rating: 4.4,
            verified: true,
            address: "Gotri Main Road, Vadodara",
          },
        ],
      },
    ]
  }

  return { serviceAreas, loading, error, usingFallback }
}
