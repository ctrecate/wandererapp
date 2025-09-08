import type { Restaurant, Attraction } from '@/types'

// Use the provided API key directly
const GOOGLE_PLACES_API_KEY = 'AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik'

export interface GooglePlace {
  place_id: string
  name: string
  rating?: number
  price_level?: number
  types: string[]
  vicinity: string
  formatted_address?: string
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  photos?: Array<{
    photo_reference: string
  }>
}

export interface GooglePlacesResponse {
  results: GooglePlace[]
  status: string
  next_page_token?: string
  error_message?: string
}

// Fetch restaurants from our server-side API route
export async function fetchRestaurantsFromAPI(city: string, country: string): Promise<Restaurant[]> {
  console.log('🍽️ Fetching restaurants for:', city, country)
  
  try {
    const url = `/api/places/restaurants?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
    console.log('🌐 Calling server API:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    console.log('📡 Server response status:', response.status, response.statusText)

    if (!response.ok) {
      console.error('❌ Server API error:', response.status, response.statusText)
      throw new Error(`Server API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('📊 Server API response:', data)
    
    if (data.restaurants && data.restaurants.length > 0) {
      console.log(`✅ Found ${data.restaurants.length} restaurants from ${data.source}`)
      return data.restaurants
    } else {
      console.log('❌ No restaurants found for this location')
      console.log('Message:', data.message)
      return []
    }
    
  } catch (error) {
    console.error('💥 Error fetching restaurants from server API:', error)
    console.log('❌ API call failed for:', city)
    return []
  }
}

// Fetch attractions from our server-side API route
export async function fetchAttractionsFromAPI(city: string, country: string): Promise<Attraction[]> {
  console.log('🏛️ Fetching attractions for:', city, country)
  
  try {
    const url = `/api/places/attractions?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
    console.log('🌐 Calling server API:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    console.log('📡 Server response status:', response.status, response.statusText)

    if (!response.ok) {
      console.error('❌ Server API error:', response.status, response.statusText)
      throw new Error(`Server API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('📊 Server API response:', data)
    
    if (data.attractions && data.attractions.length > 0) {
      console.log(`✅ Found ${data.attractions.length} attractions from ${data.source}`)
      return data.attractions
    } else {
      console.log('❌ No attractions found for this location')
      console.log('Message:', data.message)
      return []
    }
    
  } catch (error) {
    console.error('💥 Error fetching attractions from server API:', error)
    console.log('❌ API call failed for:', city)
    return []
  }
}

// Helper functions
function getCuisineFromTypes(types: string[]): string {
  const cuisineMap: Record<string, string> = {
    'restaurant': 'Restaurant',
    'meal_takeaway': 'Takeaway',
    'meal_delivery': 'Delivery',
    'cafe': 'Cafe',
    'bakery': 'Bakery',
    'bar': 'Bar',
    'food': 'Food',
    'establishment': 'Restaurant'
  }

  for (const type of types) {
    if (cuisineMap[type]) {
      return cuisineMap[type]
    }
  }
  return 'Restaurant'
}

function getCategoryFromTypes(types: string[]): string {
  const categoryMap: Record<string, string> = {
    'tourist_attraction': 'Tourist Attraction',
    'museum': 'Museum',
    'park': 'Park',
    'church': 'Religious Site',
    'mosque': 'Religious Site',
    'synagogue': 'Religious Site',
    'hindu_temple': 'Religious Site',
    'shopping_mall': 'Shopping',
    'zoo': 'Zoo',
    'aquarium': 'Aquarium',
    'amusement_park': 'Entertainment',
    'art_gallery': 'Art Gallery'
  }

  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type]
    }
  }
  return 'Attraction'
}

function getDefaultDishesForCuisine(cuisine: string): string[] {
  const dishMap: Record<string, string[]> = {
    'Restaurant': ['House special', 'Chef\'s recommendation', 'Popular choice'],
    'Cafe': ['Coffee', 'Pastries', 'Light meals'],
    'Bar': ['Cocktails', 'Beer selection', 'Bar snacks'],
    'Bakery': ['Fresh bread', 'Pastries', 'Desserts'],
    'Takeaway': ['Popular dishes', 'Local favorites', 'Quick meals']
  }
  
  return dishMap[cuisine] || ['Local specialty', 'House special', 'Popular choice']
}


