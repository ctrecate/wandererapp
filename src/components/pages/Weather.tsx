import React, { useState, useEffect } from 'react'
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { fetchWeatherForecast } from '@/services/weather'
import type { Weather } from '@/types'
import { formatDate, formatTemperature, getWeatherIcon } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'

const Weather: React.FC = () => {
  const { currentTrip } = useApp()
  const [weatherData, setWeatherData] = useState<Record<string, Weather[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentTrip?.destinations) {
      loadWeatherForAllDestinations()
    }
  }, [currentTrip?.destinations])

  const loadWeatherForAllDestinations = async (forceRefresh = false) => {
    if (!currentTrip) return

    for (const destination of currentTrip.destinations) {
      await loadWeatherForDestination(destination, forceRefresh)
    }
  }

  const loadWeatherForDestination = async (destination: { city: string; country: string; id: string }, forceRefresh = false) => {
    setLoading(prev => ({ ...prev, [destination.id]: true }))
    setError(null)

    try {
      console.log(`🌤️ Loading weather for ${destination.city}, ${destination.country}`)
      const weather = await fetchWeatherForecast(destination.city, destination.country)
      setWeatherData(prev => ({ ...prev, [destination.id]: weather }))
      console.log(`✅ Weather loaded for ${destination.city}:`, weather.length, 'days')
    } catch (err) {
      setError('Failed to load weather data')
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(prev => ({ ...prev, [destination.id]: false }))
    }
  }

  const getWeatherConditionColor = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return 'text-yellow-600 bg-yellow-100'
    }
    if (lowerCondition.includes('cloud')) {
      return 'text-gray-600 bg-gray-100'
    }
    if (lowerCondition.includes('rain')) {
      return 'text-blue-600 bg-blue-100'
    }
    if (lowerCondition.includes('storm')) {
      return 'text-purple-600 bg-purple-100'
    }
    if (lowerCondition.includes('snow')) {
      return 'text-blue-400 bg-blue-50'
    }
    return 'text-gray-600 bg-gray-100'
  }

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <Cloud className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trip selected</h3>
        <p className="mt-1 text-sm text-gray-500">Create a trip first to view weather forecasts.</p>
      </div>
    )
  }

  if (currentTrip.destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <Cloud className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations added</h3>
        <p className="mt-1 text-sm text-gray-500">Add destinations to your trip to see weather forecasts.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
          <p className="text-gray-600">7-day weather forecast for your destinations</p>
        </div>
        <Button 
          onClick={() => loadWeatherForAllDestinations(true)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Force Refresh Weather</span>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {currentTrip.destinations.map((destination) => {
          const weather = weatherData[destination.id] || []
          const isLoading = loading[destination.id]

          return (
            <div key={destination.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {destination.city}, {destination.country}
                </h2>
                <button
                  onClick={() => loadWeatherForDestination(destination)}
                  disabled={isLoading}
                  className="text-sm text-primary hover:text-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner text="Loading weather data..." />
                </div>
              ) : weather.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                  {weather.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        {index === 0 ? 'Today' : formatDate(new Date(day.date))}
                      </div>
                      <div className="text-2xl mb-2">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        {formatTemperature(day.temperature.high)} / {formatTemperature(day.temperature.low)}
                      </div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getWeatherConditionColor(day.condition)}`}>
                        {day.condition}
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center justify-center space-x-1">
                          <Droplets className="h-3 w-3" />
                          <span>{day.precipitation}%</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <Wind className="h-3 w-3" />
                          <span>{day.windSpeed} km/h</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <Thermometer className="h-3 w-3" />
                          <span>{day.humidity}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Cloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">No weather data available</p>
                  <button
                    onClick={() => loadWeatherForDestination(destination)}
                    className="mt-2 text-sm text-primary hover:text-blue-700"
                  >
                    Load weather data
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Weather }
