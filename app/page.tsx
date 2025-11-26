"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Card, CardContent } from "@/components/ui/card"
import { TextPressure } from "@/components/ui/interactive-text-pressure"
import { BlurText } from "@/components/ui/animated-blur-text"
import { Car, Wrench, Fuel, Truck, Battery, Key, Settings, ArrowRight, Home, Phone } from "lucide-react"
import Link from "next/link"
import { AuthModal } from "@/components/auth/AuthModal"
import { useAuth } from "@/hooks/useAuth"
import { Tilt } from "@/components/ui/tilt"
import { motion } from "framer-motion"

const navItems = [
  { name: "Home", link: "/", icon: <Home /> },
  { name: "Services", link: "/services", icon: <Wrench /> },
  { name: "Dashboard", link: "/dashboard", icon: <Car /> },
  { name: "Contact", link: "/contact", icon: <Phone /> },
]

export default function LandingPage() {
  // Force fresh deployment - Nov 26 2025
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const { user, signOut } = useAuth()

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
    <div className="min-h-screen text-white">
      {/* Top nav is provided by global AppBar in layout */}

      {/* Hero Section centered - replaced with bold, interactive text */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 md:pt-14">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/10 to-transparent" />
        <div className="relative z-10 w-full max-w-5xl px-4 md:px-8">
          <div className="mx-auto flex flex-col items-center gap-0">
            {/* On Demand banner above main title */}
            <div className="w-full mb-0">
              <BlurText
                text="On Demand Mechanic Service"
                delay={100}
                animateBy="words"
                direction="top"
                className="font-mono font-semibold tracking-tight normal-case antialiased text-slate-200 text-center max-w-4xl text-xl md:text-2xl lg:text-3xl leading-none mx-auto justify-center -mb-1 md:-mb-2"
              />
            </div>
            <div className="w-full -mt-2 md:-mt-3">
              <TextPressure
                text="Ride Rescue"
                flex={false}
                alpha={false}
                stroke={false}
                width
                weight
                italic
                minFontSize={64}
                className="cursor-default tracking-tight"
              />
            </div>
            <BlurText
              text="24/7 roadside assistance that transforms your vehicle emergencies into peace of mind."
              delay={120}
              animateBy="words"
              direction="top"
              className="text-slate-300 text-center max-w-3xl text-lg md:text-xl lg:text-2xl mx-auto justify-center"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full max-w-md mt-6 md:mt-8"
            >
              {user ? (
                <Link href="/dashboard">
                  <ShimmerButton className="w-full shadow-2xl [--bg:linear-gradient(90deg,#10b981,#06b6d4)]">
                    <span className="flex w-full items-center justify-center gap-2 text-base font-medium tracking-tight text-white">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </ShimmerButton>
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <ShimmerButton onClick={() => openAuth("signup")} className="w-full shadow-2xl [--bg:linear-gradient(90deg,#10b981,#06b6d4)]">
                    <span className="flex w-full items-center justify-center gap-2 text-base font-medium tracking-tight text-white">
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </ShimmerButton>
                  <Button variant="outline" onClick={() => openAuth("signin")} className="w-full border-slate-600 text-slate-300 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm py-6 text-lg transition-all hover:scale-[1.02]">
                    Sign In
                  </Button>
                </div>
              )}
            </motion.div>
            {/* Secondary banner moved above title */}
          </div>
        </div>

        {/* Removed bottom-hero banner; secondary line now below CTA */}
      </section>

      {/* Featured Services */}
      <section className="px-6 py-20 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Quick Emergency Services</h2>
            <p className="text-xl text-slate-300">Professional help at your fingertips</p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Tilt rotationFactor={10} isRevese>
                  <Card
                    className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/80 transition-all duration-500 shadow-xl hover:shadow-emerald-500/20 h-full"
                  >
                    <CardContent className="p-8 text-center h-full flex flex-col items-center justify-center">
                      <div className="bg-emerald-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <service.icon className={`w-10 h-10 ${service.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
                      <p className="text-slate-300 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detailed Services Grid */}
      <section id="services" className="px-6 py-20 bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Our Complete Services</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Professional roadside assistance whenever you need it. Our certified technicians are equipped to handle
              any automotive emergency.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {detailedServices.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/80 transition-all duration-500 group shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 h-full"
                >
                  <CardContent className="p-6">
                    <div className="bg-cyan-500/20 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300 backdrop-blur-sm border border-cyan-500/30 group-hover:border-emerald-500/30">
                      <service.icon className="w-6 h-6 text-cyan-400 group-hover:text-emerald-400 transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">{service.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-3xl p-12 border border-slate-700/50 backdrop-blur-xl shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Join thousands of drivers who trust Ride Rescue for their roadside assistance needs.
            </p>
            {user ? (
              <Link href="/dashboard">
                <ShimmerButton className="shadow-2xl [--bg:linear-gradient(90deg,#10b981,#06b6d4)]">
                  <span className="flex items-center justify-center gap-2 text-lg font-medium tracking-tight text-white">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </ShimmerButton>
              </Link>
            ) : (
              <ShimmerButton onClick={() => openAuth("signup")} className="shadow-2xl [--bg:linear-gradient(90deg,#10b981,#06b6d4)]">
                <span className="flex items-center justify-center gap-2 text-lg font-medium tracking-tight text-white">
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </span>
              </ShimmerButton>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 px-6 py-12 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Car className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold text-white">Ride Rescue</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Professional 24/7 roadside assistance across Gujarat. Your trusted partner for automotive emergencies.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Emergency Towing</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Battery Jump Start</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Fuel Delivery</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Lockout Service</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 8200487838</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> 24/7 Emergency</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Vadodara, Gujarat</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Ride Rescue. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </div>
  )
}

function Clock(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function MapPin(props: any) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
