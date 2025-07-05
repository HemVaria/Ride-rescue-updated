"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Car, Wrench, Home, MessageSquare } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "/services", icon: Wrench },
  { name: "Dashboard", url: "/dashboard", icon: Car },
  { name: "Contact", url: "/contact", icon: Phone },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <NavBar items={navItems} />

      <div className="container mx-auto px-4 py-8 space-y-8 pt-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Get in touch with our 24/7 support team. We're here to help with all your roadside assistance needs.
          </p>
        </div>

        {/* Emergency Contact Banner */}
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <Phone className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">Emergency Hotline</h3>
                  <p className="text-slate-300">For immediate roadside assistance</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">24/7 Available</Badge>
                <Button
                  onClick={() => window.open("tel:+918200487838", "_self")}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +91 8200487838
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Send us a Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-emerald-400"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-emerald-400"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-emerald-400"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-emerald-400"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-emerald-400 min-h-[120px]"
                    placeholder="Tell us about your inquiry or feedback..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 font-medium py-3"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">Phone</p>
                    <p className="text-slate-300">+91 8200487838</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">Email</p>
                    <p className="text-slate-300">support@riderescue.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">Location</p>
                    <p className="text-slate-300">Vadodara, Gujarat, India</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">Support Hours</p>
                    <p className="text-slate-300">24/7 Emergency Support</p>
                    <p className="text-slate-400 text-sm">General inquiries: 9 AM - 6 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">Service Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Primary Coverage</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                      <p>• Vadodara City</p>
                      <p>• Akota</p>
                      <p>• Alkapuri</p>
                      <p>• Karelibaug</p>
                      <p>• Mandvi</p>
                      <p>• Fatehgunj</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Extended Coverage</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                      <p>• Waghodia Road</p>
                      <p>• Gotri</p>
                      <p>• Manjalpur</p>
                      <p>• Nizampura</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">Quick FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-200 mb-1">How quickly can you respond?</h4>
                  <p className="text-sm text-slate-400">
                    Emergency services: 15-30 minutes. Regular services: 1-2 hours.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-200 mb-1">What payment methods do you accept?</h4>
                  <p className="text-sm text-slate-400">Cash, UPI, cards, and digital wallets.</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-200 mb-1">Do you provide 24/7 service?</h4>
                  <p className="text-sm text-slate-400">Yes, emergency roadside assistance is available 24/7.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
