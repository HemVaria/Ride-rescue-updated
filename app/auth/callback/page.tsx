"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()

      try {
        // Get the hash fragment from the URL
        let hashParams = new URLSearchParams()
        if (typeof window !== "undefined") {
          hashParams = new URLSearchParams(window.location.hash.substring(1))
        }
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const type = hashParams.get("type")

        if (type === "signup" && accessToken && refreshToken) {
          // Set the session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error("Error setting session:", error)
            setStatus("error")
            setMessage("Failed to confirm your account. Please try again.")
          } else {
            console.log("Email confirmed successfully:", data.user?.email)
            setStatus("success")
            setMessage("Your email has been confirmed! You can now sign in.")

            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push("/dashboard")
            }, 2000)
          }
        } else if (type === "recovery" && accessToken && refreshToken) {
          // Handle password recovery
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            setStatus("error")
            setMessage("Failed to reset your password. Please try again.")
          } else {
            setStatus("success")
            setMessage("Password reset successful! You can now update your password.")
            setTimeout(() => {
              router.push("/auth/update-password")
            }, 2000)
          }
        } else {
          setStatus("error")
          setMessage("Invalid confirmation link. Please try again.")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="bg-slate-900 border-slate-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-slate-100 text-center flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
            {status === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
            {status === "loading" && "Confirming..."}
            {status === "success" && "Success!"}
            {status === "error" && "Error"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-300">{message}</p>

          {status === "error" && (
            <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Return to Home
            </Button>
          )}

          {status === "success" && <div className="text-sm text-slate-400">Redirecting you automatically...</div>}
        </CardContent>
      </Card>
    </div>
  )
}
