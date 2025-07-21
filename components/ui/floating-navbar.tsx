"use client";
import React, { useState, type ReactNode } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: ReactNode;
    }[];
    className?: string;
}) => {
    // Always visible
    const visible = true;
    const { user } = useAuth();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{
                    opacity: 1,
                    y: 0,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className={cn(
                    "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/30 dark:border-white/20 rounded-3xl backdrop-blur-lg bg-white/60 dark:bg-black/40 shadow-lg z-[5000] pr-10 pl-12 py-4 items-center justify-center space-x-6",
                    className
                )}
            >
                {navItems.map((navItem: any, idx: number) => (
                    <a
                        key={`link=${idx}`}
                        href={navItem.link}
                        className={cn(
                            "relative dark:text-neutral-50 items-center flex space-x-2 text-neutral-700 dark:hover:text-neutral-200 hover:text-neutral-900 text-lg font-semibold px-4 py-2 transition-colors duration-150"
                        )}
                    >
                        <span className="block sm:hidden">{React.cloneElement(navItem.icon, { className: "h-7 w-7" })}</span>
                        <span className="hidden sm:block text-base">{navItem.name}</span>
                    </a>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};
