"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import type { User, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; data?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null; data?: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return mock functions for development when AuthProvider is not available
    return {
      user: null,
      loading: false,
      signIn: async (email: string, password: string) => {
        console.log("Mock sign in:", email)
        // Simulate different scenarios for testing
        if (email === "test@example.com") {
          return { error: null, data: { user: { email } } }
        }
        return { error: { message: "Invalid login credentials" } as AuthError }
      },
      signUp: async (email: string, password: string, metadata?: any) => {
        console.log("Mock sign up:", email, metadata)
        return { error: null, data: { user: { email } } }
      },
      signOut: async () => {
        console.log("Mock sign out")
      },
      resetPassword: async (email: string) => {
        console.log("Mock reset password:", email)
        return { error: null }
      },
      resendConfirmation: async (email: string) => {
        console.log("Mock resend confirmation:", email)
        return { error: null }
      },
    }
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        }
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error in getSession:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle email confirmation
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        console.log("User email confirmed and signed in")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
      } else {
        console.log("Sign in successful:", data.user?.email)
      }

      return { error, data }
    } catch (error) {
      console.error("Unexpected sign in error:", error)
      return { error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: metadata?.full_name || "",
            phone: metadata?.phone || "",
          },
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "",
        },
      })

      if (error) {
        console.error("Sign up error:", error)
      } else {
        console.log("Sign up successful:", data.user?.email)
        console.log("Confirmation email should be sent to:", email)
      }

      return { error, data }
    } catch (error) {
      console.error("Unexpected sign up error:", error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      } else {
        console.log("Sign out successful")
      }
    } catch (error) {
      console.error("Unexpected sign out error:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : "",
      })

      if (error) {
        console.error("Reset password error:", error)
      } else {
        console.log("Reset password email sent to:", email)
      }

      return { error }
    } catch (error) {
      console.error("Unexpected reset password error:", error)
      return { error: error as AuthError }
    }
  }

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "",
        },
      })

      if (error) {
        console.error("Resend confirmation error:", error)
      } else {
        console.log("Confirmation email resent to:", email)
      }

      return { error }
    } catch (error) {
      console.error("Unexpected resend confirmation error:", error)
      return { error: error as AuthError }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    resendConfirmation,
  }

  return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>
}
