import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash"
const API_KEY = process.env.GEMINI_API_KEY

const SYSTEM_INSTRUCTIONS = `You are Ride Rescue's master mechanic AI assistant. You turn free-form driver complaints into a concise diagnosis with actionable guidance. Always:
- Respond in JSON only. Never wrap it in markdown fences.
- Populate the following keys every time:
  {
    "summary": string,
    "severity": "low" | "medium" | "high",
    "probableCauses": string[],
    "recommendedActions": string[],
    "diagnosticSteps": string[],
    "estimatedCost": string,
    "followUpQuestions": string[],
    "caution": string
  }
- Base costs and tone for the Indian market.
- Encourage contacting a certified mechanic when the severity is high.`

export async function POST(request: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY. Add it to your environment and restart the dev server." },
      { status: 500 }
    )
  }

  const { prompt } = await request.json().catch(() => ({ prompt: "" }))

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "A prompt is required." }, { status: 400 })
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ 
      model: MODEL,
      systemInstruction: SYSTEM_INSTRUCTIONS 
    })
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
    })

    const rawText = result.response.text() || ""
    const cleaned = rawText.replace(/```json|```/g, "").trim()

    let parsed: Record<string, unknown> | null = null
    try {
      parsed = JSON.parse(cleaned)
    } catch (error) {
      parsed = null
    }

    const responsePayload = {
      summary: typeof parsed?.summary === "string" && parsed.summary.length ? parsed.summary : rawText,
      severity: parsed?.severity === "low" || parsed?.severity === "medium" || parsed?.severity === "high" ? parsed.severity : "medium",
      probableCauses: Array.isArray(parsed?.probableCauses) ? parsed!.probableCauses : [],
      recommendedActions: Array.isArray(parsed?.recommendedActions) ? parsed!.recommendedActions : [],
      diagnosticSteps: Array.isArray(parsed?.diagnosticSteps) ? parsed!.diagnosticSteps : [],
      estimatedCost: typeof parsed?.estimatedCost === "string" ? parsed.estimatedCost : "Request a mechanic for an estimate",
      followUpQuestions: Array.isArray(parsed?.followUpQuestions) ? parsed!.followUpQuestions : [],
      caution: typeof parsed?.caution === "string" ? parsed.caution : "",
      rawText,
    }

    return NextResponse.json(responsePayload)
  } catch (error: any) {
    console.error("Gemini diagnostics error:", error?.message || error)
    return NextResponse.json(
      { 
        error: "Gemini diagnostics failed. Please try again.",
        details: error?.message || "Unknown error"
      }, 
      { status: 500 }
    )
  }
}
