import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useApp } from '@/context/AppContext'

interface TripFormProps {
  isOpen: boolean
  onClose: () => void
}

const TripForm: React.FC<TripFormProps> = ({ isOpen, onClose }) => {
  const [tripName, setTripName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { createNewTrip } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tripName.trim()) return

    setIsLoading(true)
    try {
      createNewTrip(tripName.trim())
      setTripName('')
      onClose()
    } catch (error) {
      console.error('Error creating trip:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTripName('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Trip"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Trip Name"
          placeholder="e.g., Summer Europe Adventure"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          required
          autoFocus
        />
        
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
            disabled={!tripName.trim()}
          >
            Create Trip
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { TripForm }
