import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { fetchRestaurantsFromAPI, fetchAttractionsFromAPI } from '@/services/places'

const APITest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testAPI = async () => {
    setIsLoading(true)
    setTestResults([])
    
    const results: string[] = []
    
    try {
      // Test restaurants
      results.push('Testing Google Places API...')
      results.push('API Key: AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik')
      
      const restaurants = await fetchRestaurantsFromAPI('Barcelona', 'Spain')
      results.push(`Restaurants found: ${restaurants.length}`)
      
      if (restaurants.length > 0) {
        results.push(`First restaurant: ${restaurants[0].name}`)
        results.push(`Rating: ${restaurants[0].rating}`)
        results.push(`Address: ${restaurants[0].address}`)
      }
      
      // Test attractions
      const attractions = await fetchAttractionsFromAPI('Barcelona', 'Spain')
      results.push(`Attractions found: ${attractions.length}`)
      
      if (attractions.length > 0) {
        results.push(`First attraction: ${attractions[0].name}`)
        results.push(`Rating: ${attractions[0].rating}`)
      }
      
    } catch (error) {
      results.push(`Error: ${error}`)
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
