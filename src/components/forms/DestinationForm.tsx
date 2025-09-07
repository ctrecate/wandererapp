import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useApp } from '@/context/AppContext'
import { Destination } from '@/types'
import { generateId } from '@/lib/utils'

interface DestinationFormProps {
  isOpen: boolean
  onClose: () => void
  destination?: Destination
  onSave: (destination: Destination) => void
}

const DestinationForm: React.FC<DestinationFormProps> = ({ 
  isOpen, 
  onClose, 
  destination,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    city: destination?.city || '',
    country: destination?.country || '',
    startDate: destination?.startDate ? destination.startDate.toISOString().split('T')[0] : '',
    endDate: destination?.endDate ? destination.endDate.toISOString().split('T')[0] : '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (start >= end) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const destinationData: Destination = {
        id: destination?.id || generateId(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        attractions: destination?.attractions || [],
        restaurants: destination?.restaurants || [],
        customExcursions: destination?.customExcursions || [],
      }

      onSave(destinationData)
      handleClose()
    } catch (error) {
      console.error('Error saving destination:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      city: '',
      country: '',
      startDate: '',
      endDate: '',
    })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={destination ? 'Edit Destination' : 'Add Destination'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            placeholder="e.g., Paris"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            error={errors.city}
            required
          />
          <Input
            label="Country"
            placeholder="e.g., France"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            error={errors.country}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            error={errors.startDate}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            error={errors.endDate}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {destination ? 'Update' : 'Add'} Destination
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { DestinationForm }
