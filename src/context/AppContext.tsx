'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Trip, AppState, TabType } from '@/types'
import { useAuth } from './AuthContext'

interface AppContextType extends AppState {
  setCurrentTrip: (trip: Trip | null) => void
  setActiveTab: (tab: TabType) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  saveTrip: (trip: Trip) => void
  loadTrip: (tripId: string) => void
  createNewTrip: (name: string) => void
  getAllTrips: () => Trip[]
  deleteTrip: (tripId: string) => void
}

type AppAction =
  | { type: 'SET_CURRENT_TRIP'; payload: Trip | null }
  | { type: 'SET_ACTIVE_TAB'; payload: TabType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SAVE_TRIP'; payload: Trip }

const initialState: AppState = {
  currentTrip: null,
  activeTab: 'dashboard',
  isLoading: false,
  error: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_TRIP':
      return { ...state, currentTrip: action.payload }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SAVE_TRIP':
      return { ...state, currentTrip: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { user } = useAuth()

  // Load saved trip on mount or when user changes
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET_CURRENT_TRIP', payload: null })
      return
    }

    const savedTripId = localStorage.getItem(`currentTripId_${user.id}`)
    if (savedTripId) {
      const savedTrip = localStorage.getItem(`trip_${user.id}_${savedTripId}`)
      if (savedTrip) {
        try {
          const trip = JSON.parse(savedTrip)
          // Convert date strings back to Date objects
          trip.createdAt = new Date(trip.createdAt)
          trip.updatedAt = new Date(trip.updatedAt)
          trip.destinations = trip.destinations.map((dest: any) => ({
            ...dest,
            startDate: new Date(dest.startDate),
            endDate: new Date(dest.endDate),
            customExcursions: dest.customExcursions?.map((exc: any) => ({
              ...exc,
              date: new Date(exc.date)
            })) || []
          }))
          dispatch({ type: 'SET_CURRENT_TRIP', payload: trip })
        } catch (error) {
          console.error('Error loading saved trip:', error)
          localStorage.removeItem(`currentTripId_${user.id}`)
        }
      }
    }
  }, [user])

  const setCurrentTrip = (trip: Trip | null) => {
    dispatch({ type: 'SET_CURRENT_TRIP', payload: trip })
  }

  const setActiveTab = (tab: TabType) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const saveTrip = (trip: Trip) => {
    if (!user) return
    
    const updatedTrip = {
      ...trip,
      updatedAt: new Date()
    }
    localStorage.setItem(`trip_${user.id}_${trip.id}`, JSON.stringify(updatedTrip))
    localStorage.setItem(`currentTripId_${user.id}`, trip.id)
    dispatch({ type: 'SAVE_TRIP', payload: updatedTrip })
  }

  const loadTrip = (tripId: string) => {
    if (!user) return
    
    const savedTrip = localStorage.getItem(`trip_${user.id}_${tripId}`)
    if (savedTrip) {
      try {
        const trip = JSON.parse(savedTrip)
        // Convert date strings back to Date objects
        trip.createdAt = new Date(trip.createdAt)
        trip.updatedAt = new Date(trip.updatedAt)
        trip.destinations = trip.destinations.map((dest: any) => ({
          ...dest,
          startDate: new Date(dest.startDate),
          endDate: new Date(dest.endDate),
          customExcursions: dest.customExcursions?.map((exc: any) => ({
            ...exc,
            date: new Date(exc.date)
          })) || []
        }))
        dispatch({ type: 'SET_CURRENT_TRIP', payload: trip })
        localStorage.setItem(`currentTripId_${user.id}`, tripId)
      } catch (error) {
        console.error('Error loading trip:', error)
        setError('Failed to load trip')
      }
    }
  }

  const createNewTrip = (name: string) => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      name,
      destinations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    saveTrip(newTrip)
  }

  const getAllTrips = (): Trip[] => {
    if (!user) return []
    
    const trips: Trip[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`trip_${user.id}_`)) {
        try {
          const tripData = localStorage.getItem(key)
          if (tripData) {
            const trip = JSON.parse(tripData)
            // Convert date strings back to Date objects
            trip.createdAt = new Date(trip.createdAt)
            trip.updatedAt = new Date(trip.updatedAt)
            trip.destinations = trip.destinations.map((dest: any) => ({
              ...dest,
              startDate: new Date(dest.startDate),
              endDate: new Date(dest.endDate),
              customExcursions: dest.customExcursions?.map((exc: any) => ({
                ...exc,
                date: new Date(exc.date)
              })) || []
            }))
            trips.push(trip)
          }
        } catch (error) {
          console.error('Error parsing trip:', key, error)
        }
      }
    }
    return trips.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  const deleteTrip = (tripId: string) => {
    if (!user) return
    
    localStorage.removeItem(`trip_${user.id}_${tripId}`)
    if (state.currentTrip?.id === tripId) {
      setCurrentTrip(null)
      localStorage.removeItem(`currentTripId_${user.id}`)
    }
  }

  const value: AppContextType = {
    ...state,
    setCurrentTrip,
    setActiveTab,
    setLoading,
    setError,
    saveTrip,
    loadTrip,
    createNewTrip,
    getAllTrips,
    deleteTrip,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
