"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Wrench, Fuel, Truck, Battery, Key, Settings, ArrowRight, Home, Phone } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { AuthModal } from "@/components/auth/AuthModal"
import { useAuth } from "@/hooks/useAuth"
import { FloatingNav } from "@/components/ui/floating-navbar"

// Extend window type for chatbot config
declare global {
  interface Window {
    chtlConfig?: {
      chatbotId: string
    }
  }
}

const navItems = [
  { name: "Home", link: "/", icon: <Home /> },
  { name: "Services", link: "/services", icon: <Wrench /> },
  { name: "Dashboard", link: "/dashboard", icon: <Car /> },
  { name: "Contact", link: "/contact", icon: <Phone /> },
]

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [chatbotStatus, setChatbotStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')
  const { user, signOut } = useAuth()

  // Chatbot loading effect
  useEffect(() => {
    // Set chatbot config
    if (typeof window !== 'undefined') {
      window.chtlConfig = { chatbotId: "6115949275" }
      
      let retryCount = 0
      const maxRetries = 3
      
      // Manual script loading as fallback
      const loadChatbotScript = () => {
        // Check if script already exists
        if (document.getElementById('chtl-script-manual')) {
          return
        }

        const script = document.createElement('script')
        script.id = 'chtl-script-manual'
        script.src = 'https://chatling.ai/js/embed.js'
        script.async = true
        script.setAttribute('data-id', '6115949275')
        script.crossOrigin = 'anonymous'
        
        script.onload = () => {
          console.log('Chatbot script loaded successfully')
          setChatbotStatus('loaded')
          
          // Additional check to see if the widget actually appears
          setTimeout(() => {
            const chatWidget = document.querySelector('[data-chatling-widget]') || 
                             document.querySelector('#chatling-widget') ||
                             document.querySelector('.chatling-widget')
            if (!chatWidget) {
              console.warn('Chatbot script loaded but widget not found in DOM')
            }
          }, 2000)
        }
        
        script.onerror = (error) => {
          console.error('Failed to load chatbot script:', error)
          retryCount++
          if (retryCount < maxRetries) {
            console.log(`Retrying chatbot script load (${retryCount}/${maxRetries})...`)
            setTimeout(loadChatbotScript, 2000 * retryCount)
          } else {
            setChatbotStatus('failed')
          }
        }
        
        document.head.appendChild(script)
      }

      // Set initial timeout for loading
      const timer = setTimeout(() => {
        // Check if Next.js Script component loaded the script first
        const existingScript = document.getElementById('chtl-script')
        if (!existingScript || !existingScript.src) {
          loadChatbotScript()
        }
      }, 1000)
      
      // Also set a fallback timer - if nothing loads after 10 seconds, show fallback
      const fallbackTimer = setTimeout(() => {
        setChatbotStatus('failed')
      }, 10000)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(fallbackTimer)
      }
    }
  }, [])

  const services = [
    {
      icon: Wrench,
      title: "Emergency Repairs",
      description: "Professional mechanics ready 24/7",
      color: "text-emerald-400",
    },
    {
      icon: Fuel,
      title: "Fuel Delivery",
      description: "Running on empty? We've got you covered",
      color: "text-emerald-400",
    },
    {
      icon: Truck,
      title: "Towing Service",
      description: "Swift and secure vehicle transport",
      color: "text-emerald-400",
    },
  ]

  const detailedServices = [
    {
      icon: Battery,
      title: "Battery Jump Start",
      description: "Get your vehicle started quickly with our professional jump start service.",
    },
    {
      icon: Wrench,
      title: "Tire Change",
      description: "Fast and reliable tire change service for flat or damaged tires.",
    },
    {
      icon: Fuel,
      title: "Fuel Delivery",
      description: "Run out of fuel? We'll bring gas right to your location.",
    },
    {
      icon: Key,
      title: "Lockout Service",
      description: "Locked your keys in the car? Our specialists can help you regain access.",
    },
    {
      icon: Truck,
      title: "Towing Service",
      description: "Professional towing service for all vehicle types and situations.",
    },
    {
      icon: Settings,
      title: "Winching",
      description: "Stuck in a ditch or mud? Our winching service will get you back on the road.",
    },
  ]

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Chatbot Configuration */}
      <Script
        id="chatbot-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.chtlConfig = { chatbotId: "6115949275" }`,
        }}
      />
      
      {/* Chatbot Embed Script with multiple loading strategies */}
      <Script
        async
        data-id="6115949275"
        id="chtl-script"
        src="https://chatling.ai/js/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Chatbot script loaded via Next.js Script')
          setChatbotStatus('loaded')
        }}
        onError={(error) => {
          console.error('Next.js Script failed to load chatbot:', error)
          setChatbotStatus('failed')
        }}
      />

      {/* Navigation */}
      <FloatingNav navItems={navItems} />

      {/* Hero Section with 3D Scene */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 3D Robot Scene Container */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://my.spline.design/nexbotrobotcharacterconcept-JcYjIhcCzXpePMeyzabYMvRB/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="w-full h-full"
            title="Interactive 3D Robot Scene"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Hero Content Overlay - Positioned Left */}
        <div className="relative z-10 max-w-md ml-8 md:ml-16">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-4">
              Allowing you to drive
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                on your terms.
              </span>
            </h1>

            <p className="text-slate-300 mb-6 leading-relaxed">
              24/7 roadside assistance that transforms your vehicle emergencies into peace of mind.
            </p>

            <div className="flex flex-col space-y-3">
              {user ? (
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 font-medium py-3 shadow-xl transform hover:scale-105 transition-all duration-300">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    onClick={() => openAuth("signup")}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 font-medium py-3 shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openAuth("signin")}
                    className="w-full border-slate-600 text-slate-300 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm py-3"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* 3D Interaction Hint */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400 bg-slate-900/50 backdrop-blur-sm rounded-full px-4 py-2 inline-block border border-slate-700/50">
              ✨ Click and drag to explore the 3D scene ✨
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Quick Emergency Services</h2>
            <p className="text-xl text-slate-300">Professional help at your fingertips</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/80 transition-all duration-500 shadow-xl hover:shadow-emerald-500/20 transform hover:scale-105 hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-emerald-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border border-emerald-500/30">
                    <service.icon className={`w-8 h-8 ${service.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services Grid */}
      <section id="services" className="px-6 py-20 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Our Complete Services</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Professional roadside assistance whenever you need it. Our certified technicians are equipped to handle
              any automotive emergency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailedServices.map((service, index) => (
              <Card
                key={index}
                className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/80 transition-all duration-500 group shadow-xl hover:shadow-cyan-500/20 transform hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="bg-cyan-500/20 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300 backdrop-blur-sm border border-cyan-500/30 group-hover:border-emerald-500/30">
                    <service.icon className="w-6 h-6 text-cyan-400 group-hover:text-emerald-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white">{service.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center bg-slate-900/50">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-3xl p-12 border border-slate-700/50 backdrop-blur-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Join thousands of drivers who trust Ride Rescue for their roadside assistance needs.
            </p>
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 font-medium px-10 py-4 shadow-2xl transform hover:scale-110 transition-all duration-300 text-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => openAuth("signup")}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 font-medium px-10 py-4 shadow-2xl transform hover:scale-110 transition-all duration-300 text-lg"
              >
                Create Account
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 px-6 py-12 bg-slate-900/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Car className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold">Ride Rescue</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Professional 24/7 roadside assistance across Gujarat. Your trusted partner for automotive emergencies.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Emergency Towing</li>
                <li>Battery Jump Start</li>
                <li>Fuel Delivery</li>
                <li>Lockout Service</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>+91 8200487838</li>
                <li>24/7 Emergency</li>
                <li>Vadodara, Gujarat</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Ride Rescue. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
      
      {/* Loading indicator for chatbot */}
      {chatbotStatus === 'loading' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
              <span className="text-slate-300 text-sm">Loading chat...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Fallback Chat Widget */}
      {chatbotStatus === 'failed' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-80 max-h-96">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Ride Rescue Chat</span>
                </div>
                <button 
                  onClick={() => setChatbotStatus('loading')}
                  className="text-white/80 hover:text-white"
                  title="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 h-64 bg-slate-800 overflow-y-auto">
              <div className="space-y-3">
                <div className="bg-slate-700 rounded-lg p-3 text-sm text-slate-200">
                  👋 Hello! I'm your Ride Rescue assistant. How can I help you today?
                </div>
                <div className="text-xs text-slate-400 text-center p-2 bg-slate-900 rounded">
                  Chat widget temporarily unavailable.<br />
                  Please call <a href="tel:+918200487838" className="text-emerald-400 hover:text-emerald-300">+91 8200487838</a> for immediate assistance.
                </div>
                <div className="text-xs text-slate-500 text-center">
                  <button 
                    onClick={() => {
                      setChatbotStatus('loading')
                      // Retry loading the script
                      setTimeout(() => {
                        window.location.reload()
                      }, 1000)
                    }}
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Retry chat widget
                  </button>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-slate-700">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Chat temporarily offline..."
                  className="flex-1 bg-slate-700 text-slate-400 rounded px-3 py-2 text-sm"
                  disabled
                />
                <button 
                  className="bg-slate-600 text-slate-400 px-4 py-2 rounded text-sm cursor-not-allowed"
                  disabled
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
