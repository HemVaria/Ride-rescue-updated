"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PromptSuggestion } from "@/components/ui/prompt-suggestion"
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { ArrowUpIcon } from "lucide-react"

export function PromptSuggestionBasic() {
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("Sending:", inputValue)
      setInputValue("")
    }
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        <PromptSuggestion onClick={() => setInputValue("Tell me a joke")}>
          Tell me a joke
        </PromptSuggestion>
        <PromptSuggestion onClick={() => setInputValue("How does this work?")}>
          How does this work?
        </PromptSuggestion>
        <PromptSuggestion onClick={() => setInputValue("Generate an image of a cat")}>
          Generate an image of a cat
        </PromptSuggestion>
        <PromptSuggestion onClick={() => setInputValue("Write a poem")}>
          Write a poem
        </PromptSuggestion>
        <PromptSuggestion onClick={() => setInputValue("Code a React component")}>
          Code a React component
        </PromptSuggestion>
      </div>

      <PromptInput
        className="border-input bg-background border shadow-xs"
        value={inputValue}
        onValueChange={setInputValue}
        onSubmit={handleSend}
      >
        <PromptInputTextarea placeholder="Type a message or click a suggestion..." />
        <PromptInputActions className="justify-end">
          <Button
            size="sm"
            className="size-9 cursor-pointer rounded-full"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label="Send"
          >
            <ArrowUpIcon className="h-4 min-h-4 min-w-4 w-4" />
          </Button>
        </PromptInputActions>
      </PromptInput>
    </div>
  )
}
