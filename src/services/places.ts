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

// Fetch restaurants from Google Places API
export async function fetchRestaurantsFromAPI(city: string, country: string): Promise<Restaurant[]> {
  console.log('Google Places API Key:', GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing')
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.log('Using mock data - no valid API key')
    return getMockRestaurantsForCity(city)
  }

  try {
    // Use Google Places API with proper error handling
    const queries = [
      `restaurants in ${city}, ${country}`,
      `restaurants ${city}`,
      `food ${city}, ${country}`,
      `dining ${city}`
    ]
    
    for (const query of queries) {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
      
      console.log('🌐 Trying Google Places API URL:', url)
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
        })

        console.log('📡 Response status:', response.status, response.statusText)

        if (!response.ok) {
          console.log('❌ HTTP Error:', response.status, response.statusText)
          continue
        }

        const data: GooglePlacesResponse = await response.json()
        console.log('📊 Google Places API response:', data)
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          console.log(`✅ Found ${data.results.length} restaurants from Google Places API`)
          return data.results.slice(0, 10).map(place => ({
            id: place.place_id,
            name: place.name,
            cuisine: getCuisineFromTypes(place.types),
            priceRange: place.price_level ? place.price_level + 1 : 2,
            rating: place.rating || 4.0,
            mustTryDishes: getDefaultDishesForCuisine(getCuisineFromTypes(place.types)),
            address: place.formatted_address || place.vicinity,
            phone: undefined,
            openingHours: place.opening_hours?.weekday_text?.join(', ') || 'Hours not available',
            isBookmarked: false
          }))
        } else {
          console.log('⚠️ No results for query:', query, 'Status:', data.status, 'Error:', data.error_message)
        }
      } catch (fetchError) {
        console.log('❌ Fetch error for query:', query, fetchError)
        continue
      }
    }
    
    console.log('❌ All restaurant queries failed, using enhanced mock data')
    return getEnhancedMockRestaurantsForCity(city, country)
    
  } catch (error) {
    console.error('💥 Error fetching restaurants from Google Places API:', error)
    console.log('🔄 Falling back to enhanced mock data for:', city)
    return getEnhancedMockRestaurantsForCity(city, country)
  }
}

// Fetch attractions from Google Places API
export async function fetchAttractionsFromAPI(city: string, country: string): Promise<Attraction[]> {
  console.log('Google Places API Key for attractions:', GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing')
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.log('Using mock data for attractions - no valid API key')
    return getMockAttractionsForCity(city)
  }

  try {
    // Use Google Places API with proper error handling
    const queries = [
      `tourist attractions in ${city}, ${country}`,
      `attractions ${city}`,
      `landmarks ${city}, ${country}`,
      `sights ${city}`
    ]
    
    for (const query of queries) {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=tourist_attraction&key=${GOOGLE_PLACES_API_KEY}`
      
      console.log('🌐 Trying Google Places API URL for attractions:', url)
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
        })

        console.log('📡 Attractions response status:', response.status, response.statusText)

        if (!response.ok) {
          console.log('❌ HTTP Error for attractions:', response.status, response.statusText)
          continue
        }

        const data: GooglePlacesResponse = await response.json()
        console.log('📊 Google Places API attractions response:', data)
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          console.log(`✅ Found ${data.results.length} attractions from Google Places API`)
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
        } else {
          console.log('⚠️ No attraction results for query:', query, 'Status:', data.status, 'Error:', data.error_message)
        }
      } catch (fetchError) {
        console.log('❌ Fetch error for attractions query:', query, fetchError)
        continue
      }
    }
    
    console.log('❌ All attraction queries failed, using enhanced mock data')
    return getEnhancedMockAttractionsForCity(city, country)
    
  } catch (error) {
    console.error('💥 Error fetching attractions from Google Places API:', error)
    console.log('🔄 Falling back to enhanced mock data for:', city)
    return getEnhancedMockAttractionsForCity(city, country)
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

// Enhanced mock data for cities without API data
function getEnhancedMockRestaurantsForCity(city: string, country: string): Restaurant[] {
  const cityLower = city.toLowerCase()
  const countryLower = country.toLowerCase()
  
  // City-specific restaurant data
  const cityRestaurants: Record<string, Restaurant[]> = {
    'barcelona': [
      {
        id: 'barcelona-1',
        name: 'Casa Lolea',
        cuisine: 'Spanish',
        priceRange: 3,
        rating: 4.5,
        mustTryDishes: ['Paella Valenciana', 'Jamón Ibérico', 'Sangría'],
        address: 'Carrer de Sant Pere Més Alt, 49, 08003 Barcelona',
        phone: '+34 933 19 88 81',
        openingHours: '1:00 PM - 4:00 PM, 8:00 PM - 11:30 PM',
        isBookmarked: false
      },
      {
        id: 'barcelona-2',
        name: 'El Nacional',
        cuisine: 'Spanish',
        priceRange: 2,
        rating: 4.3,
        mustTryDishes: ['Tapas', 'Seafood', 'Local wines'],
        address: 'Passeig de Gràcia, 24, 08007 Barcelona',
        phone: '+34 935 18 50 53',
        openingHours: '12:00 PM - 1:00 AM',
        isBookmarked: false
      }
    ],
    'tokyo': [
      {
        id: 'tokyo-1',
        name: 'Sukiyabashi Jiro',
        cuisine: 'Japanese',
        priceRange: 4,
        rating: 4.8,
        mustTryDishes: ['Sushi Omakase', 'Tuna', 'Sea urchin'],
        address: 'Tsukamoto Sogyo Building, 2-15-2 Ginza, Chuo City, Tokyo',
        phone: '+81 3-3535-3600',
        openingHours: '11:30 AM - 2:00 PM, 5:00 PM - 8:30 PM',
        isBookmarked: false
      },
      {
        id: 'tokyo-2',
        name: 'Ramen Nagi',
        cuisine: 'Japanese',
        priceRange: 1,
        rating: 4.4,
        mustTryDishes: ['Tonkotsu Ramen', 'Gyoza', 'Karaage'],
        address: 'Multiple locations in Tokyo',
        phone: '+81 3-1234-5678',
        openingHours: '11:00 AM - 2:00 AM',
        isBookmarked: false
      }
    ],
    'mumbai': [
      {
        id: 'mumbai-1',
        name: 'Trishna',
        cuisine: 'Indian',
        priceRange: 2,
        rating: 4.6,
        mustTryDishes: ['Butter Chicken', 'Biryani', 'Naan'],
        address: '7 Sai Baba Marg, Kala Ghoda, Fort, Mumbai',
        phone: '+91 22 2270 3213',
        openingHours: '12:00 PM - 3:30 PM, 6:30 PM - 11:30 PM',
        isBookmarked: false
      },
      {
        id: 'mumbai-2',
        name: 'Leopold Cafe',
        cuisine: 'Indian',
        priceRange: 2,
        rating: 4.2,
        mustTryDishes: ['Chicken Tikka', 'Dal Makhani', 'Lassi'],
        address: 'Colaba Causeway, Colaba, Mumbai',
        phone: '+91 22 2282 8185',
        openingHours: '7:30 AM - 12:00 AM',
        isBookmarked: false
      }
    ]
  }
  
  // Return city-specific data if available, otherwise generic data
  if (cityRestaurants[cityLower]) {
    return cityRestaurants[cityLower]
  }
  
  // Generic fallback
  return [
    {
      id: `local-1-${city}`,
      name: `${city} Central Restaurant`,
      cuisine: 'Local',
      priceRange: 2,
      rating: 4.2,
      mustTryDishes: ['Local specialty', 'Traditional dish', 'Regional favorite'],
      address: `City Center, ${city}, ${country}`,
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
      address: `Downtown District, ${city}, ${country}`,
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
      address: `Main Street, ${city}, ${country}`,
      phone: '+1 (555) 456-7890',
      openingHours: '7:00 AM - 6:00 PM',
      isBookmarked: false
    }
  ]
}

// Fallback mock data for cities without API data
function getMockRestaurantsForCity(city: string): Restaurant[] {
  return getEnhancedMockRestaurantsForCity(city, '')
}

// Enhanced mock data for attractions
function getEnhancedMockAttractionsForCity(city: string, country: string): Attraction[] {
  const cityLower = city.toLowerCase()
  
  // City-specific attraction data
  const cityAttractions: Record<string, Attraction[]> = {
    'barcelona': [
      {
        id: 'barcelona-attraction-1',
        name: 'Sagrada Família',
        description: 'Antoni Gaudí\'s unfinished masterpiece, a stunning basilica with unique architecture.',
        category: 'Religious Site',
        openingHours: '9:00 AM - 6:00 PM (varies by season)',
        cost: '€26-32',
        duration: '2-3 hours',
        howToGetThere: 'Metro: Sagrada Família (L2, L5)',
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400'
      },
      {
        id: 'barcelona-attraction-2',
        name: 'Park Güell',
        description: 'Gaudí\'s colorful park with mosaic sculptures and city views.',
        category: 'Park',
        openingHours: '8:00 AM - 9:30 PM',
        cost: '€10',
        duration: '2-4 hours',
        howToGetThere: 'Metro: Lesseps (L3), then bus 24',
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
      },
      {
        id: 'barcelona-attraction-3',
        name: 'Casa Batlló',
        description: 'Gaudí\'s architectural masterpiece with organic shapes and colorful facade.',
        category: 'Museum',
        openingHours: '9:00 AM - 8:00 PM',
        cost: '€35',
        duration: '1-2 hours',
        howToGetThere: 'Metro: Passeig de Gràcia (L2, L3, L4)',
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
      }
    ],
    'tokyo': [
      {
        id: 'tokyo-attraction-1',
        name: 'Senso-ji Temple',
        description: 'Tokyo\'s oldest temple, a beautiful Buddhist temple in Asakusa.',
        category: 'Religious Site',
        openingHours: '6:00 AM - 5:00 PM',
        cost: 'Free',
        duration: '1-2 hours',
        howToGetThere: 'Metro: Asakusa (G19, Z18)',
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1542640244-a10b6e5d1e2a?w=400'
      },
      {
        id: 'tokyo-attraction-2',
        name: 'Tokyo Skytree',
        description: 'The tallest structure in Japan with panoramic city views.',
        category: 'Landmark',
        openingHours: '8:00 AM - 10:00 PM',
        cost: '¥2,100-3,100',
        duration: '2-3 hours',
        howToGetThere: 'Metro: Tokyo Skytree (Z14)',
        rating: 4.2,
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400'
      },
      {
        id: 'tokyo-attraction-3',
        name: 'Meiji Shrine',
        description: 'A peaceful Shinto shrine surrounded by forest in the heart of Tokyo.',
        category: 'Religious Site',
        openingHours: '6:40 AM - 4:20 PM (varies by season)',
        cost: 'Free',
        duration: '1-2 hours',
        howToGetThere: 'Metro: Harajuku (C03) or Meiji-jingumae (C03, F15)',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1542640244-a10b6e5d1e2a?w=400'
      }
    ],
    'mumbai': [
      {
        id: 'mumbai-attraction-1',
        name: 'Gateway of India',
        description: 'Iconic arch monument overlooking the Arabian Sea.',
        category: 'Landmark',
        openingHours: '24/7',
        cost: 'Free',
        duration: '30 minutes - 1 hour',
        howToGetThere: 'Local train: CST, Bus: Multiple routes',
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
      },
      {
        id: 'mumbai-attraction-2',
        name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
        description: 'Formerly Prince of Wales Museum, showcasing Indian art and history.',
        category: 'Museum',
        openingHours: '10:15 AM - 6:00 PM (closed Mondays)',
        cost: '₹70-100',
        duration: '2-3 hours',
        howToGetThere: 'Local train: Churchgate, Bus: Route 1, 2, 3',
        rating: 4.2,
        imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
      },
      {
        id: 'mumbai-attraction-3',
        name: 'Marine Drive',
        description: 'Famous 3.6km promenade along the Arabian Sea coastline.',
        category: 'Landmark',
        openingHours: '24/7',
        cost: 'Free',
        duration: '1-2 hours',
        howToGetThere: 'Local train: Marine Lines, Bus: Multiple routes',
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
      }
    ]
  }
  
  // Return city-specific data if available, otherwise generic data
  if (cityAttractions[cityLower]) {
    return cityAttractions[cityLower]
  }
  
  // Generic fallback
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

function getMockAttractionsForCity(city: string): Attraction[] {
  return getEnhancedMockAttractionsForCity(city, '')
}
