"use client"

import { useEffect } from "react"

export default function ChatlingWidget() {
  useEffect(() => {
    // Set config early
    ;(window as any).chtlConfig = { chatbotId: "6115949275" }

    // If script already present, do nothing
    if (document.getElementById("chtl-script")) return

    const s = document.createElement("script")
    s.id = "chtl-script"
    s.async = true
    s.type = "text/javascript"
    s.src = "https://chatling.ai/js/embed.js"
    s.setAttribute("data-id", "6115949275")

    document.body.appendChild(s)

    return () => {
      // Optional cleanup: keep widget persistent across pages; don't remove by default
    }
  }, [])

  return null
}
