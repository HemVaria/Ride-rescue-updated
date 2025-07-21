"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export default function ResetPassword() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  })

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwords.password !== passwords.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match. Please check and try again.",
      })
      return
    }

    if (passwords.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: passwords.password,
      })

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to update password. Please try again.",
        })
      } else {
        setMessage({
          type: "success",
          text: "Password updated successfully! Redirecting to dashboard...",
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (error) {
      console.error("Update password error:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="bg-slate-900 border-slate-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-slate-100 text-center">Update Your Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert
              className={`${
                message.type === "error" ? "border-red-500 bg-red-500/10" : "border-green-500 bg-green-500/10"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <AlertDescription className={`${message.type === "error" ? "text-red-200" : "text-green-200"}`}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-slate-300">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.password}
                  onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                  className="pl-10 pr-10 bg-slate-800 border-slate-600 text-slate-100"
                  placeholder="Enter new password (min 6 characters)"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="bg-slate-800 border-slate-600 text-slate-100"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
