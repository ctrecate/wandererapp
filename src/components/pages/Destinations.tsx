import React, { useState } from 'react'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DestinationForm } from '@/components/forms/DestinationForm'
import { useApp } from '@/context/AppContext'
import { Destination } from '@/types'
import { formatDateRange, getDaysBetween } from '@/lib/utils'

const Destinations: React.FC = () => {
  const { currentTrip, saveTrip } = useApp()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | undefined>()

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trip selected</h3>
        <p className="mt-1 text-sm text-gray-500">Create a trip first to manage destinations.</p>
      </div>
    )
  }

  const handleAddDestination = () => {
    setEditingDestination(undefined)
    setIsFormOpen(true)
  }

  const handleEditDestination = (destination: Destination) => {
    setEditingDestination(destination)
    setIsFormOpen(true)
  }

  const handleSaveDestination = (destination: Destination) => {
    const updatedDestinations = editingDestination
      ? currentTrip.destinations.map(dest => 
          dest.id === destination.id ? destination : dest
        )
      : [...currentTrip.destinations, destination]

    const updatedTrip = {
      ...currentTrip,
      destinations: updatedDestinations
    }

    saveTrip(updatedTrip)
  }

  const handleDeleteDestination = (destinationId: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      const updatedDestinations = currentTrip.destinations.filter(
        dest => dest.id !== destinationId
      )

      const updatedTrip = {
        ...currentTrip,
        destinations: updatedDestinations
      }

      saveTrip(updatedTrip)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingDestination(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-600">Manage your trip destinations and dates</p>
        </div>
        <Button onClick={handleAddDestination} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Destination</span>
        </Button>
      </div>

      {/* Destinations List */}
      {currentTrip.destinations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first destination.</p>
          <div className="mt-6">
            <Button onClick={handleAddDestination}>
              Add Your First Destination
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {currentTrip.destinations.map((destination, index) => (
            <div key={destination.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {destination.city}, {destination.country}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateRange(destination.startDate, destination.endDate)}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{getDaysBetween(destination.startDate, destination.endDate)} days</span>
                      <span>•</span>
                      <span>{destination.attractions?.length || 0} attractions</span>
                      <span>•</span>
                      <span>{destination.restaurants?.length || 0} restaurants</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDestination(destination)}
                    className="p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDestination(destination.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Form Modal */}
      <DestinationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        destination={editingDestination}
        onSave={handleSaveDestination}
      />
    </div>
  )
}

export { Destinations }
