import React from 'react'
import { 
  LayoutDashboard, 
  MapPin, 
  Cloud, 
  Shirt, 
  Camera, 
  Bus, 
  Calendar, 
  Utensils 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import type { TabType } from '@/types'

const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, currentTrip } = useApp()

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'destinations' as TabType, label: 'Destinations', icon: MapPin },
    { id: 'weather' as TabType, label: 'Weather', icon: Cloud },
    { id: 'outfits' as TabType, label: 'Outfits', icon: Shirt },
    { id: 'attractions' as TabType, label: 'Attractions', icon: Camera },
    { id: 'transportation' as TabType, label: 'Transport', icon: Bus },
    { id: 'excursions' as TabType, label: 'Excursions', icon: Calendar },
    { id: 'restaurants' as TabType, label: 'Restaurants', icon: Utensils },
  ]

  if (!currentTrip) return null

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export { Navigation }
