import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = 'AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const country = searchParams.get('country')

    if (!city || !country) {
      return NextResponse.json({ error: 'City and country are required' }, { status: 400 })
    }

    console.log('🍽️ Server: Fetching restaurants for', city, country)

    // Try multiple query formats
    const queries = [
      `restaurants in ${city}, ${country}`,
      `restaurants ${city}`,
      `food ${city}, ${country}`,
      `dining ${city}`
    ]

    for (const query of queries) {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
      
      console.log('🌐 Server: Trying URL:', url)
      
      try {
        const response = await fetch(url)
        console.log('📡 Server: Response status:', response.status)

        if (!response.ok) {
          console.log('❌ Server: HTTP Error:', response.status)
          continue
        }

        const data = await response.json()
        console.log('📊 Server: API response:', data.status, data.results?.length, 'results')

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          console.log(`✅ Server: Found ${data.results.length} restaurants`)
          
          const restaurants = data.results.slice(0, 10).map((place: any) => ({
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

          return NextResponse.json({ restaurants, source: 'google_places_api' })
        } else {
          console.log('⚠️ Server: No results for query:', query, 'Status:', data.status, 'Error:', data.error_message)
        }
      } catch (fetchError) {
        console.log('❌ Server: Fetch error for query:', query, fetchError)
        continue
      }
    }

    console.log('❌ Server: All queries failed, no restaurants found')
    return NextResponse.json({ 
      restaurants: [], 
      source: 'no_results',
      message: `No restaurants found for ${city}, ${country}. Please try a different city or check the spelling.`
    })

  } catch (error) {
    console.error('💥 Server: Error in restaurants API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

