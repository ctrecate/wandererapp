import React from 'react'
import { MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'

interface HeaderProps {
  onCreateTrip: () => void
}

const Header: React.FC<HeaderProps> = ({ onCreateTrip }) => {
  const { currentTrip } = useApp()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Wanderer</h1>
              {currentTrip && (
                <p className="text-sm text-gray-600">{currentTrip.name}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {!currentTrip && (
              <Button
                onClick={onCreateTrip}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Trip</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }
