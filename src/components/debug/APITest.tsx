import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { fetchRestaurantsFromAPI, fetchAttractionsFromAPI } from '@/services/places'
import { fetchWeatherForecast } from '@/services/weather'

const APITest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testAPI = async () => {
    setIsLoading(true)
    setTestResults([])
    
    const results: string[] = []
    
    try {
      // Test restaurants
      results.push('🧪 Testing Google Places API...')
      results.push('🔑 API Key: AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik')
      results.push('')
      
      results.push('🍽️ Testing Restaurants for Barcelona, Spain:')
      const restaurants = await fetchRestaurantsFromAPI('Barcelona', 'Spain')
      results.push(`✅ Restaurants found: ${restaurants.length}`)
      
      if (restaurants.length > 0) {
        results.push(`📍 First restaurant: ${restaurants[0].name}`)
        results.push(`⭐ Rating: ${restaurants[0].rating}`)
        results.push(`🏠 Address: ${restaurants[0].address}`)
        results.push(`🍴 Cuisine: ${restaurants[0].cuisine}`)
        results.push(`💰 Price Range: ${restaurants[0].priceRange}/4`)
      }
      
      results.push('')
      results.push('🏛️ Testing Attractions for Barcelona, Spain:')
      const attractions = await fetchAttractionsFromAPI('Barcelona', 'Spain')
      results.push(`✅ Attractions found: ${attractions.length}`)
      
      if (attractions.length > 0) {
        results.push(`📍 First attraction: ${attractions[0].name}`)
        results.push(`⭐ Rating: ${attractions[0].rating}`)
        results.push(`🏷️ Category: ${attractions[0].category}`)
        results.push(`💰 Cost: ${attractions[0].cost}`)
      }
      
      results.push('')
      results.push('🎯 Testing Tokyo, Japan:')
      const tokyoRestaurants = await fetchRestaurantsFromAPI('Tokyo', 'Japan')
      results.push(`🍽️ Tokyo restaurants: ${tokyoRestaurants.length}`)
      
      if (tokyoRestaurants.length > 0) {
        results.push(`📍 First Tokyo restaurant: ${tokyoRestaurants[0].name}`)
        results.push(`🍴 Cuisine: ${tokyoRestaurants[0].cuisine}`)
      }
      
      results.push('')
      results.push('🌤️ Testing Weather for Barcelona, Spain:')
      const weather = await fetchWeatherForecast('Barcelona', 'Spain')
      results.push(`🌡️ Weather forecast: ${weather.length} days`)
      
      if (weather.length > 0) {
        results.push(`📅 Today: ${weather[0].temperature.high}°C/${weather[0].temperature.low}°C`)
        results.push(`☁️ Condition: ${weather[0].condition}`)
        results.push(`💧 Humidity: ${weather[0].humidity}%`)
        results.push(`🌬️ Wind: ${weather[0].windSpeed} km/h`)
      }
      
    } catch (error) {
      results.push(`❌ Error: ${error}`)
    }
    
    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Google Places API Test</h2>
      
      <Button 
        onClick={testAPI} 
        isLoading={isLoading}
        className="mb-4"
      >
        Test API with Barcelona
      </Button>
      
      {testResults.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Test Results:</h3>
          {testResults.map((result, index) => (
            <div key={index} className="text-sm text-gray-700 mb-1">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { APITest }
