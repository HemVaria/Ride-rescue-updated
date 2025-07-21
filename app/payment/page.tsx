"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Smartphone, Shield, X, Check } from "lucide-react"
import Link from "next/link"

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<"onetime" | "unlimited">("onetime")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | null>(null)

  const plans = {
    onetime: {
      title: "One-time call",
      subtitle: "BEST FOR SIMPLE ISSUES",
      price: "₹450",
      description: "Pay per service call",
      features: ["Single service request", "Expert mechanic assistance", "Real-time tracking", "Digital receipt"],
    },
    unlimited: {
      title: "1 month of unlimited calls",
      subtitle: "BEST FOR COMPLEX ISSUES",
      price: "₹890",
      description: "Unlimited calls for 30 days",
      features: [
        "Unlimited service requests",
        "Priority support",
        "Multiple vehicle coverage",
        "Emergency contact alerts",
        "24/7 availability",
      ],
    },
  }

  const handlePayment = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentMethodSelect = (method: "card" | "upi") => {
    setPaymentMethod(method)
    // Simulate payment processing
    setTimeout(() => {
      setShowPaymentModal(false)
      // Redirect to success page or tracking
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Link href="/services">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-white">Choose Your Plan</h1>
        <div></div>
      </div>

      <div className="p-4 space-y-6">
        {/* Service Info */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Connect with Expert Mechanic</h3>
                <p className="text-sm text-gray-400">Get professional roadside assistance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Select Your Service Plan</h2>

          {/* One-time Plan */}
          <Card
            className={`cursor-pointer transition-all ${
              selectedPlan === "onetime" ? "bg-lime-400/20 border-lime-400" : "bg-gray-800 border-gray-700"
            }`}
            onClick={() => setSelectedPlan("onetime")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="bg-gray-700 text-lime-400 text-xs px-2 py-1 rounded mb-2 inline-block">
                    {plans.onetime.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-lime-400">{plans.onetime.title}</h3>
                  <p className="text-sm text-gray-400">{plans.onetime.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{plans.onetime.price}</div>
                  <Button variant="link" className="text-lime-400 p-0 h-auto text-sm">
                    Learn more ↓
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                {plans.onetime.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-lime-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Unlimited Plan */}
          <Card
            className={`cursor-pointer transition-all ${
              selectedPlan === "unlimited" ? "bg-lime-400/20 border-lime-400" : "bg-gray-800 border-gray-700"
            }`}
            onClick={() => setSelectedPlan("unlimited")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="bg-gray-700 text-lime-400 text-xs px-2 py-1 rounded mb-2 inline-block">
                    {plans.unlimited.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-white">{plans.unlimited.title}</h3>
                  <p className="text-sm text-gray-400">{plans.unlimited.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{plans.unlimited.price}</div>
                  <Button variant="link" className="text-lime-400 p-0 h-auto text-sm">
                    Learn more ↓
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                {plans.unlimited.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-lime-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Notice */}
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-300 text-sm">
                  Your card will only be charged after the service is completed successfully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={handlePayment}
          className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold py-4 text-lg"
        >
          Continue with {plans[selectedPlan].title} - {plans[selectedPlan].price}
        </Button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white text-gray-900">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-gray-900">Payment Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowPaymentModal(false)} className="text-gray-500">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">Review your payment amount to continue.</p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">⚠️ Your card will only be charged after the call</p>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="font-semibold text-gray-900">Call with an Expert Mechanic</p>
                  <p className="text-sm text-gray-600">({plans[selectedPlan].title})</p>
                </div>

                <div className="border-t pt-4 mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    You don't have any payment method added to your account. Add a payment method to continue.
                  </p>

                  <Button
                    variant="outline"
                    className="w-full mb-3 bg-transparent text-gray-900 border-gray-300"
                    onClick={() => handlePaymentMethodSelect("card")}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add payment method
                  </Button>

                  <div className="text-center text-sm text-gray-500 mb-3">Or</div>

                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handlePaymentMethodSelect("upi")}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Pay with UPI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
