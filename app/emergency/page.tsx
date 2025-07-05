"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Clock, Phone } from "lucide-react"
import Link from "next/link"
import LocationDisplay from "@/components/LocationDisplay" // Added LocationDisplay import
import MapView from "@/components/MapView" // Added MapView import

export default function EmergencyPage() {
  const [helpRequested, setHelpRequested] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentLocation, setCurrentLocation] = useState("Detecting your location...")
  const [location, setLocation] = useState(null) // Added location state

  useEffect(() => {
    // Simulate location detection
    setTimeout(() => {
      setCurrentLocation("123 Main St, Downtown, City")
      setLocation({ latitude: 34.0522, longitude: -118.2437 }) // Example coordinates
    }, 2000)
  }, [])

  useEffect(() => {
    if (helpRequested) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev + 1)
        setProgress((prev) => Math.min(prev + 2, 100))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [helpRequested])

  const handleEmergencyRequest = () => {
    setHelpRequested(true)
    setCountdown(0)
    setProgress(0)
  }

  const handleCancelRequest = () => {
    setHelpRequested(false)
    setCountdown(0)
    setProgress(0)
  }

  if (helpRequested) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Emergency Request</h1>
          <div></div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Progress Circle */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress * 2.83} 283`}
                  className="text-lime-400 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Phone className="w-8 h-8 text-lime-400 mb-2" />
                <span className="text-2xl font-bold">{countdown}s</span>
                <span className="text-sm text-gray-400">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Help Requested</h2>
            <p className="text-gray-300">
              Matching you with an Expert.
              <br />
              This step could take up to 2 minutes.
              <br />
              Thanks for your patience.
            </p>
            <p className="text-sm text-gray-400">
              Experts are typically available between
              <br />8 AM - 8 PM PST
            </p>
          </div>

          {/* Location Display */}
          <LocationDisplay
            onLocationConfirm={(confirmedLocation) => {
              // Handle location confirmation for emergency request
              console.log("Location confirmed:", confirmedLocation)
            }}
            showConfirmButton={true}
            showEditButton={true}
            showMapButton={true}
          />

          {/* Map View */}
          {location && <MapView location={location} height="250px" showControls={true} />}

          {/* Emergency Contacts Notification */}
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-blue-400">Emergency Contacts Notified</h3>
                  <p className="text-blue-300 text-sm">
                    Your emergency contacts have been automatically notified of your request.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancel Button */}
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={handleCancelRequest}
              className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              Cancel Request
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Emergency Assistance</h1>
        <div></div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Location Display */}
        <LocationDisplay
          onLocationConfirm={(confirmedLocation) => {
            // Handle location confirmation for emergency request
            console.log("Location confirmed:", confirmedLocation)
          }}
          showConfirmButton={true}
          showEditButton={true}
          showMapButton={true}
        />

        {/* Map View */}
        {location && <MapView location={location} height="250px" showControls={true} />}

        {/* Emergency Instructions */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Need Emergency Help?</h2>
          <p className="text-gray-300">
            Press the SOS button below to request immediate roadside assistance. Your location will be shared with
            verified service providers in your area.
          </p>
        </div>

        {/* SOS Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleEmergencyRequest}
            className="w-56 h-56 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-3xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <div className="flex flex-col items-center space-y-3">
              <Phone className="w-16 h-16" />
              <span>SOS</span>
              <span className="text-lg font-normal">Request Help</span>
            </div>
          </Button>
        </div>

        {/* Safety Notice */}
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-yellow-400">Safety First</h3>
              <p className="text-yellow-300 text-sm">
                If you're in immediate danger, call 911 first. This service is for non-emergency roadside assistance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/services">
            <Button variant="outline" className="w-full h-16 border-gray-600 text-gray-300 bg-transparent">
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Schedule Service</span>
              </div>
            </Button>
          </Link>
          <Link href="/garage">
            <Button variant="outline" className="w-full h-16 border-gray-600 text-gray-300 bg-transparent">
              <div className="text-center">
                <MapPin className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Add Location</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
