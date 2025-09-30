"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Home, Wrench, Car, User, LogIn, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "next-themes"
import { GooeyNav } from "@/components/ui/gooey-nav"

export type AppBarItem = {
  name: string
  link: string
  icon?: React.ReactNode
}

export function AppBar({ items }: { items: AppBarItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  // Construct display items with default icons if not provided
  const displayItems = items.map((it) => ({
    ...it,
    icon:
      it.icon ?? (it.name === "Home" ? <Home className="h-4 w-4" /> : it.name === "Services" ? <Wrench className="h-4 w-4" /> : it.name === "Dashboard" ? <Car className="h-4 w-4" /> : null),
  }))

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Glass App Bar */}
      <div className="bg-gradient-to-b from-slate-900/60 to-slate-900/30 supports-[backdrop-filter]:bg-slate-900/40 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Brand + menu button */}
          <div className="flex items-center gap-2">
            <button
              className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:bg-white/10"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-md ring-1 ring-emerald-400/40 bg-emerald-500/10">
                <Image src="/riderescue - Edited.png" alt="Ride Rescue" fill className="object-contain p-1.5" priority />
              </div>
              <span className="font-semibold tracking-tight text-slate-100 text-lg">Ride Rescue</span>
            </Link>
          </div>

          {/* Center: gooey nav (desktop) with subtle acrylic wrapper */}
          <div className="hidden sm:flex items-center rounded-full bg-white/5 dark:bg-white/10 backdrop-blur-md ring-1 ring-white/10 px-2 py-1">
            <GooeyNav
              items={displayItems.map((it) => ({ label: it.name, href: it.link }))}
              initialActiveIndex={Math.max(
                0,
                displayItems.findIndex((it) => it.link === pathname),
              )}
              particleCount={14}
              particleDistances={[80, 8]}
              particleR={80}
              animationTime={500}
              timeVariance={240}
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-slate-300 hover:text-slate-100 hover:bg-white/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 dark:hidden" />
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="hidden sm:inline-flex text-slate-300 hover:text-slate-100 text-sm">
                  <User className="h-4 w-4 mr-1" /> Dashboard
                </Link>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-200" onClick={signOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Link href="/auth" className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-100 text-sm">
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "sm:hidden fixed top-20 inset-x-0 z-40 transition-transform duration-200",
          open ? "translate-y-0" : "-translate-y-2 pointer-events-none opacity-0"
        )}
      >
        <div className="mx-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl ring-1 ring-white/10 p-2 space-y-1 shadow-2xl">
          {displayItems.map((it) => {
            const active = pathname === it.link
            return (
              <Link
                key={it.name}
                href={it.link}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  active ? "text-white bg-white/10 ring-1 ring-white/10" : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                {it.icon}
                <span>{it.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
