import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { Home, Wrench, Car, Phone } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ride Rescue - 24/7 Roadside Assistance",
  description:
    "Professional roadside assistance when you need it most. Available 24/7 for emergency repairs, towing, fuel delivery, and more.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { name: "Home", link: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Services", link: "/services", icon: <Wrench className="h-4 w-4" /> },
    { name: "Dashboard", link: "/dashboard", icon: <Car className="h-4 w-4" /> },
  ];
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <FloatingNav navItems={navItems} />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
