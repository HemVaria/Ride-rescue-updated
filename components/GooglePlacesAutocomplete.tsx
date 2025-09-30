"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, X } from "lucide-react"
import { useGoogleMaps } from "@/hooks/useGoogleMaps"

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: any) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  initialValue?: string
}

export function GooglePlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Search for a location...",
  className = "",
  disabled = false,
  initialValue = "",
}: GooglePlacesAutocompleteProps) {
  const { searchPlaces, isGoogleMapsAvailable } = useGoogleMaps()
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Debounced search
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !isGoogleMapsAvailable) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const results = await searchPlaces(searchQuery)
        setSuggestions(results)
        setIsOpen(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error("Places search error:", error)
        setSuggestions([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    },
    [searchPlaces, isGoogleMapsAvailable],
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      debouncedSearch(value)
    }, 300)
  }

  // Handle place selection
  const handlePlaceSelect = (place: any) => {
    setQuery(place.description)
    setIsOpen(false)
    setSuggestions([])
    setSelectedIndex(-1)
    onPlaceSelect(place)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handlePlaceSelect(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Clear input
  const clearInput = () => {
    setQuery("")
    setSuggestions([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  if (!isGoogleMapsAvailable) {
    return (
      <Input
        ref={inputRef}
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`bg-gray-900 border-gray-600 text-white ${className}`}
        disabled={disabled}
      />
    )
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-gray-900 border-gray-600 text-white"
          disabled={disabled}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearInput}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-auto text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border-gray-700 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-3 text-center text-gray-400">
                <Search className="w-4 h-4 animate-pulse mx-auto mb-2" />
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => handlePlaceSelect(suggestion)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors ${
                      index === selectedIndex ? "bg-gray-700" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {suggestion.structured_formatting?.main_text || suggestion.description}
                        </p>
                        {suggestion.structured_formatting?.secondary_text && (
                          <p className="text-gray-400 text-xs truncate">
                            {suggestion.structured_formatting.secondary_text}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-gray-400">
                <MapPin className="w-4 h-4 mx-auto mb-2" />
                No locations found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
