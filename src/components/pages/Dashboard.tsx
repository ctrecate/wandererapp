import React from 'react'
import { MapPin, Calendar, Cloud, Camera, Bus, Utensils } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { formatDateRange, getDaysBetween } from '@/lib/utils'
import type { Destination } from '@/types'

const Dashboard: React.FC = () => {
  const { currentTrip } = useApp()

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trip selected</h3>
        <p className="mt-1 text-sm text-gray-500">Create a new trip to get started.</p>
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
      name: 'Attractions',
      value: totalAttractions,
      icon: Camera,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Restaurants',
      value: totalRestaurants,
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Cloud className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Check Weather</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Camera className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Find Attractions</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Bus className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Transport Info</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Utensils className="h-6 w-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Find Restaurants</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export { Dashboard }
