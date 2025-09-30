"use client"

import { useEffect, useRef } from "react"

export type HyperspeedBackgroundProps = {
  /** Number of streaks (performance-sensitive). */
  count?: number
  /** Base speed multiplier. */
  speed?: number
  /** Line width in CSS pixels. */
  lineWidth?: number
  /** Line color in light mode. */
  colorLight?: string
  /** Line color in dark mode. */
  colorDark?: string
  /** Background tint overlay. */
  tint?: string
  /** Optional className for the wrapper. */
  className?: string
  /** Override reduced-motion and animate anyway. */
  force?: boolean
}

// Simple starfield/hyperspeed canvas animation
export default function HyperspeedBackground({
  count = 250,
  speed = 1,
  lineWidth = 1.25,
  colorLight = "rgba(0,0,0,0.65)",
  colorDark = "rgba(255,255,255,0.55)",
  tint = "rgba(16, 24, 39, 0.5)", // slate-900/50
  className = "",
  force = false,
}: HyperspeedBackgroundProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReduced && !force) {
      // In reduced motion, we skip animation and show a subtle gradient fallback.
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1))
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = canvas
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
        ctx.resetTransform()
        ctx.scale(dpr, dpr)
        const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.2)
        grad.addColorStop(0, "rgba(59, 130, 246, 0.25)") // blue-500/25
        grad.addColorStop(1, "rgba(16, 185, 129, 0.05)") // emerald-500/5
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)
      return () => ro.disconnect()
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1))

    type Streak = {
      x: number
      y: number
      z: number
      pz: number
    }

    let width = 0
    let height = 0
    let centerX = 0
    let centerY = 0
    const streaks: Streak[] = []

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas
      width = w
      height = h
      centerX = w / 2
      centerY = h / 2
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.resetTransform()
      ctx.scale(dpr, dpr)
    }

    const initStreak = (s: Streak) => {
      // Random position in a unit square mapped to screen
      s.x = (Math.random() * 2 - 1) * centerX
      s.y = (Math.random() * 2 - 1) * centerY
      s.z = Math.random() * Math.max(centerX, centerY)
      s.pz = s.z
    }

    const createStreak = (): Streak => {
      const s: Streak = { x: 0, y: 0, z: 0, pz: 0 }
      initStreak(s)
      return s
    }

    const ensureCount = () => {
      while (streaks.length < count) streaks.push(createStreak())
      if (streaks.length > count) streaks.splice(count)
    }

    const getMode = () => document.documentElement.classList.contains("dark") ? "dark" : "light"
    let mode = getMode()

    const draw = () => {
      // Clear with subtle tint to create trails
      ctx.fillStyle = tint
      ctx.fillRect(0, 0, width, height)

      const color = mode === "dark" ? colorDark : colorLight
  ctx.globalCompositeOperation = "lighter"
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineCap = "round"
      ctx.beginPath()

      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i]
        // Move towards the viewer
        s.z -= 20 * (speed || 1) * 0.5
        if (s.z < 1) {
          initStreak(s)
          continue
        }
        // Project to 2D
        const sx = (s.x / s.z) * centerX + centerX
        const sy = (s.y / s.z) * centerY + centerY
        const px = (s.x / s.pz) * centerX + centerX
        const py = (s.y / s.pz) * centerY + centerY

        // Draw streak from previous to current projected position
        ctx.moveTo(px, py)
        ctx.lineTo(sx, sy)

        s.pz = s.z
      }

      ctx.stroke()
      raf.current = requestAnimationFrame(draw)
    }

    const handleThemeMutation = () => {
      const newMode = getMode()
      if (newMode !== mode) mode = newMode
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      ensureCount()
    })
    resizeObserver.observe(canvas)

    const observer = new MutationObserver(handleThemeMutation)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    // Initial setup
    resize()
    ensureCount()
    draw()

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = null
      resizeObserver.disconnect()
      observer.disconnect()
    }
  }, [count, speed, colorLight, colorDark, tint])

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`} aria-hidden>
      <canvas ref={ref} className="w-full h-full" />
    </div>
  )
}
