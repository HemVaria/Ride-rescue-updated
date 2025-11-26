"use client"

import { useMemo, useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  Bot,
  Gauge,
  Loader2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PromptSuggestion } from "@/components/ui/prompt-suggestion"
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

type GeminiSeverity = "low" | "medium" | "high"

type GeminiAnalysis = {
  summary: string
  severity: GeminiSeverity
  probableCauses: string[]
  recommendedActions: string[]
  diagnosticSteps: string[]
  estimatedCost: string
  followUpQuestions: string[]
  caution?: string
  rawText?: string
}

type AssistantMessage = {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: number
  analysis?: GeminiAnalysis
}

const suggestionPresets = [
  "Engine temperature spikes in traffic",
  "Steering wheel vibrates above 80 km/h",
  "Brake pedal feels soft after rain",
  "Car pulls left when braking",
  "Battery warning light flickers",
  "Grinding noise when turning right",
  "Air conditioner smells damp",
  "Vehicle stalls at idle with AC on",
]

const severityTheme: Record<GeminiSeverity, { label: string; badge: string; border: string }> = {
  low: {
    label: "Low urgency",
    badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    border: "border-emerald-500/30",
  },
  medium: {
    label: "Needs attention",
    badge: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    border: "border-amber-500/30",
  },
  high: {
    label: "Critical",
    badge: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
    border: "border-rose-500/30",
  },
}

export default function DiagnosticsPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("")
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Hi! I'm your Ride Rescue AI mechanic powered by Gemini. Tell me what's happening — strange sounds, warning lights, smells, whatever you notice.",
      timestamp: Date.now(),
    },
  ])
  const [isPending, startTransition] = useTransition()

  const filteredSuggestions = useMemo(() => {
    const trimmed = filter.trim().toLowerCase()
    if (!trimmed) return suggestionPresets
    return suggestionPresets.filter((suggestion) =>
      suggestion.toLowerCase().includes(trimmed)
    )
  }, [filter])

  const latestAnalysis = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].analysis) return messages[i].analysis
    }
    return undefined
  }, [messages])

  const sendPrompt = (value?: string) => {
    const prompt = (value ?? query).trim()
    if (!prompt) return

    const userMessage: AssistantMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    }

  setMessages((prev) => [...prev, userMessage])
  setQuery("")

    startTransition(async () => {
      try {
        const response = await fetch("/api/diagnostics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        const payload: GeminiAnalysis = await response.json()
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            content: payload.summary || "Here's what I found",
            timestamp: Date.now(),
            analysis: payload,
          },
        ])
      } catch (error) {
        console.error(error)
        toast({
          title: "Couldn't reach Gemini",
          description: "Check your internet connection or GEMINI_API_KEY.",
          variant: "destructive",
        })
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant-error`,
            role: "assistant",
            content:
              "I couldn't talk to Gemini right now. Please verify your API key and try again.",
            timestamp: Date.now(),
          },
        ])
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10">
            <Sparkles className="h-6 w-6 text-purple-300" />
          </div>
          <h1 className="text-3xl font-semibold md:text-5xl">
            AI Fix & Diagnostics
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-400">
            Gemini-powered assistant that translates symptoms into mechanic-friendly action plans.
            Describe any sound, smell, light, or behavior and get probable causes, severity, and next steps.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm text-emerald-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            Gemini service status: Online
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="border-slate-800 bg-slate-900/70 backdrop-blur">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-purple-300" />
                Ride Rescue AI Mechanic
                {isPending && (
                  <span className="ml-auto inline-flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    thinking...
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-0">
              <ScrollArea className="h-[420px] px-6 py-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-2xl border p-2 ${
                          message.role === "assistant"
                            ? "border-purple-500/40 bg-purple-500/10"
                            : "border-slate-700 bg-slate-800"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-full w-full text-purple-200" />
                        ) : (
                          <User className="h-full w-full text-slate-300" />
                        )}
                      </div>
                      <div
                        className={`max-w-full rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                          message.role === "assistant"
                            ? "border-purple-500/20 bg-slate-900"
                            : "border-slate-700 bg-slate-800"
                        }`}
                      >
                        <p className="whitespace-pre-line text-base text-slate-100">
                          {message.content}
                        </p>
                        {message.analysis && (
                          <div className="mt-4 space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge className={severityTheme[message.analysis.severity].badge}>
                                {severityTheme[message.analysis.severity].label}
                              </Badge>
                              <span className="text-xs text-slate-400">
                                Estimated repair budget: {message.analysis.estimatedCost}
                              </span>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <section className="space-y-1">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                                  <AlertTriangle className="h-4 w-4 text-amber-300" />
                                  Likely causes
                                </div>
                                <ul className="space-y-1 text-slate-200">
                                  {(message.analysis.probableCauses || []).map((cause) => (
                                    <li key={cause} className="flex items-start gap-2 text-sm">
                                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                                      {cause}
                                    </li>
                                  ))}
                                </ul>
                              </section>

                              <section className="space-y-1">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                                  <Wrench className="h-4 w-4 text-emerald-300" />
                                  Recommended fixes
                                </div>
                                <ul className="space-y-1 text-slate-200">
                                  {(message.analysis.recommendedActions || []).map((action) => (
                                    <li key={action} className="flex items-start gap-2 text-sm">
                                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </section>
                            </div>

                            {message.analysis.diagnosticSteps?.length ? (
                              <section className="space-y-1">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                                  <Stethoscope className="h-4 w-4 text-sky-300" />
                                  DIY checks
                                </div>
                                <ol className="space-y-1 text-slate-200">
                                  {message.analysis.diagnosticSteps.map((step, index) => (
                                    <li key={step} className="text-sm">
                                      <span className="font-semibold text-slate-400">{index + 1}.</span> {step}
                                    </li>
                                  ))}
                                </ol>
                              </section>
                            ) : null}

                            {message.analysis.followUpQuestions?.length ? (
                              <section className="space-y-1">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                                  <Gauge className="h-4 w-4 text-blue-300" />
                                  Follow-up questions
                                </div>
                                <ul className="space-y-1 text-slate-200">
                                  {message.analysis.followUpQuestions.map((question) => (
                                    <li key={question} className="text-sm text-slate-300">
                                      {question}
                                    </li>
                                  ))}
                                </ul>
                              </section>
                            ) : null}

                            {message.analysis.caution && (
                              <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-sm text-rose-200">
                                <AlertTriangle className="mr-2 inline h-4 w-4 text-rose-300" />
                                {message.analysis.caution}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  <AnimatePresence>
                    {isPending && (
                      <motion.div
                        key="thinking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 text-sm text-slate-400"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gemini is working on your diagnosis...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className="border-t border-slate-800 px-6 py-5">
                <PromptInput
                  className="border border-slate-800 bg-slate-900/70"
                  value={query}
                  onValueChange={setQuery}
                  onSubmit={() => sendPrompt()}
                >
                  <PromptInputTextarea placeholder="Describe the symptoms, sounds, smells, or warning lights..." />
                  <PromptInputActions className="justify-between">
                    <div className="flex flex-wrap gap-2">
                      {filteredSuggestions.slice(0, 3).map((suggestion) => (
                        <PromptSuggestion
                          key={suggestion}
                          highlight={filter}
                          onClick={() => setQuery(suggestion)}
                          size="sm"
                          variant="ghost"
                          className="rounded-full border border-slate-800 text-xs"
                        >
                          {suggestion}
                        </PromptSuggestion>
                      ))}
                    </div>
                    <Button
                      disabled={!query.trim() || isPending}
                      onClick={() => sendPrompt()}
                      className="rounded-full bg-purple-600 hover:bg-purple-500"
                    >
                      Send
                    </Button>
                  </PromptInputActions>
                </PromptInput>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-base">Suggested prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  placeholder="Search symptoms (eg. brake, vibration)"
                  className="border-slate-800 bg-slate-950 text-sm"
                />
                <div className="flex flex-col gap-2">
                  {filteredSuggestions.map((suggestion) => (
                    <PromptSuggestion
                      key={suggestion}
                      highlight={filter}
                      onClick={() => {
                        setQuery(suggestion)
                        sendPrompt(suggestion)
                      }}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl border border-slate-800 text-left text-sm"
                    >
                      {suggestion}
                    </PromptSuggestion>
                  ))}
                </div>
              </CardContent>
            </Card>

            {latestAnalysis && (
              <Card className={`border ${severityTheme[latestAnalysis.severity].border} bg-slate-900/70`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    Latest prognosis
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-300">
                  <p className="text-base text-slate-100">{latestAnalysis.summary}</p>
                  <p className="text-xs text-slate-400">Estimated cost: {latestAnalysis.estimatedCost}</p>
                  {latestAnalysis.caution && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-100">
                      <AlertTriangle className="mr-2 inline h-4 w-4" />
                      {latestAnalysis.caution}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
