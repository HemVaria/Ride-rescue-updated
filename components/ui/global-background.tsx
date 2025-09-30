"use client"

import { useEffect, useState } from "react"
import Hyperspeed, { hyperspeedPresets } from "@/components/ui/Hyperspeed"

export default function GlobalBackground() {
  const [hidden, setHidden] = useState<boolean>(false)

  useEffect(() => {
    const onVis = () => setHidden(document.visibilityState === "hidden")
    document.addEventListener("visibilitychange", onVis)
    // Initialize state on mount
    onVis()
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  // We keep pointer-events disabled so it never intercepts clicks.
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        filter: hidden ? "blur(10px) brightness(0.7) saturate(0.9)" : "none",
        transition: "filter 300ms ease",
      }}
      aria-hidden
    >
      <Hyperspeed effectOptions={hyperspeedPresets.one} />
    </div>
  )
}
