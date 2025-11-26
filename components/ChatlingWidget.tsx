"use client"

import Script from "next/script"

export default function ChatlingWidget() {
  return (
    <>
      <Script id="chatling-config" strategy="afterInteractive">
        {`window.chtlConfig = { chatbotId: "6115949275" }`}
      </Script>
      <Script
        id="chtl-script"
        src="https://chatling.ai/js/embed.js"
        data-id="6115949275"
        strategy="afterInteractive"
      />
    </>
  )
}
