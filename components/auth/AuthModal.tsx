"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "signup"
}

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const { signIn, signUp, resetPassword, resendConfirmation } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [pendingEmail, setPendingEmail] = useState<string>("")

  // Form states
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  })

  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
  })

  const clearMessage = () => setMessage(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessage()

    try {
      const { error } = await signIn(signInForm.email, signInForm.password)
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setMessage({
            type: "error",
            text: "Please check your email and click the confirmation link before signing in.",
          })
          setPendingEmail(signInForm.email)
        } else if (error.message.includes("Invalid login credentials")) {
          setMessage({
            type: "error",
            text: "Invalid email or password. Please check your credentials and try again.",
          })
        } else {
          setMessage({
            type: "error",
            text: error.message || "An error occurred during sign in.",
          })
        }
      } else {
        setMessage({
          type: "success",
          text: "Successfully signed in!",
        })
        setTimeout(() => onClose(), 1500)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessage()

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match. Please check and try again.",
      })
      return
    }

    if (signUpForm.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      })
      return
    }

    setLoading(true)

    try {
      const { error, data } = await signUp(signUpForm.email, signUpForm.password, {
        full_name: signUpForm.fullName,
        phone: signUpForm.phone,
      })

      if (error) {
        if (error.message.includes("User already registered")) {
          setMessage({
            type: "error",
            text: "An account with this email already exists. Try signing in instead.",
          })
        } else {
          setMessage({
            type: "error",
            text: error.message || "An error occurred during sign up.",
          })
        }
      } else {
        setMessage({
          type: "success",
          text: "Account created! Please check your email for a confirmation link. Check your spam folder if you don't see it.",
        })
        setPendingEmail(signUpForm.email)

        // Clear form
        setSignUpForm({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.error("Sign up error:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessage()

    try {
      const { error } = await resetPassword(forgotPasswordForm.email)
      if (error) {
        setMessage({
          type: "error",
          text: error.message || "An error occurred while sending the reset email.",
        })
      } else {
        setMessage({
          type: "success",
          text: "Password reset email sent! Please check your email and spam folder.",
        })
        setPendingEmail(forgotPasswordForm.email)
      }
    } catch (error) {
      console.error("Reset password error:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!pendingEmail) return

    setLoading(true)
    clearMessage()

    try {
      const { error } = await resendConfirmation(pendingEmail)
      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to resend confirmation email.",
        })
      } else {
        setMessage({
          type: "success",
          text: "Confirmation email resent! Please check your email and spam folder.",
        })
      }
    } catch (error) {
      console.error("Resend confirmation error:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-900 border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-slate-100 text-center">
            {showForgotPassword ? "Reset Password" : "Welcome to Ride Rescue"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Message Display */}
          {message && (
            <Alert
              className={`${
                message.type === "error"
                  ? "border-red-500 bg-red-500/10"
                  : message.type === "success"
                    ? "border-green-500 bg-green-500/10"
                    : "border-blue-500 bg-blue-500/10"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-blue-500" />
              )}
              <AlertDescription
                className={`${
                  message.type === "error"
                    ? "text-red-200"
                    : message.type === "success"
                      ? "text-green-200"
                      : "text-blue-200"
                }`}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Resend Confirmation Button */}
          {pendingEmail && (
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-slate-300 text-sm mb-3">
                Didn't receive the email? Check your spam folder or resend it.
              </p>
              <Button
                onClick={handleResendConfirmation}
                disabled={loading}
                variant="outline"
                size="sm"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {loading ? "Sending..." : "Resend Confirmation Email"}
              </Button>
            </div>
          )}

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset_email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="reset_email"
                    type="email"
                    value={forgotPasswordForm.email}
                    onChange={(e) => setForgotPasswordForm({ email: e.target.value })}
                    className="pl-10 bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForgotPassword(false)
                  clearMessage()
                }}
                className="w-full text-slate-400 hover:text-slate-200"
              >
                Back to Sign In
              </Button>
            </form>
          ) : (
            <Tabs defaultValue={initialMode} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="signin" className="data-[state=active]:bg-emerald-600" onClick={clearMessage}>
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-emerald-600" onClick={clearMessage}>
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin_email" className="text-slate-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="signin_email"
                        type="email"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                        className="pl-10 bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signin_password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="signin_password"
                        type={showPassword ? "text" : "password"}
                        value={signInForm.password}
                        onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                        className="pl-10 pr-10 bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Enter your password"
                        required
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

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForgotPassword(true)
                      clearMessage()
                    }}
                    className="text-sm text-emerald-400 hover:text-emerald-300 p-0 h-auto"
                  >
                    Forgot your password?
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup_name" className="text-slate-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="signup_name"
                        type="text"
                        value={signUpForm.fullName}
                        onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                        className="pl-10 bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup_email" className="text-slate-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="signup_email"
                        type="email"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                        className="pl-10 bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup_phone" className="text-slate-300">
                      Phone Number (Optional)
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="signup_phone"
                        type="tel"
                        value={signUpForm.phone}
                        onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                        className="pl-10 bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup_password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="signup_password"
                        type={showPassword ? "text" : "password"}
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                        className="pl-10 pr-10 bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Create a password (min 6 characters)"
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
                    <Label htmlFor="signup_confirm" className="text-slate-300">
                      Confirm Password
                    </Label>
                    <Input
                      id="signup_confirm"
                      type="password"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-slate-100"
                      placeholder="Confirm your password"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {/* Email Troubleshooting Tips */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="text-slate-200 font-medium mb-2">Email Troubleshooting Tips:</h4>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Add noreply@supabase.io to your contacts</li>
              <li>• Wait up to 5 minutes for delivery</li>
              <li>• Try using a different email provider</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
