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
    <>
      {children}
    </>
  )
}

export { AuthWrapper }
