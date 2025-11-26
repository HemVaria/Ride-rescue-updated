"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MessageSquare, Star, Shield, Clock, MapPin, Navigation, XCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const DynamicMapView = dynamic(() => import("@/components/MapView").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-400">
      Loading map...
    </div>
  ),
})

export default function TrackingPage() {
  const router = useRouter()
  const [status, setStatus] = useState("En Route")
  const [eta, setEta] = useState(20 * 60 * 1000) // Store in ms
  const [progress, setProgress] = useState(0)
  const [mechanic, setMechanic] = useState<any>(null)
  const [startLocation, setStartLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  
  // Default user location (Vadodara)
  const userLocation = {
    latitude: 22.3072,
    longitude: 73.1812,
    address: "Current Location",
    accuracy: 15
  }

  // Mechanic location state
  const [mechanicLocation, setMechanicLocation] = useState({
    latitude: 22.3150,
    longitude: 73.1900
  })

  // Load mechanic data from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('current_booking')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          setMechanic(data)
          // If mechanic has area location, use it as start point
          if (data.area && data.area.latitude) {
            const start = {
              latitude: data.area.latitude,
              longitude: data.area.longitude
            }
            setMechanicLocation(start)
            setStartLocation(start)
            setStartTime(Date.now())
          }
        } catch (e) {
          console.error("Failed to parse booking data", e)
        }
      }
    }
  }, [])

  // Simulate movement towards user
  useEffect(() => {
    if (!mechanic || !startLocation || !startTime) return

    const duration = 20 * 60 * 1000 // 20 minutes in ms

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - startTime
      const progressRatio = Math.min(elapsed / duration, 1)
      
      // Update ETA (ms remaining)
      const remainingMs = Math.max(0, duration - elapsed)
      setEta(remainingMs)
      
      // Update Progress Bar
      setProgress(progressRatio * 100)

      // Update Location (Linear interpolation)
      const newLat = startLocation.latitude + (userLocation.latitude - startLocation.latitude) * progressRatio
      const newLng = startLocation.longitude + (userLocation.longitude - startLocation.longitude) * progressRatio
      
      setMechanicLocation({
        latitude: newLat,
        longitude: newLng
      })

      if (progressRatio >= 1) {
        setStatus("Arrived")
        setEta(0)
        clearInterval(interval)
      }

    }, 1000) // Update every second for smooth movement/timer

    return () => clearInterval(interval)
  }, [mechanic, startLocation, startTime])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleCall = () => {
    if (mechanic?.phone) {
      window.location.href = `tel:${mechanic.phone}`
    }
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this request?")) {
      sessionStorage.removeItem('current_booking')
      router.push('/services')
    }
  }

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-slate-400">Loading booking details...</p>
          <Button variant="link" onClick={() => router.push('/services')} className="text-emerald-400">
            Return to Services
          </Button>
        </div>
      </div>
    )
  }

  const provider = {
    id: mechanic.id || "mech-1",
    name: mechanic.name || "Unknown Mechanic",
    latitude: mechanicLocation.latitude,
    longitude: mechanicLocation.longitude,
    eta: `${Math.ceil(eta / 60000)} mins`,
    rating: mechanic.rating || 4.5
  }

  const circumference = 2 * Math.PI * 88 // Radius 88

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel - Status & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Status Card */}
          <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 px-3 py-1">
                  Live Tracking
                </Badge>
                <Badge className={`${status === "Arrived" ? "bg-emerald-500" : "bg-blue-600"} animate-pulse`}>
                  {status}
                </Badge>
              </div>
              
              {/* Circular Timer */}
              <div className="relative flex items-center justify-center w-48 h-48 mx-auto my-6">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (progress / 100) * circumference}
                    className="text-emerald-500 transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Text in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-4xl font-bold font-mono tracking-wider text-white">{formatTime(eta)}</span>
                   <span className="text-xs text-slate-400 uppercase mt-1 font-medium tracking-widest">Estimated Arrival</span>
                </div>
              </div>

            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
                  <span>Confirmed</span>
                  <span>On Location</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-800" />
              </div>

              {/* Mechanic Profile */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mechanic.name}`} />
                  <AvatarFallback>{mechanic.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{mechanic.name}</h3>
                  <div className="flex items-center text-yellow-400 text-sm mt-1">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    <span className="font-medium">{mechanic.rating}</span>
                    <span className="text-slate-500 ml-1 text-xs">• {mechanic.verified ? "Verified" : "Partner"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" onClick={handleCall} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full bg-slate-700 hover:bg-slate-600 text-white">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Vehicle & Safety Info */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <Car className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Vehicle</p>
                    <p className="text-sm font-medium text-white">Service Van • GJ-06-RR-2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <div className="p-2 rounded-full bg-emerald-500/10">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Safety</p>
                    <p className="text-sm font-medium text-white">Background Verified Partner</p>
                  </div>
                </div>
              </div>

              <Button variant="destructive" onClick={handleCancel} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Request
              </Button>
            </CardContent>
          </Card>

          {/* Service Details Small Card */}
          <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">Destination</p>
                  <p className="text-sm font-medium text-white">Your Current Location</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                Details
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel - Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 h-[600px] lg:h-auto min-h-[500px] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative bg-slate-900"
        >
           <DynamicMapView 
             location={userLocation}
             providers={[provider]}
             center={{ 
               lat: (userLocation.latitude + mechanicLocation.latitude) / 2, 
               lng: (userLocation.longitude + mechanicLocation.longitude) / 2 
             }}
             zoom={14}
             height="100%"
             className="w-full h-full"
           />
           
           {/* Map Overlay Controls */}
           <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
             <Button size="icon" className="bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 shadow-lg">
               <Navigation className="w-4 h-4" />
             </Button>
           </div>
        </motion.div>

      </div>
    </div>
  )
}

function Car(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}
