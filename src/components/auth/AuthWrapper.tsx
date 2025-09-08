import React, { useState } from 'react'
import { AuthModal } from './AuthModal'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { LogOut, User } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Wanderer</h1>
            <p className="mt-2 text-sm text-gray-600">
              Your personal travel planning companion
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full"
            >
              Get Started
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Create an account to start planning your perfect trips
              </p>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Wanderer</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}

export { AuthWrapper }
