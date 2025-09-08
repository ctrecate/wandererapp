import React, { useState } from 'react'
import { Plus, MapPin, Calendar, Camera, Utensils, Trash2, Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TripForm } from '@/components/forms/TripForm'
import { useApp } from '@/context/AppContext'
import { formatDateRange, getDaysBetween } from '@/lib/utils'
import type { Trip } from '@/types'

const TripsOverview: React.FC = () => {
  const { getAllTrips, loadTrip, deleteTrip, setActiveTab, currentTrip } = useApp()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [trips, setTrips] = useState<Trip[]>(getAllTrips())

  const refreshTrips = () => {
    setTrips(getAllTrips())
  }

  const handleCreateTrip = () => {
    setIsFormOpen(true)
  }

  const handleTripCreated = () => {
    setIsFormOpen(false)
    refreshTrips()
  }

  const handleLoadTrip = (trip: Trip) => {
    loadTrip(trip.id)
    setActiveTab('dashboard')
  }

  const handleDeleteTrip = (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      deleteTrip(tripId)
      refreshTrips()
    }
  }

  const getTripStats = (trip: Trip) => {
    const totalDays = trip.destinations.reduce((total, dest) => {
      return total + getDaysBetween(dest.startDate, dest.endDate)
    }, 0)

    const totalAttractions = trip.destinations.reduce((total, dest) => {
      return total + (dest.attractions?.length || 0)
    }, 0)

    const totalRestaurants = trip.destinations.reduce((total, dest) => {
      return total + (dest.restaurants?.length || 0)
    }, 0)

    const plannedAttractions = trip.destinations.reduce((total, dest) => {
      return total + (dest.attractions?.filter(attr => attr.isPlanned).length || 0)
    }, 0)

    const savedRestaurants = trip.destinations.reduce((total, dest) => {
      return total + (dest.restaurants?.filter(rest => rest.isBookmarked).length || 0)
    }, 0)

    return {
      totalDays,
      totalAttractions,
      totalRestaurants,
      plannedAttractions,
      savedRestaurants
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600">Manage and view all your travel plans</p>
        </div>
        <Button onClick={handleCreateTrip} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Trip</span>
        </Button>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trips yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first trip to get started with travel planning.</p>
          <div className="mt-6">
            <Button onClick={handleCreateTrip} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Your First Trip</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const stats = getTripStats(trip)
            const isCurrentTrip = currentTrip?.id === trip.id

            return (
              <div key={trip.id} className={`bg-white rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
                isCurrentTrip ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                {/* Trip Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{trip.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created {trip.createdAt.toLocaleDateString()}
                    </p>
                    {isCurrentTrip && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Current Trip
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadTrip(trip)}
                      className="p-1"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Trip Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-500">Destinations</p>
                    <p className="text-sm font-semibold text-gray-900">{trip.destinations.length}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500">Total Days</p>
                    <p className="text-sm font-semibold text-gray-900">{stats.totalDays}</p>
                  </div>
                </div>

                {/* Saved Items */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Camera className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-600">Planned Attractions</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats.plannedAttractions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Utensils className="h-4 w-4 text-orange-600" />
                      <span className="text-gray-600">Saved Restaurants</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats.savedRestaurants}</span>
                  </div>
                </div>

                {/* Destinations Preview */}
                {trip.destinations.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Destinations:</p>
                    <div className="space-y-1">
                      {trip.destinations.slice(0, 2).map((destination) => (
                        <div key={destination.id} className="text-sm text-gray-600">
                          {destination.city}, {destination.country}
                        </div>
                      ))}
                      {trip.destinations.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{trip.destinations.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => handleLoadTrip(trip)}
                  variant={isCurrentTrip ? "secondary" : "outline"}
                  className="w-full"
                >
                  {isCurrentTrip ? 'Continue Planning' : 'Open Trip'}
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* Trip Form Modal */}
      <TripForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onTripCreated={handleTripCreated}
      />
    </div>
  )
}

export { TripsOverview }
