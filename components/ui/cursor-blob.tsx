"use client"

import { useEffect, useRef } from "react"

type CursorBlobProps = {
  size?: number // diameter in px
  opacity?: number // 0..1
  colorA?: string
  colorB?: string
  blur?: number // px blur
  easing?: number // 0..1 (closer to 1 = slower)
}

/**
 * A colorful, acrylic-like cursor-follow blob.
 * - Uses transform: translate3d for smooth GPU animation
 * - Disables on touch devices and respects reduced-motion
 */
export default function CursorBlob({
  size = 140,
  opacity = 0.25,
  colorA = "#22d3ee", // cyan-400
  colorB = "#22c55e", // emerald-500
  blur = 24,
  easing = 0.15,
}: CursorBlobProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Disable on touch devices
    const isTouch = matchMedia("(pointer: coarse)").matches
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (isTouch || reduceMotion) {
      el.style.display = "none"
      return
    }

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      if (!raf.current) raf.current = requestAnimationFrame(tick)
    }

    const tick = () => {
      // lerp towards target
      pos.current.x += (target.current.x - pos.current.x) * easing
      pos.current.y += (target.current.y - pos.current.y) * easing
      const x = pos.current.x - size / 2
      const y = pos.current.y - size / 2
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }, [easing, size])

  const style: React.CSSProperties = {
    position: "fixed",
    left: 0,
    top: 0,
    width: size,
    height: size,
    pointerEvents: "none",
    zIndex: 30,
    opacity,
    willChange: "transform",
    mixBlendMode: "screen",
    borderRadius: "9999px",
    background: `radial-gradient(50% 50% at 50% 50%, ${colorA} 0%, ${colorB} 100%)`,
    filter: `blur(${blur}px)`,
    transition: "opacity 200ms ease",
  }

  return <div ref={ref} style={style} aria-hidden />
}
