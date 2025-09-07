'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Trip, AppState, TabType } from '@/types'

interface AppContextType extends AppState {
  setCurrentTrip: (trip: Trip | null) => void
  setActiveTab: (tab: TabType) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  saveTrip: (trip: Trip) => void
  loadTrip: (tripId: string) => void
  createNewTrip: (name: string) => void
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

  // Load saved trip on mount
  useEffect(() => {
    const savedTripId = localStorage.getItem('currentTripId')
    if (savedTripId) {
      const savedTrip = localStorage.getItem(`trip_${savedTripId}`)
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
          localStorage.removeItem('currentTripId')
        }
      }
    }
  }, [])

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
    const updatedTrip = {
      ...trip,
      updatedAt: new Date()
    }
    localStorage.setItem(`trip_${trip.id}`, JSON.stringify(updatedTrip))
    localStorage.setItem('currentTripId', trip.id)
    dispatch({ type: 'SAVE_TRIP', payload: updatedTrip })
  }

  const loadTrip = (tripId: string) => {
    const savedTrip = localStorage.getItem(`trip_${tripId}`)
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
        localStorage.setItem('currentTripId', tripId)
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

  const value: AppContextType = {
    ...state,
    setCurrentTrip,
    setActiveTab,
    setLoading,
    setError,
    saveTrip,
    loadTrip,
    createNewTrip,
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
