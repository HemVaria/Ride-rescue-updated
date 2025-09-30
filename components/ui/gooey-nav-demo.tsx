"use client"

import React, { useEffect, useState } from "react"
import { GooeyNav } from "@/components/ui/gooey-nav"

const items = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
]

export const GooeyNavDemo: React.FC = () => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  return (
    <div className="flex w-full min-h-screen flex-col justify-center items-center p-4 transition-colors duration-300 bg-black dark:bg-white">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDark((d) => !d)}
          className="p-2 rounded-full border border-gray-700 dark:border-gray-300 bg-gray-900 dark:bg-gray-100 text-white dark:text-black"
        >
          Toggle
        </button>
      </div>

      <div
        className="relative flex justify-center items-center p-5 rounded-xl border border-gray-700 dark:border-gray-300 bg-black dark:bg-white shadow-xl dark:shadow-md"
        style={{ height: "auto", minHeight: "100px" }}
      >
        <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={1}
          animationTime={600}
          timeVariance={300}
        />
      </div>
    </div>
  )
}

export default GooeyNavDemo
