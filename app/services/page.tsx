"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wrench,
  Car,
  Battery,
  Settings,
  Fuel,
  Key,
  AlertTriangle,
  Phone,
  MapPin,
  Home,
  Map,
  Navigation,
  Clock,
} from "lucide-react"
import { Tilt } from "@/components/ui/tilt"
import { Spotlight } from "@/components/ui/spotlight"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const LeafletMap = dynamic(() => import("@/components/ui/leaflet-map").then(mod => mod.LeafletMap), { ssr: false })
const LocationBasedServices = dynamic(() => import("@/components/LocationBasedServices").then(mod => mod.LocationBasedServices), { ssr: false })

const emergencyServices = [
  {
    id: 1,
    title: "Emergency Towing",
    description: "24/7 towing service for breakdowns and accidents",
    icon: Car,
    price: "₹15/km",
    features: ["24/7 Available", "Quick Response", "Safe Transport"],
    searchTerms: ["towing", "breakdown", "accident", "emergency"],
  },
  {
    id: 2,
    title: "Jump Start Service",
    description: "Battery jump start and replacement service",
    icon: Battery,
    price: "₹300",
    features: ["Battery Testing", "Jump Start", "Battery Replacement"],
    searchTerms: ["battery", "jump start", "dead battery", "car won't start"],
  },
  {
    id: 3,
    title: "Fuel Delivery",
    description: "Emergency fuel delivery to your location",
    icon: Fuel,
    price: "₹200 + fuel cost",
    features: ["Petrol/Diesel", "Quick Delivery", "Safe Handling"],
    searchTerms: ["fuel", "petrol", "diesel", "gas", "empty tank"],
  },
  {
    id: 4,
    title: "Lockout Service",
    description: "Car lockout assistance and key replacement",
    icon: Key,
    price: "₹500",
    features: ["Non-Destructive Entry", "Key Cutting", "Lock Repair"],
    searchTerms: ["lockout", "locked out", "keys inside", "key replacement"],
  },
]

const regularServices = [
  {
    id: 5,
    title: "Engine Repair",
    description: "Complete engine diagnostics and repair services",
    icon: Wrench,
    price: "₹1,500+",
    features: ["Diagnostics", "Repair", "Maintenance"],
    searchTerms: ["engine", "repair", "diagnostics", "maintenance"],
  },
  {
    id: 6,
    title: "AC Service",
    description: "Air conditioning repair and maintenance",
    icon: Settings,
    price: "₹800+",
    features: ["Gas Refill", "Compressor Repair", "Filter Cleaning"],
    searchTerms: ["ac", "air conditioning", "cooling", "compressor"],
  },
  {
    id: 7,
    title: "Brake Service",
    description: "Brake pad replacement and brake system repair",
    icon: Car,
    price: "₹1,200+",
    features: ["Brake Pads", "Brake Fluid", "System Check"],
    searchTerms: ["brake", "brakes", "brake pads", "brake fluid"],
  },
  {
    id: 8,
    title: "General Service",
    description: "Complete vehicle maintenance and servicing",
    icon: Settings,
    price: "₹2,000+",
    features: ["Oil Change", "Filter Replacement", "Full Inspection"],
    searchTerms: ["service", "maintenance", "oil change", "general"],
  },
]

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "/services", icon: Wrench },
  { name: "Dashboard", url: "/dashboard", icon: Car },
  { name: "Contact", url: "/contact", icon: Phone },
]

const serviceLocations = [
  {
    id: "akota-circle",
    position: { lat: 22.2928, lng: 73.2081 },
    title: "Akota Circle Auto Garage",
    info: "Engine Repair • AC Service • General Service • Shop 149, Akota Circle",
    type: "provider" as const,
  },
  {
    id: "alkapuri-center",
    position: { lat: 22.3178, lng: 73.1734 },
    title: "Alkapuri Service Center",
    info: "Engine Repair • Transmission Service • RC Dutt Road, Alkapuri",
    type: "provider" as const,
  },
  {
    id: "karelibaug-motors",
    position: { lat: 22.3039, lng: 73.1812 },
    title: "Karelibaug Motors",
    info: "Engine Repair • AC Service • Karelibaug Main Road",
    type: "provider" as const,
  },
  {
    id: "mandvi-garage",
    position: { lat: 22.3178, lng: 73.1812 },
    title: "Mandvi Auto Garage",
    info: "Engine Repair • AC Service • Mandvi Main Road",
    type: "provider" as const,
  },
  {
    id: "fatehgunj-motors",
    position: { lat: 22.3176, lng: 73.1896 },
    title: "Fatehgunj Motors",
    info: "Engine Repair • Transmission Service • Fatehgunj Main Road",
    type: "provider" as const,
  },
  {
    id: "sayajigunj-center",
    position: { lat: 22.3072, lng: 73.1812 },
    title: "Sayajigunj Service Center",
    info: "Engine Repair • AC Service • Sayajigunj Main Road",
    type: "provider" as const,
  },
  {
    id: "waghodia-garage",
    position: { lat: 22.2847, lng: 73.1434 },
    title: "Waghodia Road Garage",
    info: "Engine Repair • Heavy Vehicle Service • Waghodia Road",
    type: "provider" as const,
  },
  {
    id: "gotri-center",
    position: { lat: 22.3511, lng: 73.2069 },
    title: "Gotri Auto Center",
    info: "Engine Repair • AC Service • Gotri Main Road",
    type: "provider" as const,
  },
]

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string>("")
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const router = useRouter()

  const handleServiceSelect = (serviceTitle: string) => {
    setSelectedService(serviceTitle)
    setTimeout(() => {
      if (typeof window !== "undefined") {
        const element = document.getElementById("location-services")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }, 100)
  }

  const handleEmergencyCall = () => {
    if (typeof window !== "undefined") {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const phone = "+918200487838"

      if (isMobile) {
        window.location.href = `tel:${phone}`
      } else {
        navigator.clipboard
          .writeText(phone)
          .then(() => {
            alert(`Emergency number ${phone} copied to clipboard!`)
          })
      }
    }
  }

  const handleMarkerClick = (markerId: string) => {
    const location = serviceLocations.find((loc) => loc.id === markerId)
    if (location) {
      setSelectedLocation(location)
    }
  }

  const handleNavigateToLocation = (location: any) => {
    const { lat, lng } = location.position
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    if (typeof window !== "undefined") {
      window.open(url, "_blank")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen text-slate-100">
      <div className="container mx-auto px-4 py-8 space-y-8 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Roadside Assistance Services
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Professional automotive services available 24/7 across Gujarat. Find trusted mechanics and emergency
            assistance near you - powered by free OpenStreetMap.
          </p>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30 backdrop-blur-xl shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Emergency Assistance</h3>
                    <p className="text-slate-300">24/7 emergency roadside support</p>
                  </div>
                </div>
                <div className="flex space-x-3 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => setShowMap(!showMap)}
                    className="border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    {showMap ? "Hide Map" : "Show Locations"}
                  </Button>
                  <Button onClick={handleEmergencyCall} className="bg-red-600 hover:bg-red-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now: +91 8200487838
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Free OpenStreetMap Integration */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 overflow-hidden"
          >
            <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700/40 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Service Locations Map</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Free • No API Key Required</Badge>
                </CardTitle>
                <p className="text-slate-400 text-sm">
                  Interactive map powered by OpenStreetMap - completely free and open source. Based on latest CSV data.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <LeafletMap
                  center={{ lat: 22.3072, lng: 73.1812 }}
                  zoom={12}
                  markers={serviceLocations}
                  onMarkerClick={handleMarkerClick}
                  height="500px"
                  className="rounded-b-lg overflow-hidden"
                />
              </CardContent>
            </Card>

            {/* Selected Location Info */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700/40 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-emerald-500/20 rounded-full">
                          <MapPin className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-100">{selectedLocation.title}</h3>
                          <p className="text-slate-300">{selectedLocation.info}</p>
                          <p className="text-sm text-slate-400 mt-1 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Available 24/7 for emergencies</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 flex-wrap">
                        <Button
                          onClick={() => handleNavigateToLocation(selectedLocation)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button onClick={handleEmergencyCall} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedLocation(null)}
                          className="border-slate-600 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Emergency Services with Tilt Effect */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-2"
          >
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-slate-100">Emergency Services</h2>
            <Badge className="bg-red-500/20 text-red-400">24/7 Available</Badge>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {emergencyServices.map((service) => {
              const IconComponent = service.icon
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <Tilt
                    rotationFactor={8}
                    springOptions={{
                      stiffness: 26.7,
                      damping: 4.1,
                      mass: 0.2,
                    }}
                  >
                    <Card
                      className="bg-slate-900/70 backdrop-blur-xl border-slate-700/40 hover:bg-slate-800/70 transition-colors cursor-pointer h-full group shadow-xl"
                      onClick={() => handleServiceSelect(service.title)}
                    >
                      <Spotlight
                        className="z-10 from-red-500/20 via-red-400/10 to-transparent blur-2xl"
                        size={200}
                        springOptions={{
                          stiffness: 26.7,
                          damping: 4.1,
                          mass: 0.2,
                        }}
                      />
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-500/20 rounded-lg">
                            <IconComponent className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-slate-100">{service.title}</CardTitle>
                            <Badge variant="secondary" className="bg-red-500/20 text-red-400 text-xs">
                              {service.price}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-slate-300 text-sm">{service.description}</p>
                        <div className="space-y-1">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs text-slate-400">
                              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Tilt>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Regular Services with Tilt Effect */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-2"
          >
            <Wrench className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-slate-100">Regular Services</h2>
            <Badge className="bg-emerald-500/20 text-emerald-400">Professional Care</Badge>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {regularServices.map((service) => {
              const IconComponent = service.icon
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <Tilt
                    rotationFactor={8}
                    springOptions={{
                      stiffness: 26.7,
                      damping: 4.1,
                      mass: 0.2,
                    }}
                  >
                    <Card
                      className="bg-slate-900/70 backdrop-blur-xl border-slate-700/40 hover:bg-slate-800/70 transition-colors cursor-pointer h-full group shadow-xl"
                      onClick={() => handleServiceSelect(service.title)}
                    >
                      <Spotlight
                        className="z-10 from-emerald-500/20 via-emerald-400/10 to-transparent blur-2xl"
                        size={200}
                        springOptions={{
                          stiffness: 26.7,
                          damping: 4.1,
                          mass: 0.2,
                        }}
                      />
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <IconComponent className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-slate-100">{service.title}</CardTitle>
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-xs">
                              {service.price}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-slate-300 text-sm">{service.description}</p>
                        <div className="space-y-1">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs text-slate-400">
                              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Tilt>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Location-Based Services */}
        <div id="location-services" className="space-y-6">
          <LocationBasedServices
            selectedService={selectedService}
            onMechanicSelect={(mechanic) => {
              console.log("Selected mechanic:", mechanic)
            }}
          />
        </div>

        {/* Service Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700/40 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Service Coverage Areas</span>
                <Badge className="bg-emerald-500/20 text-emerald-400">Based on Latest CSV</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-200">Vadodara Central</h4>
                  <div className="space-y-1 text-sm text-slate-400">
                    <p>• Akota Circle</p>
                    <p>• Alkapuri</p>
                    <p>• Karelibaug</p>
                    <p>• Mandvi</p>
                    <p>• Fatehgunj</p>
                    <p>• Sayajigunj</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-200">Vadodara Extended</h4>
                  <div className="space-y-1 text-sm text-slate-400">
                    <p>• Waghodia Road</p>
                    <p>• Gotri</p>
                    <p>• Manjalpur</p>
                    <p>• Nizampura</p>
                    <p>• Vasna Road</p>
                    <p>• Subhanpura</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-200">Emergency Coverage</h4>
                  <div className="space-y-1 text-sm text-slate-400">
                    <p>• 24/7 Towing</p>
                    <p>• Jump Start</p>
                    <p>• Fuel Delivery</p>
                    <p>• Lockout Service</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-200">Regular Services</h4>
                  <div className="space-y-1 text-sm text-slate-400">
                    <p>• Engine Repair</p>
                    <p>• AC Service</p>
                    <p>• Brake Service</p>
                    <p>• General Service</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
