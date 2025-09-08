'use client'

import React, { useState } from 'react'
import { AppProvider, useApp } from '@/context/AppContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { TripForm } from '@/components/forms/TripForm'
import { Dashboard } from '@/components/pages/Dashboard'
import { Destinations } from '@/components/pages/Destinations'
import { Weather } from '@/components/pages/Weather'
import { Attractions } from '@/components/pages/Attractions'
import { Restaurants } from '@/components/pages/Restaurants'
import { Outfits } from '@/components/pages/Outfits'
import { Transportation } from '@/components/pages/Transportation'
import { APITest } from '@/components/debug/APITest'
import { PlacesDebugger } from '@/components/debug/PlacesDebugger'
import { TripsOverview } from '@/components/pages/TripsOverview'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AuthWrapper } from '@/components/auth/AuthWrapper'

function AppContent() {
  const { currentTrip, activeTab, isLoading } = useApp()
  const [isTripFormOpen, setIsTripFormOpen] = useState(false)

  const handleCreateTrip = () => {
    setIsTripFormOpen(true)
  }

  const renderActiveTab = () => {
    if (!currentTrip) {
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Wanderer</h2>
            <p className="text-gray-600 mb-8">
              Plan your perfect trip with weather forecasts, outfit recommendations, and local insights.
            </p>
            <button
              onClick={handleCreateTrip}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Trip
            </button>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'destinations':
        return <Destinations />
      case 'weather':
        return <Weather />
      case 'outfits':
        return <Outfits />
      case 'attractions':
        return <Attractions />
      case 'transportation':
        return <Transportation />
      case 'excursions':
        return <div className="text-center py-12"><p className="text-gray-500">Custom excursions coming soon...</p></div>
      case 'restaurants':
        return <Restaurants />
      case 'api-test':
        return <APITest />
        case 'places-debug':
          return <PlacesDebugger />
        case 'trips':
          return <TripsOverview />
        default:
          return <Dashboard />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your trip..." />
      </div>
    )
  }

  return (
    <>
      <Layout>
        {renderActiveTab()}
      </Layout>
      
      <TripForm
        isOpen={isTripFormOpen}
        onClose={() => setIsTripFormOpen(false)}
      />
    </>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppProvider>
        <AuthWrapper>
          <AppContent />
        </AuthWrapper>
      </AppProvider>
    </AuthProvider>
  )
}
