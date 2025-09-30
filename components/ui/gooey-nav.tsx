"use client"

import React, { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface GooeyNavItem {
  label: string
  href: string
}

export interface GooeyNavProps {
  items: GooeyNavItem[]
  animationTime?: number
  particleCount?: number
  particleDistances?: [number, number]
  particleR?: number
  timeVariance?: number
  initialActiveIndex?: number
}

export const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const filterRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex)

  const noise = (n = 1) => n / 2 - Math.random() * n

  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180)
    return [distance * Math.cos(angle), distance * Math.sin(angle)]
  }

  // Particles removed for a smooth glow move effect

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const pos = element.getBoundingClientRect()
    const styles = {
      left: `${pos.left - containerRect.left}px`,
      top: `${pos.top - containerRect.top}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    }
    Object.assign(filterRef.current.style, styles)
    Object.assign(textRef.current.style, styles)
    textRef.current.innerText = element.innerText
  }

  const handleClick = (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    const liEl = e.currentTarget
    if (activeIndex === index) return

    setActiveIndex(index)
    updateEffectPosition(liEl)

    // Smooth move only; no particle burst
  }

  const handleLinkKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const liEl = e.currentTarget.parentElement as HTMLLIElement
      if (liEl) {
        handleClick({ currentTarget: liEl } as unknown as React.KeyboardEvent<HTMLLIElement>, index)
      }
    }
  }

  useEffect(() => {
    if (!navRef.current || !containerRef.current || !textRef.current || !filterRef.current) return

    const listItems = navRef.current.querySelectorAll("li")
    if (listItems.length === 0) return

    const activeLi = listItems[activeIndex] as HTMLElement
    if (activeLi) {
      updateEffectPosition(activeLi)
    }

    const resizeObserver = new ResizeObserver(() => {
      if (navRef.current) {
        const currentActiveLi = navRef.current.querySelectorAll("li")[activeIndex] as HTMLElement
        if (currentActiveLi) {
          updateEffectPosition(currentActiveLi)
        }
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, [activeIndex, items])

  return (
    <>
      <style>
        {`
          .gooey-nav-container {
            /* Light mode defaults */
            --nav-bg: transparent;
            --nav-border: rgba(0, 0, 0, 0.12);
            --nav-text: #111827; /* slate-900 */
            --nav-text-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.2);

            /* Transparent/dim pill so text always remains visible */
            --bubble-bg: rgba(0, 0, 0, 0.10);
            --active-text: #111827;
            --particle-color: rgba(0, 0, 0, 0.25);

            --filter-backdrop-bg: transparent;
            --filter-blend-mode: normal;

            --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
          }
          html.dark .gooey-nav-container {
            /* Dark mode overrides */
            --nav-bg: transparent;
            --nav-border: rgba(255, 255, 255, 0.12);
            --nav-text: #e5e7eb; /* slate-200 for a bit more contrast */
            --nav-text-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.2);

            /* Softer white pill so white text stays visible */
            --bubble-bg: rgba(255, 255, 255, 0.14);
            --active-text: #ffffff;
            --particle-color: rgba(255, 255, 255, 0.25);

            --filter-backdrop-bg: transparent;
            --filter-blend-mode: normal;
          }

          .gooey-nav-container ul {
            background: var(--nav-bg);
            border: 1px solid var(--nav-border);
            border-radius: 9999px;
          }
          .gooey-nav-container ul li {
            color: var(--nav-text);
            text-shadow: var(--nav-text-shadow);
            transition: color 0.3s ease, text-shadow 0.3s ease;
          }
          .gooey-nav-container ul li a {
            color: var(--nav-text);
            position: relative;
            z-index: 2; /* keep text above glow */
            transition: color 320ms var(--linear-ease);
          }
          .gooey-nav-container ul li.active {
            color: var(--active-text);
            text-shadow: none;
          }
          .gooey-nav-container ul li.active a {
            color: var(--active-text);
          }
          /* Disable per-item bubble; use a single moving glow instead */
          .gooey-nav-container ul li::after { display: none; }

          .gooey-nav-container .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1; /* sits under the link text (z-index:2) */
            transition: left 320ms var(--linear-ease), top 320ms var(--linear-ease), width 320ms var(--linear-ease), height 320ms var(--linear-ease);
          }
          .gooey-nav-container .effect.text { display: none; }
          .gooey-nav-container .effect.filter {
            /* Smooth moving pill with soft transparent glow */
            border-radius: 9999px;
            background: var(--bubble-bg);
            backdrop-filter: saturate(140%) blur(6px);
            -webkit-backdrop-filter: saturate(140%) blur(6px);
            box-shadow:
              0 8px 18px rgba(0, 0, 0, 0.28),
              0 0 0 1px rgba(255, 255, 255, 0.06) inset,
              0 0 16px rgba(255, 255, 255, 0.10);
          }
        `}
      </style>
      <div className="gooey-nav-container relative" ref={containerRef}>
        <nav className="flex relative" style={{ transform: "translate3d(0,0,0.01px)" }}>
          <ul
            ref={navRef}
            className={cn("flex gap-x-2 sm:gap-x-4 list-none p-0 px-2 sm:px-4 m-0 relative z-[3]")}
            role="menubar"
            aria-label="Main navigation"
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={cn(
                  `py-2 px-3 sm:py-3 sm:px-5 rounded-full relative cursor-pointer`,
                  activeIndex === index ? "active" : "",
                )}
                onClick={(e) => handleClick(e, index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleClick(e, index)
                  }
                }}
                role="menuitem"
                aria-current={activeIndex === index ? "page" : undefined}
                tabIndex={0}
              >
                <Link href={item.href} className="outline-none no-underline" style={{ color: "inherit" }} tabIndex={-1}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
  <span className="effect filter" ref={filterRef} />
  <span className="effect text" ref={textRef} />
      </div>
    </>
  )
}

export default GooeyNav
