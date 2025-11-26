"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PromptInputContextValue {
  value: string
  onValueChange?: (value: string) => void
  onSubmit?: () => void
}

const PromptInputContext = React.createContext<PromptInputContextValue | null>(null)

function usePromptInputContext() {
  const context = React.useContext(PromptInputContext)
  if (!context) {
    throw new Error("PromptInput components must be used within <PromptInput>")
  }
  return context
}

export interface PromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange?: (value: string) => void
  onSubmit?: () => void
}

function PromptInput({ value, onValueChange, onSubmit, className, children, ...props }: PromptInputProps) {
  return (
    <PromptInputContext.Provider value={{ value, onValueChange, onSubmit }}>
      <div
        className={cn(
          "flex w-full flex-col gap-3 rounded-3xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </PromptInputContext.Provider>
  )
}

const PromptInputTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, placeholder, ...props }, ref) => {
    const { value, onValueChange, onSubmit } = usePromptInputContext()

    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[80px] w-full resize-none border-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0",
          className
        )}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault()
            onSubmit?.()
          }
        }}
        {...props}
      />
    )
  }
)
PromptInputTextarea.displayName = "PromptInputTextarea"

const PromptInputActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
  )
)
PromptInputActions.displayName = "PromptInputActions"

export { PromptInput, PromptInputTextarea, PromptInputActions }
