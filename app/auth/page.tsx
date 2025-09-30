"use client"

import { Auth } from "@/components/ui/auth-form-1"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
// Background is provided globally in layout

export default function AuthPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user) {
    return null // or a loading spinner
  }

  return (
    <div className="min-h-screen relative overflow-hidden">

    {/* Overlay for better contrast */}
    <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Auth Form */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <Auth onClose={() => router.push("/")} />
      </div>
    </div>
  )
}
