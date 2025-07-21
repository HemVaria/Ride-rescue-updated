"use client"

import { Auth } from "@/components/ui/auth-form-1"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "signup"
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Auth onClose={onClose} />
    </div>
  )
}
