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
}

// Fetch restaurants from Google Places API
export async function fetchRestaurantsFromAPI(city: string, country: string): Promise<Restaurant[]> {
  console.log('Google Places API Key:', GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing')
  
  if (GOOGLE_PLACES_API_KEY === 'demo-key' || !GOOGLE_PLACES_API_KEY) {
    console.log('Using mock data - no valid API key')
    return getMockRestaurantsForCity(city)
  }

  try {
    const query = `restaurants in ${city}, ${country}`
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
    
    console.log('Fetching restaurants from Google Places API for:', city, country)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Google Places API response not OK:', response.status, response.statusText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: GooglePlacesResponse = await response.json()
    
    console.log('Google Places API response:', data.status, data.results?.length, 'results')
    
    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status)
      throw new Error(`Google Places API error: ${data.status}`)
    }

    if (!data.results || data.results.length === 0) {
      console.log('No restaurants found, using fallback data')
      return getMockRestaurantsForCity(city)
    }

    return data.results.slice(0, 10).map(place => ({
      id: place.place_id,
      name: place.name,
      cuisine: getCuisineFromTypes(place.types),
      priceRange: place.price_level ? place.price_level + 1 : 2,
      rating: place.rating || 4.0,
      mustTryDishes: getDefaultDishesForCuisine(getCuisineFromTypes(place.types)),
      address: place.formatted_address || place.vicinity,
      phone: undefined, // Would need additional API call
      openingHours: place.opening_hours?.weekday_text?.join(', ') || 'Hours not available',
      isBookmarked: false
    }))
  } catch (error) {
    console.error('Error fetching restaurants from Google Places API:', error)
    console.log('Falling back to mock data for:', city)
    return getMockRestaurantsForCity(city)
  }
}

// Fetch attractions from Google Places API
export async function fetchAttractionsFromAPI(city: string, country: string): Promise<Attraction[]> {
  console.log('Google Places API Key for attractions:', GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing')
  
  if (GOOGLE_PLACES_API_KEY === 'demo-key' || !GOOGLE_PLACES_API_KEY) {
    console.log('Using mock data for attractions - no valid API key')
    return getMockAttractionsForCity(city)
  }

  try {
    const query = `tourist attractions in ${city}, ${country}`
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=tourist_attraction&key=${GOOGLE_PLACES_API_KEY}`
    
    console.log('Fetching attractions from Google Places API for:', city, country)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Google Places API response not OK:', response.status, response.statusText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: GooglePlacesResponse = await response.json()
    
    console.log('Google Places API response:', data.status, data.results?.length, 'results')
    
    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status)
      throw new Error(`Google Places API error: ${data.status}`)
    }

    if (!data.results || data.results.length === 0) {
      console.log('No attractions found, using fallback data')
      return getMockAttractionsForCity(city)
    }

    return data.results.slice(0, 10).map(place => ({
      id: place.place_id,
      name: place.name,
      description: `Popular tourist attraction in ${city}`,
      category: getCategoryFromTypes(place.types),
      openingHours: place.opening_hours?.weekday_text?.join(', ') || 'Hours vary',
      cost: 'Varies',
      duration: '1-3 hours',
      howToGetThere: `Located at ${place.vicinity}`,
      rating: place.rating || 4.0,
      imageUrl: place.photos?.[0] ? 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}` :
        undefined
    }))
  } catch (error) {
    console.error('Error fetching attractions from Google Places API:', error)
    console.log('Falling back to mock data for:', city)
    return getMockAttractionsForCity(city)
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

// Fallback mock data for cities without API data
function getMockRestaurantsForCity(city: string): Restaurant[] {
  return [
    {
      id: `local-1-${city}`,
      name: `${city} Central Restaurant`,
      cuisine: 'Local',
      priceRange: 2,
      rating: 4.2,
      mustTryDishes: ['Local specialty', 'Traditional dish', 'Regional favorite'],
      address: `City Center, ${city}`,
      phone: '+1 (555) 123-4567',
      openingHours: '11:00 AM - 10:00 PM',
      isBookmarked: false
    },
    {
      id: `local-2-${city}`,
      name: 'International Bistro',
      cuisine: 'International',
      priceRange: 3,
      rating: 4.4,
      mustTryDishes: ['Chef\'s special', 'Signature dish', 'Popular choice'],
      address: `Downtown District, ${city}`,
      phone: '+1 (555) 987-6543',
      openingHours: '12:00 PM - 11:00 PM',
      isBookmarked: false
    },
    {
      id: `local-3-${city}`,
      name: 'Café Corner',
      cuisine: 'Cafe',
      priceRange: 1,
      rating: 4.1,
      mustTryDishes: ['Coffee', 'Pastries', 'Light meals'],
      address: `Main Street, ${city}`,
      phone: '+1 (555) 456-7890',
      openingHours: '7:00 AM - 6:00 PM',
      isBookmarked: false
    }
  ]
}

function getMockAttractionsForCity(city: string): Attraction[] {
  return [
    {
      id: `attraction-1-${city}`,
      name: `${city} City Center`,
      description: `The heart of ${city} with beautiful architecture and local culture.`,
      category: 'Landmark',
      openingHours: '24/7',
      cost: 'Free',
      duration: '1-2 hours',
      howToGetThere: 'Located in the city center, accessible by public transport',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'
    },
    {
      id: `attraction-2-${city}`,
      name: `${city} History Museum`,
      description: `Discover the rich history and culture of ${city} and the surrounding region.`,
      category: 'Museum',
      openingHours: '10:00 AM - 6:00 PM (closed Mondays)',
      cost: '$10-15',
      duration: '2-3 hours',
      howToGetThere: 'Metro: City Center Station, Bus: Route 5',
      rating: 4.1,
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
    },
    {
      id: `attraction-3-${city}`,
      name: `${city} Central Park`,
      description: `A beautiful urban park perfect for relaxation and outdoor activities.`,
      category: 'Park',
      openingHours: '6:00 AM - 10:00 PM',
      cost: 'Free',
      duration: '1-3 hours',
      howToGetThere: 'Located in the city center, multiple entrances',
      rating: 4.2,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
    }
  ]
}
