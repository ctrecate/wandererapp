import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'

const PlacesDebugger: React.FC = () => {
  const [debugResults, setDebugResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [testCity, setTestCity] = useState('Munich')
  const [testCountry, setTestCountry] = useState('Germany')

  const runFullDebug = async () => {
    setIsLoading(true)
    setDebugResults([])
    
    const results: string[] = []
    
    try {
      results.push('🔍 STARTING COMPREHENSIVE DEBUG TEST')
      results.push('=' .repeat(50))
      results.push('')
      
      // Test 1: Check if API routes are accessible
      results.push('📡 TEST 1: Checking API Route Accessibility')
      try {
        const testResponse = await fetch('/api/places/restaurants?city=test&country=test')
        results.push(`✅ API Route accessible: ${testResponse.status} ${testResponse.statusText}`)
      } catch (error) {
        results.push(`❌ API Route error: ${error}`)
      }
      results.push('')
      
      // Test 2: Test autocomplete API
      results.push('🔍 TEST 2: Testing Autocomplete API')
      try {
        const autoResponse = await fetch('/api/places/autocomplete?input=mun')
        const autoData = await autoResponse.json()
        results.push(`✅ Autocomplete status: ${autoResponse.status}`)
        results.push(`📊 Autocomplete data: ${JSON.stringify(autoData, null, 2)}`)
      } catch (error) {
        results.push(`❌ Autocomplete error: ${error}`)
      }
      results.push('')
      
      // Test 3: Test restaurants API with Munich
      results.push('🍽️ TEST 3: Testing Restaurants API with Munich, Germany')
      try {
        const restaurantResponse = await fetch(`/api/places/restaurants?city=${encodeURIComponent(testCity)}&country=${encodeURIComponent(testCountry)}`)
        results.push(`📡 Restaurant API status: ${restaurantResponse.status} ${restaurantResponse.statusText}`)
        
        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json()
          results.push(`📊 Restaurant API response: ${JSON.stringify(restaurantData, null, 2)}`)
        } else {
          const errorText = await restaurantResponse.text()
          results.push(`❌ Restaurant API error: ${errorText}`)
        }
      } catch (error) {
        results.push(`❌ Restaurant API error: ${error}`)
      }
      results.push('')
      
      // Test 4: Test attractions API with Munich
      results.push('🏛️ TEST 4: Testing Attractions API with Munich, Germany')
      try {
        const attractionResponse = await fetch(`/api/places/attractions?city=${encodeURIComponent(testCity)}&country=${encodeURIComponent(testCountry)}`)
        results.push(`📡 Attraction API status: ${attractionResponse.status} ${attractionResponse.statusText}`)
        
        if (attractionResponse.ok) {
          const attractionData = await attractionResponse.json()
          results.push(`📊 Attraction API response: ${JSON.stringify(attractionData, null, 2)}`)
        } else {
          const errorText = await attractionResponse.text()
          results.push(`❌ Attraction API error: ${errorText}`)
        }
      } catch (error) {
        results.push(`❌ Attraction API error: ${error}`)
      }
      results.push('')
      
      // Test 5: Test Google Places API Key
      results.push('🧪 TEST 5: Testing Google Places API Key')
      try {
        const testResponse = await fetch('/api/places/test')
        const testData = await testResponse.json()
        results.push(`📡 API Key test status: ${testResponse.status}`)
        results.push(`📊 API Key test result: ${JSON.stringify(testData, null, 2)}`)
      } catch (error) {
        results.push(`❌ API Key test error: ${error}`)
      }
      results.push('')
      
      // Test 6: Test with different cities
      results.push('🌍 TEST 6: Testing with Different Cities')
      const testCities = [
        { city: 'Barcelona', country: 'Spain' },
        { city: 'Tokyo', country: 'Japan' },
        { city: 'New York', country: 'USA' }
      ]
      
      for (const test of testCities) {
        try {
          const response = await fetch(`/api/places/restaurants?city=${encodeURIComponent(test.city)}&country=${encodeURIComponent(test.country)}`)
          const data = await response.json()
          results.push(`📍 ${test.city}, ${test.country}: ${response.status} - ${data.restaurants?.length || 0} restaurants`)
        } catch (error) {
          results.push(`❌ ${test.city}, ${test.country}: Error - ${error}`)
        }
      }
      
      results.push('')
      results.push('🏁 DEBUG TEST COMPLETE')
      
    } catch (error) {
      results.push(`💥 CRITICAL ERROR: ${error}`)
    }
    
    setDebugResults(results)
    setIsLoading(false)
  }

  const testSpecificCity = async () => {
    setIsLoading(true)
    setDebugResults([])
    
    const results: string[] = []
    results.push(`🎯 TESTING SPECIFIC CITY: ${testCity}, ${testCountry}`)
    results.push('=' .repeat(50))
    
    try {
      // Test restaurants
      const restaurantResponse = await fetch(`/api/places/restaurants?city=${encodeURIComponent(testCity)}&country=${encodeURIComponent(testCountry)}`)
      results.push(`🍽️ Restaurants API: ${restaurantResponse.status}`)
      
      if (restaurantResponse.ok) {
        const restaurantData = await restaurantResponse.json()
        results.push(`📊 Restaurants found: ${restaurantData.restaurants?.length || 0}`)
        results.push(`📋 Source: ${restaurantData.source}`)
        if (restaurantData.restaurants?.length > 0) {
          results.push(`📍 First restaurant: ${restaurantData.restaurants[0].name}`)
        }
      }
      
      // Test attractions
      const attractionResponse = await fetch(`/api/places/attractions?city=${encodeURIComponent(testCity)}&country=${encodeURIComponent(testCountry)}`)
      results.push(`🏛️ Attractions API: ${attractionResponse.status}`)
      
      if (attractionResponse.ok) {
        const attractionData = await attractionResponse.json()
        results.push(`📊 Attractions found: ${attractionData.attractions?.length || 0}`)
        results.push(`📋 Source: ${attractionData.source}`)
        if (attractionData.attractions?.length > 0) {
          results.push(`📍 First attraction: ${attractionData.attractions[0].name}`)
        }
      }
      
    } catch (error) {
      results.push(`❌ Error: ${error}`)
    }
    
    setDebugResults(results)
    setIsLoading(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🔧 Places API Debugger</h2>
      
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={testCity}
            onChange={(e) => setTestCity(e.target.value)}
            placeholder="City"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            value={testCountry}
            onChange={(e) => setTestCountry(e.target.value)}
            placeholder="Country"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runFullDebug} 
            isLoading={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🔍 Run Full Debug Test
          </Button>
          <Button 
            onClick={testSpecificCity} 
            isLoading={isLoading}
            variant="outline"
          >
            🎯 Test Specific City
          </Button>
        </div>
      </div>
      
      {debugResults.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Debug Results:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
            {debugResults.join('\n')}
          </pre>
        </div>
      )}
    </div>
  )
}

export { PlacesDebugger }
