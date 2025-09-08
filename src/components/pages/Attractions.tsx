import React, { useState, useEffect } from 'react'
import { MapPin, Clock, DollarSign, Star, CheckCircle, Circle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { getAttractionsForCity } from '@/data/attractions'
import { fetchAttractionsFromAPI } from '@/services/places'
import type { Attraction } from '@/types'
import { cn } from '@/lib/utils'

const Attractions: React.FC = () => {
  const { currentTrip, saveTrip } = useApp()
  const [attractions, setAttractions] = useState<Record<string, Attraction[]>>({})
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)

  useEffect(() => {
    if (currentTrip?.destinations) {
      loadAttractionsForDestinations()
    }
  }, [currentTrip?.destinations])

  const loadAttractionsForDestinations = async (forceAPI = false) => {
    if (!currentTrip) return

    const newAttractions: Record<string, Attraction[]> = {}
    
    for (const destination of currentTrip.destinations) {
      try {
        console.log(`Loading attractions for ${destination.city}, ${destination.country}`)
        
        // Always try API first if forceAPI is true, otherwise try API then fallback
        let cityAttractions = await fetchAttractionsFromAPI(destination.city, destination.country)
        
        console.log(`API returned ${cityAttractions.length} attractions for ${destination.city}`)
        
        // If API returns empty, show empty state
        if (cityAttractions.length === 0) {
          console.log(`No attractions found for ${destination.city}`)
        }
        
        // Merge with existing attractions from the destination
        const existingAttractions = destination.attractions || []
        const mergedAttractions = cityAttractions.map(attraction => {
          const existing = existingAttractions.find(existing => existing.id === attraction.id)
          return existing ? { ...attraction, ...existing } : attraction
        })
        newAttractions[destination.id] = mergedAttractions
        
        // Don't auto-save to prevent flashing - just store in local state
      } catch (error) {
        console.error('Error loading attractions for', destination.city, error)
        // No fallback data - show empty state
        newAttractions[destination.id] = []
      }
    }

    setAttractions(newAttractions)
  }

  const toggleAttractionStatus = (destinationId: string, attractionId: string, status: 'isPlanned' | 'isCompleted') => {
    // Just update local state - no auto-saving to prevent flashing
    setAttractions(prev => ({
      ...prev,
      [destinationId]: prev[destinationId]?.map(attraction => {
        if (attraction.id === attractionId) {
          return {
            ...attraction,
            [status]: !attraction[status],
            // If marking as completed, also mark as planned
            ...(status === 'isCompleted' && !attraction.isCompleted ? { isPlanned: true } : {})
          }
        }
        return attraction
      }) || []
    }))
  }

  const getPriceRangeColor = (cost: string) => {
    if (cost.toLowerCase().includes('free')) return 'text-green-600 bg-green-100'
    if (cost.includes('€') || cost.includes('$')) {
      const amount = parseInt(cost.replace(/[^\d]/g, ''))
      if (amount < 20) return 'text-yellow-600 bg-yellow-100'
      if (amount < 50) return 'text-orange-600 bg-orange-100'
      return 'text-red-600 bg-red-100'
    }
    return 'text-gray-600 bg-gray-100'
  }

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trip selected</h3>
        <p className="mt-1 text-sm text-gray-500">Create a trip first to explore attractions.</p>
      </div>
    )
  }

  if (currentTrip.destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations added</h3>
        <p className="mt-1 text-sm text-gray-500">Add destinations to your trip to see attractions.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attractions & Landmarks</h1>
          <p className="text-gray-600">Discover must-see attractions for your destinations</p>
        </div>
        <Button 
          onClick={() => loadAttractionsForDestinations(true)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Force Refresh from Google Places</span>
        </Button>
      </div>

      {/* Destination Filter */}
      {currentTrip.destinations.length > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDestination(null)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                selectedDestination === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              All Destinations
            </button>
            {currentTrip.destinations.map(destination => (
              <button
                key={destination.id}
                onClick={() => setSelectedDestination(destination.id)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  selectedDestination === destination.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {destination.city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attractions List */}
      <div className="space-y-6">
        {currentTrip.destinations
          .filter(destination => !selectedDestination || destination.id === selectedDestination)
          .map(destination => {
            const destinationAttractions = attractions[destination.id] || []
            
            if (destinationAttractions.length === 0) {
              return (
                <div key={destination.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {destination.city}, {destination.country}
                  </h2>
                  <div className="text-center py-8">
                    <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No attractions found for {destination.city}, {destination.country}</p>
                    <p className="text-sm text-gray-400 mt-1">Try checking the spelling or try a different city</p>
                  </div>
                </div>
              )
            }

            return (
              <div key={destination.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {destination.city}, {destination.country}
                </h2>
                
                <div className="grid gap-4">
                  {destinationAttractions.map(attraction => (
                    <div key={attraction.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {attraction.imageUrl && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={attraction.imageUrl} 
                                  alt={attraction.name}
                                  className="w-20 h-20 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-medium text-gray-900">{attraction.name}</h3>
                                {attraction.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600">{attraction.rating}</span>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-gray-600 mb-3">{attraction.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{attraction.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriceRangeColor(attraction.cost))}>
                                {attraction.cost}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{attraction.howToGetThere}</span>
                            </div>
                          </div>
                          
                          {attraction.openingHours && (
                            <p className="text-sm text-gray-500 mb-3">
                              <strong>Hours:</strong> {attraction.openingHours}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant={attraction.isPlanned ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => toggleAttractionStatus(destination.id, attraction.id, 'isPlanned')}
                            className="flex items-center space-x-1"
                          >
                            {attraction.isPlanned ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                            <span>{attraction.isPlanned ? 'Planned' : 'Plan'}</span>
                          </Button>
                          
                          <Button
                            variant={attraction.isCompleted ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => toggleAttractionStatus(destination.id, attraction.id, 'isCompleted')}
                            className="flex items-center space-x-1"
                            disabled={!attraction.isPlanned}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>{attraction.isCompleted ? 'Visited' : 'Visit'}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export { Attractions }
