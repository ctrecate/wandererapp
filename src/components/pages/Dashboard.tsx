import React from 'react'
import { MapPin, Calendar, Camera, Utensils, Plus, Heart, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { formatDateRange, getDaysBetween } from '@/lib/utils'
import type { Destination } from '@/types'

const Dashboard: React.FC = () => {
  const { currentTrip, setActiveTab } = useApp()

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trip selected</h3>
        <p className="mt-1 text-sm text-gray-500">Create a new trip to get started.</p>
        <div className="mt-6">
          <Button onClick={() => setActiveTab('trips')} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>View My Trips</span>
          </Button>
        </div>
      </div>
    )
  }

  const totalDays = currentTrip.destinations.reduce((total, dest) => {
    return total + getDaysBetween(dest.startDate, dest.endDate)
  }, 0)

  const totalAttractions = currentTrip.destinations.reduce((total, dest) => {
    return total + (dest.attractions?.length || 0)
  }, 0)

  const totalRestaurants = currentTrip.destinations.reduce((total, dest) => {
    return total + (dest.restaurants?.length || 0)
  }, 0)

  const totalExcursions = currentTrip.destinations.reduce((total, dest) => {
    return total + (dest.customExcursions?.length || 0)
  }, 0)

  const plannedAttractions = currentTrip.destinations.reduce((total, dest) => {
    return total + (dest.attractions?.filter(attr => attr.isPlanned).length || 0)
  }, 0)

  const savedRestaurants = currentTrip.destinations.reduce((total, dest) => {
    return total + (dest.restaurants?.filter(rest => rest.isBookmarked).length || 0)
  }, 0)

  const stats = [
    {
      name: 'Destinations',
      value: currentTrip.destinations.length,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Days',
      value: totalDays,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Planned Attractions',
      value: plannedAttractions,
      icon: Camera,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Saved Restaurants',
      value: savedRestaurants,
      icon: Utensils,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Trip Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Destinations Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Destinations</h2>
        {currentTrip.destinations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No destinations added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentTrip.destinations.map((destination, index) => (
              <div key={destination.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">
                    {destination.city}, {destination.country}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDateRange(destination.startDate, destination.endDate)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {getDaysBetween(destination.startDate, destination.endDate)} days
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Planned Attractions */}
      {plannedAttractions > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Planned Attractions</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('attractions')}
              className="flex items-center space-x-1"
            >
              <Camera className="h-4 w-4" />
              <span>View All</span>
            </Button>
          </div>
          <div className="space-y-3">
            {currentTrip.destinations.map(destination => {
              const plannedAttractions = destination.attractions?.filter(attr => attr.isPlanned) || []
              if (plannedAttractions.length === 0) return null
              
              return (
                <div key={destination.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {destination.city}, {destination.country}
                  </h3>
                  <div className="space-y-2">
                    {plannedAttractions.slice(0, 3).map(attraction => (
                      <div key={attraction.id} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{attraction.name}</span>
                        {attraction.rating && (
                          <div className="flex items-center space-x-1 ml-auto">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{attraction.rating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {plannedAttractions.length > 3 && (
                      <p className="text-xs text-gray-500 ml-7">
                        +{plannedAttractions.length - 3} more planned attractions
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Saved Restaurants */}
      {savedRestaurants > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Saved Restaurants</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('restaurants')}
              className="flex items-center space-x-1"
            >
              <Utensils className="h-4 w-4" />
              <span>View All</span>
            </Button>
          </div>
          <div className="space-y-3">
            {currentTrip.destinations.map(destination => {
              const savedRestaurants = destination.restaurants?.filter(rest => rest.isBookmarked) || []
              if (savedRestaurants.length === 0) return null
              
              return (
                <div key={destination.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {destination.city}, {destination.country}
                  </h3>
                  <div className="space-y-2">
                    {savedRestaurants.slice(0, 3).map(restaurant => (
                      <div key={restaurant.id} className="flex items-center space-x-3">
                        <Heart className="h-4 w-4 text-red-600 fill-current flex-shrink-0" />
                        <span className="text-sm text-gray-700">{restaurant.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">{restaurant.cuisine}</span>
                        {restaurant.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{restaurant.rating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {savedRestaurants.length > 3 && (
                      <p className="text-xs text-gray-500 ml-7">
                        +{savedRestaurants.length - 3} more saved restaurants
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State for No Saved Items */}
      {plannedAttractions === 0 && savedRestaurants === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <div className="flex justify-center space-x-4 mb-4">
              <Camera className="h-8 w-8 text-gray-400" />
              <Utensils className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Planning Your Trip</h3>
            <p className="text-gray-500 mb-4">
              Save restaurants and plan attractions to see them here on your dashboard.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setActiveTab('attractions')}
                className="flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Find Attractions</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('restaurants')}
                className="flex items-center space-x-2"
              >
                <Utensils className="h-4 w-4" />
                <span>Find Restaurants</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { Dashboard }
