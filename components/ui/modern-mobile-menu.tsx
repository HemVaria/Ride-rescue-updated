"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, Car, Phone, Info, Map, Bot, CreditCard } from 'lucide-react';

export interface InteractiveMenuItem {
  label: string;
  href: string;
}

export interface InteractiveMenuProps {
  items?: InteractiveMenuItem[];
  accentColor?: string;
}

const defaultAccentColor = 'var(--component-active-color-default)';

const labelToIcon = (label: string) => {
  const key = label.trim().toLowerCase();
  if (key === 'home') return Home;
  if (key === 'services') return Wrench;
  if (key === 'dashboard') return Car;
  if (key === 'contact') return Phone;
  if (key === 'about') return Info;
  if (key === 'ai fix') return Bot;
  if (key === 'pricing') return CreditCard;
  return Home;
};

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ items, accentColor }) => {
  const pathname = usePathname();

  const finalItems = useMemo(() => {
    const isValid = items && Array.isArray(items) && items.length >= 2 && items.length <= 5;
    if (!isValid) {
      console.warn("InteractiveMenu: 'items' prop is invalid or missing.", items);
      return items ?? [];
    }
    return items;
  }, [items]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= (finalItems?.length ?? 0)) {
      setActiveIndex(0);
    }
  }, [finalItems, activeIndex]);

  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const setLineWidth = () => {
      const activeItemElement = itemRefs.current[activeIndex];
      const activeTextElement = textRefs.current[activeIndex];

      if (activeItemElement && activeTextElement) {
        const textWidth = activeTextElement.offsetWidth;
        activeItemElement.style.setProperty('--lineWidth', `${textWidth}px`);
      }
    };

    setLineWidth();

    window.addEventListener('resize', setLineWidth);
    return () => {
      window.removeEventListener('resize', setLineWidth);
    };
  }, [activeIndex, finalItems]);

  const navStyle = useMemo(() => {
    const activeColor = accentColor || defaultAccentColor;
    return { ['--component-active-color' as any]: activeColor } as React.CSSProperties;
  }, [accentColor]);

  return (
    <nav
      className="fixed top-[max(0.5rem,env(safe-area-inset-top))] left-1/2 z-50 -translate-x-1/2 flex gap-0 p-2 bg-transparent"
      role="navigation"
      style={navStyle}
    >
      {finalItems?.map((item, index) => {
        const isActive = pathname === item.href;
        if (isActive && activeIndex !== index) setActiveIndex(index);

        const IconComponent = labelToIcon(item.label);

        return (
          <Link key={item.label} href={item.href} className="flex-1">
            <button
              className={`menu__item ${isActive ? 'active' : ''} group relative flex flex-col items-center justify-center px-5 py-3 rounded-2xl w-full 
                ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}
                transition-all duration-300 ease-out hover:scale-[1.06] active:scale-[0.98]`}
              ref={(el) => { itemRefs.current[index] = el }}
              style={{ ['--lineWidth' as any]: '0px' } as React.CSSProperties}
            >
              <div className="menu__icon">
                <IconComponent className={`icon h-6 w-6 transition-transform duration-300 ${isActive ? '[animation:iconBounce_1s_ease]' : 'group-hover:scale-110'}`} />
              </div>
              <strong
                className={`menu__text ${isActive ? 'active' : ''} text-[13px] mt-1`}
                ref={(el) => { textRefs.current[index] = el }}
              >
                {item.label}
              </strong>
              {/* active underline */}
              <span
                className={`pointer-events-none absolute bottom-1 h-[3px] rounded-full bg-emerald-400/80 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                style={{ width: 'var(--lineWidth)' } as React.CSSProperties}
              />
            </button>
          </Link>
        );
      })}
    </nav>
  );
};

export { InteractiveMenu }
