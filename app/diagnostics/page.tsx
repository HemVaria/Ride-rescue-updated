"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Sparkles, AlertTriangle, CheckCircle, Wrench } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  id: number
  role: "ai" | "user"
  content: string
  type?: "text" | "analysis" | "solution"
}

export default function DiagnosticsPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "ai", content: "Hello! I'm your AI Diagnostic Assistant. Describe the issue you're facing with your vehicle (e.g., 'strange noise when braking', 'engine overheating').", type: "text" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now(), role: "user", content: input, type: "text" }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: generateResponse(userMsg.content),
        type: "analysis"
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase()
    if (q.includes("brake") || q.includes("noise")) {
      return "Based on your description, it sounds like your brake pads might be worn out. The screeching noise is often the wear indicator rubbing against the rotor. \n\n**Potential Issues:**\n• Worn Brake Pads (High Probability)\n• Warped Rotors\n• Debris stuck in caliper\n\n**Estimated Repair Cost:** ₹1,500 - ₹3,000"
    } else if (q.includes("start") || q.includes("battery")) {
      return "If the car isn't starting, it's likely a battery or starter issue. Do you hear a clicking sound when you turn the key?\n\n**Potential Issues:**\n• Dead Battery (High Probability)\n• Faulty Alternator\n• Starter Motor Failure\n\n**Estimated Repair Cost:** ₹3,000 - ₹6,000"
    } else if (q.includes("smoke") || q.includes("heat")) {
      return "Smoke or overheating is serious. Please stop the vehicle immediately.\n\n**Potential Issues:**\n• Coolant Leak\n• Radiator Failure\n• Blown Head Gasket (Severe)\n\n**Recommendation:** Do not drive. Request a tow immediately."
    }
    return "I'm analyzing that... Could you provide more details? Is there any specific sound, smell, or warning light on the dashboard?"
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pt-20 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-4 border border-purple-500/20">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            AI Vehicle Diagnostics
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Describe your car troubles and let our advanced AI engine diagnose the issue and estimate repair costs instantly.
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-[600px] flex flex-col shadow-2xl">
          <CardHeader className="border-b border-slate-800 py-4">
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Bot className="w-5 h-5 text-purple-400" />
              Diagnostic Assistant
              <span className="ml-auto text-xs font-normal text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden p-0 relative">
            <ScrollArea className="h-full p-4 md:p-6">
              <div className="space-y-6 pb-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "ai" ? "bg-purple-600" : "bg-slate-700"
                    }`}>
                      {msg.role === "ai" ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                    </div>
                    
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === "ai" 
                        ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700" 
                        : "bg-purple-600 text-white rounded-tr-none"
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                        {msg.content}
                      </div>
                      
                      {msg.type === "analysis" && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                            <Wrench className="w-3 h-3 mr-2" />
                            Book Repair
                          </Button>
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                            Not helpful
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 border border-slate-700 flex items-center gap-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your problem..."
                className="bg-slate-950 border-slate-700 text-white focus-visible:ring-purple-500"
              />
              <Button type="submit" disabled={!input.trim() || isTyping} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
