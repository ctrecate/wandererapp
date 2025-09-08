import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlacePrediction {
  place_id: string
  description: string
  city: string
  country: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface PlaceAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (city: string, country: string) => void
  placeholder?: string
  className?: string
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Search for a city...",
  className
}) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (value.length < 2) {
      setPredictions([])
      setIsOpen(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      console.log('🔍 Autocomplete: Searching for:', value)
      try {
        const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(value)}`)
        console.log('📡 Autocomplete: Response status:', response.status)
        
        const data = await response.json()
        console.log('📊 Autocomplete: Response data:', data)
        
        if (data.predictions && data.predictions.length > 0) {
          console.log(`✅ Autocomplete: Found ${data.predictions.length} predictions`)
          setPredictions(data.predictions)
          setIsOpen(true)
          setSelectedIndex(-1)
        } else {
          console.log('❌ Autocomplete: No predictions found')
          setPredictions([])
          setIsOpen(false)
        }
      } catch (error) {
        console.error('💥 Autocomplete: Error fetching autocomplete:', error)
        setPredictions([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || predictions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handleSelect(predictions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSelect = (prediction: PlacePrediction) => {
    onChange(prediction.description)
    onSelect(prediction.city, prediction.country)
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setIsOpen(true)
    }
  }

  const handleInputBlur = () => {
    // Delay closing to allow clicks on suggestions
    setTimeout(() => {
      setIsOpen(false)
      setSelectedIndex(-1)
    }, 150)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            className
          )}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && predictions.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              onClick={() => handleSelect(prediction)}
              className={cn(
                "flex items-center px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0",
                index === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
              )}
            >
              <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {prediction.structured_formatting.main_text}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {prediction.structured_formatting.secondary_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { PlaceAutocomplete }
