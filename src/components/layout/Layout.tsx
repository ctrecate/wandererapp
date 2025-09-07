import React from 'react'
import { Header } from './Header'
import { Navigation } from './Navigation'
import { useApp } from '@/context/AppContext'

interface LayoutProps {
  children: React.ReactNode
  onCreateTrip: () => void
}

const Layout: React.FC<LayoutProps> = ({ children, onCreateTrip }) => {
  const { currentTrip } = useApp()

  return (
    <div className="min-h-screen bg-background">
      <Header onCreateTrip={onCreateTrip} />
      {currentTrip && <Navigation />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}

export { Layout }
