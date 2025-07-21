"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

// --------------------------------
// Types and Enums
// --------------------------------
enum AuthView {
  SIGN_IN = "sign-in",
  SIGN_UP = "sign-up",
  FORGOT_PASSWORD = "forgot-password",
  RESET_SUCCESS = "reset-success",
}

interface AuthState {
  view: AuthView
}

interface FormState {
  isLoading: boolean
  error: string | null
  showPassword: boolean
}

// --------------------------------
// Schemas
// --------------------------------
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type SignInFormValues = z.infer<typeof signInSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

// --------------------------------
// Main Auth Component
// --------------------------------
function Auth({ className, onClose, ...props }: React.ComponentProps<"div"> & { onClose?: () => void }) {
  const [state, setState] = React.useState<AuthState>({ view: AuthView.SIGN_IN })
  const setView = React.useCallback((view: AuthView) => {
    setState((prev) => ({ ...prev, view }))
  }, [])

  return (
    <div data-slot="auth" className={cn("mx-auto w-full max-w-md", className)} {...props}>
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent" />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {state.view === AuthView.SIGN_IN && (
              <AuthSignIn
                key="sign-in"
                onForgotPassword={() => setView(AuthView.FORGOT_PASSWORD)}
                onSignUp={() => setView(AuthView.SIGN_UP)}
                onClose={onClose}
              />
            )}
            {state.view === AuthView.SIGN_UP && (
              <AuthSignUp key="sign-up" onSignIn={() => setView(AuthView.SIGN_IN)} onClose={onClose} />
            )}
            {state.view === AuthView.FORGOT_PASSWORD && (
              <AuthForgotPassword
                key="forgot-password"
                onSignIn={() => setView(AuthView.SIGN_IN)}
                onSuccess={() => setView(AuthView.RESET_SUCCESS)}
              />
            )}
            {state.view === AuthView.RESET_SUCCESS && (
              <AuthResetSuccess key="reset-success" onSignIn={() => setView(AuthView.SIGN_IN)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// --------------------------------
// Shared Components
// --------------------------------
interface AuthFormProps<T> {
  onSubmit: (data: T) => Promise<void>
  children: React.ReactNode
  className?: string
}

function AuthForm<T>({ onSubmit, children, className }: AuthFormProps<T>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(e as any)
      }}
      data-slot="auth-form"
      className={cn("space-y-6", className)}
    >
      {children}
    </form>
  )
}

interface AuthErrorProps {
  message: string | null
}

function AuthError({ message }: AuthErrorProps) {
  if (!message) return null
  return (
    <div
      data-slot="auth-error"
      className="mb-6 animate-in rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 backdrop-blur-sm"
    >
      {message}
    </div>
  )
}

interface AuthSocialButtonsProps {
  isLoading: boolean
  onGoogleSignIn: () => void
}

function AuthSocialButtons({ isLoading, onGoogleSignIn }: AuthSocialButtonsProps) {
  return (
    <div data-slot="auth-social-buttons" className="w-full mt-6">
      <Button
        variant="outline"
        className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        disabled={isLoading}
        onClick={onGoogleSignIn}
        type="button"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Continue with Google
      </Button>
    </div>
  )
}

interface AuthSeparatorProps {
  text?: string
}

function AuthSeparator({ text = "Or continue with" }: AuthSeparatorProps) {
  return (
    <div data-slot="auth-separator" className="relative mt-6">
      <div className="absolute inset-0 flex items-center">
        <Separator className="bg-white/20" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-transparent px-2 text-white/70">{text}</span>
      </div>
    </div>
  )
}

// --------------------------------
// Sign In Component
// --------------------------------
interface AuthSignInProps {
  onForgotPassword: () => void
  onSignUp: () => void
  onClose?: () => void
}

function AuthSignIn({ onForgotPassword, onSignUp, onClose }: AuthSignInProps) {
  const { signIn, signInWithGoogle } = useAuth()
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: SignInFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await signIn(data.email, data.password)
      if (error) {
        setFormState((prev) => ({ ...prev, error: error.message }))
      } else {
        onClose?.()
      }
    } catch (error) {
      setFormState((prev) => ({ ...prev, error: "An unexpected error occurred" }))
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const handleGoogleSignIn = async () => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setFormState((prev) => ({ ...prev, error: error.message }))
      } else {
        onClose?.()
      }
    } catch (error) {
      setFormState((prev) => ({ ...prev, error: "An unexpected error occurred" }))
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <motion.div
      data-slot="auth-sign-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-8"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-white/70">Sign in to your account</p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/90">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={formState.isLoading}
            className={cn(
              "bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm",
              errors.email && "border-red-500/50",
            )}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white/90">
              Password
            </Label>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-xs text-white/70 hover:text-white"
              onClick={onForgotPassword}
              disabled={formState.isLoading}
            >
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={formState.showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={formState.isLoading}
              className={cn(
                "bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm pr-10",
                errors.password && "border-red-500/50",
              )}
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
              disabled={formState.isLoading}
            >
              {formState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-xs text-red-300">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </AuthForm>

      <AuthSeparator />
      <AuthSocialButtons isLoading={formState.isLoading} onGoogleSignIn={handleGoogleSignIn} />

      <p className="mt-8 text-center text-sm text-white/70">
        No account?{" "}
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-white hover:text-white/80"
          onClick={onSignUp}
          disabled={formState.isLoading}
        >
          Create one
        </Button>
      </p>
    </motion.div>
  )
}

// --------------------------------
// Sign Up Component
// --------------------------------
interface AuthSignUpProps {
  onSignIn: () => void
  onClose?: () => void
}

function AuthSignUp({ onSignIn, onClose }: AuthSignUpProps) {
  const { signUp, signInWithGoogle } = useAuth()
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", terms: false },
  })

  const terms = watch("terms")

  const onSubmit = async (data: SignUpFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await signUp(data.email, data.password, {
        full_name: data.name,
      })
      if (error) {
        setFormState((prev) => ({ ...prev, error: error.message }))
      } else {
        setFormState((prev) => ({
          ...prev,
          error: null,
        }))
        // Show success message
        alert("Account created! Please check your email for confirmation.")
      }
    } catch (error) {
      setFormState((prev) => ({ ...prev, error: "An unexpected error occurred" }))
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const handleGoogleSignIn = async () => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setFormState((prev) => ({ ...prev, error: error.message }))
      } else {
        onClose?.()
      }
    } catch (error) {
      setFormState((prev) => ({ ...prev, error: "An unexpected error occurred" }))
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <motion.div
      data-slot="auth-sign-up"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-8"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-sm text-white/70">Get started with your account</p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/90">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            disabled={formState.isLoading}
            className={cn(
              "bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm",
              errors.name && "border-red-500/50",
            )}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-red-300">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/90">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={formState.isLoading}
            className={cn(
              "bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm",
              errors.email && "border-red-500/50",
            )}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/90">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={formState.showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={formState.isLoading}
              className={cn(
                "bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm pr-10",
                errors.password && "border-red-500/50",
              )}
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
              disabled={formState.isLoading}
            >
              {formState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-xs text-red-300">{errors.password.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={terms}
            onCheckedChange={(checked) => setValue("terms", checked === true)}
            disabled={formState.isLoading}
            className="border-white/20 data-[state=checked]:bg-emerald-600"
          />
          <div className="space-y-1">
            <Label htmlFor="terms" className="text-sm text-white/90">
              I agree to the terms
            </Label>
            <p className="text-xs text-white/60">
              By signing up, you agree to our{" "}
              <Button variant="link" className="h-auto p-0 text-xs text-white/80 hover:text-white">
                Terms
              </Button>{" "}
              and{" "}
              <Button variant="link" className="h-auto p-0 text-xs text-white/80 hover:text-white">
                Privacy Policy
              </Button>
              .
            </p>
          </div>
        </div>
        {errors.terms && <p className="text-xs text-red-300">{errors.terms.message}</p>}

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </AuthForm>

      <AuthSeparator />
      <AuthSocialButtons isLoading={formState.isLoading} onGoogleSignIn={handleGoogleSignIn} />

      <p className="mt-8 text-center text-sm text-white/70">
        Have an account?{" "}
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-white hover:text-white/80"
          onClick={onSignIn}
          disabled={formState.isLoading}
        >
          Sign in
        </Button>
      </p>
    </motion.div>
  )
}

// --------------------------------
// Forgot Password Component
// --------------------------------
interface AuthForgotPasswordProps {
  onSignIn: () => void
  onSuccess: () => void
}

function AuthForgotPassword({ onSignIn, onSuccess }: AuthForgotPasswordProps) {
  const { resetPassword } = useAuth()
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await resetPassword(data.email)
      if (error) {
        setFormState((prev) => ({ ...prev, error: error.message }))
      } else {
        onSuccess()
      }
    } catch (error) {
      setFormState((prev) => ({ ...prev, error: "An unexpected error occurred" }))
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <motion.div
      data-slot="auth-forgot-password"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-8"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4 text-white/70 hover:text-white hover:bg-white/10"
        onClick={onSignIn}
        disabled={formState.isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Reset password</h1>
        <p className="mt-2 text-sm text-white/70">Enter your email to receive a reset link</p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/90">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={formState.isLoading}
            className={cn(
              "bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm",
              errors.email && "border-red-500/50",
            )}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </AuthForm>

      <p className="mt-8 text-center text-sm text-white/70">
        Remember your password?{" "}
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-white hover:text-white/80"
          onClick={onSignIn}
          disabled={formState.isLoading}
        >
          Sign in
        </Button>
      </p>
    </motion.div>
  )
}

// --------------------------------
// Reset Success Component
// --------------------------------
interface AuthResetSuccessProps {
  onSignIn: () => void
}

function AuthResetSuccess({ onSignIn }: AuthResetSuccessProps) {
  return (
    <motion.div
      data-slot="auth-reset-success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col items-center p-8 text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/20 backdrop-blur-sm">
        <MailCheck className="h-8 w-8 text-emerald-400" />
      </div>
      <h1 className="text-2xl font-semibold text-white">Check your email</h1>
      <p className="mt-2 text-sm text-white/70">We sent a password reset link to your email.</p>
      <Button
        variant="outline"
        className="mt-6 w-full max-w-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={onSignIn}
      >
        Back to sign in
      </Button>
      <p className="mt-6 text-xs text-white/60">
        No email? Check spam or{" "}
        <Button variant="link" className="h-auto p-0 text-xs text-white/80 hover:text-white">
          try another email
        </Button>
      </p>
    </motion.div>
  )
}

// --------------------------------
// Exports
// --------------------------------
export {
  Auth,
  AuthSignIn,
  AuthSignUp,
  AuthForgotPassword,
  AuthResetSuccess,
  AuthForm,
  AuthError,
  AuthSocialButtons,
  AuthSeparator,
}
