import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"
import { Home, Wrench, Car, Info, Map, LayoutDashboard, Bot, CreditCard } from "lucide-react"
import { InteractiveMenu } from "@/components/ui/modern-mobile-menu"
import CursorBlob from "@/components/ui/cursor-blob"
import GlobalBackground from "@/components/ui/global-background"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Ride Rescue - 24/7 Roadside Assistance",
  description:
    "Professional roadside assistance when you need it most. Available 24/7 for emergency repairs, towing, fuel delivery, and more.",
  generator: "hehehem",
  manifest: "/manifest.webmanifest",
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
    { name: "AI Fix", link: "/diagnostics", icon: <Bot className="h-4 w-4" /> },
    { name: "Pricing", link: "/pricing", icon: <CreditCard className="h-4 w-4" /> },
  ]
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <script dangerouslySetInnerHTML={{ __html: 'window.chtlConfig = { chatbotId: "6115949275" }' }} />
        <script
          async
          data-id="6115949275"
          id="chtl-script"
          type="text/javascript"
          src="https://chatling.ai/js/embed.js"
        />
        {/* Global background effect behind everything */}
        <GlobalBackground />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {/* Colorful cursor-follow blob (disabled on touch and reduced-motion) */}
            <CursorBlob />
            <div className="pt-4 pb-4">{children}</div>
            {/* Mobile dock-style nav */}
            <InteractiveMenu
              items={navItems.map((n) => ({ label: n.name, href: n.link }))}
            />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
