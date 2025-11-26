"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ShinyText from "@/components/ShinyText"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Pay Per Use",
    price: "₹0",
    period: "/month",
    description: "Perfect for occasional drivers. Pay only when you need help.",
    features: [
      "24/7 Emergency Assistance",
      "Pay per service request",
      "Real-time tracking",
      "Standard response time",
      "Basic app features"
    ],
    notIncluded: [
      "Free towing (up to 50km)",
      "Priority dispatch",
      "Free fluid delivery",
      "Trip interruption coverage"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Gold Member",
    price: "₹499",
    period: "/year",
    description: "Peace of mind for daily commuters. Most popular choice.",
    features: [
      "24/7 Emergency Assistance",
      "3 Free service calls/year",
      "Free towing (up to 25km)",
      "Priority dispatch",
      "10% discount on repairs",
      "Real-time tracking"
    ],
    notIncluded: [
      "Trip interruption coverage",
      "Concierge services"
    ],
    cta: "Join Gold",
    popular: true
  },
  {
    name: "Platinum Elite",
    price: "₹999",
    period: "/year",
    description: "Ultimate protection for you and your family.",
    features: [
      "Unlimited service calls",
      "Free towing (up to 100km)",
      "Instant priority dispatch",
      "20% discount on repairs",
      "Trip interruption coverage",
      "Free fluid delivery",
      "Dedicated account manager"
    ],
    notIncluded: [],
    cta: "Go Platinum",
    popular: false
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <div className="flex justify-center">
             <ShinyText text="Simple, Transparent Pricing" disabled={false} speed={3} className="text-4xl md:text-5xl font-bold tracking-tight" />
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your driving lifestyle. No hidden fees, ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`relative h-full flex flex-col border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 ${plan.popular ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-500 ml-2">{plan.period}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm opacity-50">
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-slate-500" />
                        </div>
                        <span className="text-slate-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className={`w-full ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-700'} text-white`}>
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-4">Enterprise Fleet?</h3>
          <p className="text-slate-400 mb-6">We offer custom solutions for logistics companies and taxi fleets.</p>
          <Button variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10">Contact Sales</Button>
        </div>

      </div>
    </div>
  )
}
