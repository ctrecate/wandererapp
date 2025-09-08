import React, { useState, useEffect } from 'react'
import { Utensils, Star, MapPin, Phone, Clock, Heart, Filter, Navigation, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { getRestaurantsForCity } from '@/data/restaurants'
import { fetchRestaurantsFromAPI } from '@/services/places'
import type { Restaurant } from '@/types'
import { cn } from '@/lib/utils'

const Restaurants: React.FC = () => {
  const { currentTrip, saveTrip } = useApp()
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant[]>>({})
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    cuisine: '',
    priceRange: '',
    minRating: 0
  })

  useEffect(() => {
    if (currentTrip?.destinations) {
      loadRestaurantsForDestinations()
    }
  }, [currentTrip?.destinations])

  const loadRestaurantsForDestinations = async (forceAPI = false) => {
    if (!currentTrip) return

    const newRestaurants: Record<string, Restaurant[]> = {}
    let shouldSaveTrip = false
    
    for (const destination of currentTrip.destinations) {
      try {
        console.log(`🍽️ DEBUG: Loading restaurants for ${destination.city}, ${destination.country}`)
        
        // Check if we already have restaurants for this destination and don't need to force refresh
        const existingRestaurants = destination.restaurants || []
        if (existingRestaurants.length > 0 && !forceAPI) {
          console.log(`🍽️ DEBUG: Using existing restaurants for ${destination.city}`)
          console.log(`🍽️ DEBUG: Existing restaurants data:`, existingRestaurants.map(r => ({
            name: r.name,
            website: r.website,
            phone: r.phone,
            openingHours: r.openingHours
          })))
          newRestaurants[destination.id] = existingRestaurants
          continue
        }
        
        // Always try API first if forceAPI is true, otherwise try API then fallback
        console.log(`🍽️ DEBUG: Fetching from API for ${destination.city}`)
        let cityRestaurants = await fetchRestaurantsFromAPI(destination.city, destination.country)
        
        console.log(`🍽️ DEBUG: API returned ${cityRestaurants.length} restaurants for ${destination.city}`)
        console.log(`🍽️ DEBUG: Raw API data:`, cityRestaurants.map(r => ({
          name: r.name,
          website: r.website,
          phone: r.phone,
          openingHours: r.openingHours
        })))
        
        // If API returns empty, show empty state
        if (cityRestaurants.length === 0) {
          console.log(`🍽️ DEBUG: No restaurants found for ${destination.city}`)
        }
        
        // Merge with existing restaurants from the destination
        const mergedRestaurants = cityRestaurants.map(restaurant => {
          const existing = existingRestaurants.find(existing => existing.id === restaurant.id)
          const merged = existing ? { ...restaurant, ...existing } : restaurant
          console.log(`🍽️ DEBUG: Merged restaurant ${merged.name}:`, {
            website: merged.website,
            phone: merged.phone,
            openingHours: merged.openingHours
          })
          return merged
        })
        newRestaurants[destination.id] = mergedRestaurants
        
        // Mark that we need to save the trip (only if we fetched new data)
        shouldSaveTrip = true
        
      } catch (error) {
        console.error('🍽️ DEBUG: Error loading restaurants for', destination.city, error)
        // No fallback data - show empty state
        newRestaurants[destination.id] = []
      }
    }

    console.log(`🍽️ DEBUG: Final restaurants data:`, newRestaurants)
    setRestaurants(newRestaurants)
    
    // Only save the trip if we actually fetched new data
    if (shouldSaveTrip) {
      const updatedDestinations = currentTrip.destinations.map(dest => {
        if (newRestaurants[dest.id]) {
          return { ...dest, restaurants: newRestaurants[dest.id] }
        }
        return dest
      })
      
      const updatedTrip = { ...currentTrip, destinations: updatedDestinations }
      console.log(`🍽️ DEBUG: Saving trip with restaurants:`, updatedTrip.destinations.map(d => ({
        city: d.city,
        restaurants: d.restaurants?.map(r => ({
          name: r.name,
          website: r.website,
          phone: r.phone,
          openingHours: r.openingHours
        }))
      })))
      saveTrip(updatedTrip)
    }
  }

  const toggleBookmark = (destinationId: string, restaurantId: string) => {
    if (!currentTrip) return

    // Update local state
    const updatedRestaurants = restaurants[destinationId]?.map(restaurant => {
      if (restaurant.id === restaurantId) {
        return { ...restaurant, isBookmarked: !restaurant.isBookmarked }
      }
      return restaurant
    }) || []

    setRestaurants(prev => ({
      ...prev,
      [destinationId]: updatedRestaurants
    }))

    // Save to trip
    const updatedDestinations = currentTrip.destinations.map(destination => {
      if (destination.id === destinationId) {
        return { ...destination, restaurants: updatedRestaurants }
      }
      return destination
    })

    const updatedTrip = { ...currentTrip, destinations: updatedDestinations }
    saveTrip(updatedTrip)
  }

  const openGoogleMaps = (restaurant: Restaurant) => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`)
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(mapsUrl, '_blank')
  }

  const openWebsite = (restaurant: Restaurant) => {
    if (restaurant.website) {
      window.open(restaurant.website, '_blank')
    }
  }

  const getPriceRangeDisplay = (priceRange: number) => {
    return '$'.repeat(priceRange)
  }

  const getPriceRangeColor = (priceRange: number) => {
    switch (priceRange) {
      case 1: return 'text-green-600 bg-green-100'
      case 2: return 'text-yellow-600 bg-yellow-100'
      case 3: return 'text-orange-600 bg-orange-100'
      case 4: return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCuisines = () => {
    const allRestaurants = Object.values(restaurants).flat()
    const cuisines = [...new Set(allRestaurants.map(r => r.cuisine))]
    return cuisines.sort()
  }

  const filterRestaurants = (restaurantList: Restaurant[]) => {
    return restaurantList.filter(restaurant => {
      if (filters.cuisine && restaurant.cuisine !== filters.cuisine) return false
      if (filters.priceRange && restaurant.priceRange.toString() !== filters.priceRange) return false
      if (filters.minRating && restaurant.rating < filters.minRating) return false
      return true
    })
  }

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <Utensils className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trip selected</h3>
        <p className="mt-1 text-sm text-gray-500">Create a trip first to explore restaurants.</p>
      </div>
    )
  }

  if (currentTrip.destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <Utensils className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations added</h3>
        <p className="mt-1 text-sm text-gray-500">Add destinations to your trip to see restaurants.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants & Dining</h1>
          <p className="text-gray-600">Discover local cuisine and dining recommendations</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => loadRestaurantsForDestinations(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Force Refresh from Google Places</span>
          </Button>
          
          <Button 
            onClick={() => {
              console.log('🔍 DEBUG: Current restaurants state:', restaurants)
              console.log('🔍 DEBUG: Current trip destinations:', currentTrip?.destinations)
              
              // Show current restaurant data
              const allRestaurants = Object.values(restaurants).flat()
              const restaurantsWithWebsites = allRestaurants.filter(r => r.website)
              const restaurantsWithHours = allRestaurants.filter(r => r.openingHours && r.openingHours !== 'Hours not available')
              
              alert(`Current Restaurant Data:\n\nTotal restaurants: ${allRestaurants.length}\nRestaurants with websites: ${restaurantsWithWebsites.length}\nRestaurants with hours: ${restaurantsWithHours.length}\n\nCheck console for detailed data.`)
            }}
            variant="outline"
            className="flex items-center space-x-2 bg-yellow-100 text-yellow-800"
          >
            <span>🐛</span>
            <span>Debug Data</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
            <select
              value={filters.cuisine}
              onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Cuisines</option>
              {getCuisines().map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Prices</option>
              <option value="1">$ (Budget)</option>
              <option value="2">$$ (Moderate)</option>
              <option value="3">$$$ (Expensive)</option>
              <option value="4">$$$$ (Very Expensive)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="0">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
        </div>
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

      {/* Restaurants List */}
      <div className="space-y-6">
        {currentTrip.destinations
          .filter(destination => !selectedDestination || destination.id === selectedDestination)
          .map(destination => {
            const destinationRestaurants = filterRestaurants(restaurants[destination.id] || [])
            
            if (destinationRestaurants.length === 0) {
              return (
                <div key={destination.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {destination.city}, {destination.country}
                  </h2>
                  <div className="text-center py-8">
                    <Utensils className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No restaurants found for {destination.city}, {destination.country}</p>
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
                  {destinationRestaurants.map(restaurant => (
                    <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {restaurant.photoUrl && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={restaurant.photoUrl} 
                                  alt={restaurant.name}
                                  className="w-20 h-20 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-medium text-gray-900">{restaurant.name}</h3>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600">{restaurant.rating}</span>
                                </div>
                                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriceRangeColor(restaurant.priceRange))}>
                                  {getPriceRangeDisplay(restaurant.priceRange)}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{restaurant.address}</span>
                            </div>
                            {restaurant.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-4 w-4" />
                                <span>{restaurant.phone}</span>
                              </div>
                            )}
                            {restaurant.openingHours && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{restaurant.openingHours}</span>
                              </div>
                            )}
                          </div>
                          
                          {restaurant.mustTryDishes.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Must-try dishes:</p>
                              <div className="flex flex-wrap gap-1">
                                {restaurant.mustTryDishes.map((dish, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                    {dish}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex flex-col space-y-2">
                          <Button
                            variant={restaurant.isBookmarked ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => toggleBookmark(destination.id, restaurant.id)}
                            className="flex items-center space-x-1"
                          >
                            <Heart className={cn('h-4 w-4', restaurant.isBookmarked ? 'fill-current' : '')} />
                            <span>{restaurant.isBookmarked ? 'Saved' : 'Save'}</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openGoogleMaps(restaurant)}
                            className="flex items-center space-x-1"
                          >
                            <Navigation className="h-4 w-4" />
                            <span>Directions</span>
                          </Button>
                          
                          {restaurant.website && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openWebsite(restaurant)}
                              className="flex items-center space-x-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Website</span>
                            </Button>
                          )}
                          {/* Debug info - remove this later */}
                          {process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-gray-400 mt-1">
                              Debug: website={restaurant.website ? 'YES' : 'NO'}
                            </div>
                          )}
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

export { Restaurants }
