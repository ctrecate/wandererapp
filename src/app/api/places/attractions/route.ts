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

    console.log('🏛️ Server: Fetching attractions for', city, country)

    // Try multiple query formats
    const queries = [
      `tourist attractions in ${city}, ${country}`,
      `attractions ${city}`,
      `landmarks ${city}, ${country}`,
      `sights ${city}`
    ]

    for (const query of queries) {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=tourist_attraction&key=${GOOGLE_PLACES_API_KEY}`
      
      console.log('🌐 Server: Trying attractions URL:', url)
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; TravelApp/1.0)',
          },
        })
        console.log('📡 Server: Attractions response status:', response.status, response.statusText)

        if (!response.ok) {
          console.log('❌ Server: HTTP Error for attractions:', response.status, response.statusText)
          const errorText = await response.text()
          console.log('❌ Attractions error details:', errorText)
          continue
        }

        const data = await response.json()
        console.log('📊 Server: Attractions API response status:', data.status)
        console.log('📊 Server: Attractions API response results count:', data.results?.length || 0)
        if (data.error_message) {
          console.log('❌ Google Attractions API Error:', data.error_message)
        }

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          console.log(`✅ Server: Found ${data.results.length} attractions`)
          
          const attractions = data.results.slice(0, 10).map((place: any) => ({
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

          return NextResponse.json({ attractions, source: 'google_places_api' })
        } else {
          console.log('⚠️ Server: No attraction results for query:', query, 'Status:', data.status, 'Error:', data.error_message)
        }
      } catch (fetchError) {
        console.log('❌ Server: Fetch error for attractions query:', query, fetchError)
        continue
      }
    }

    console.log('❌ Server: All attraction queries failed, no attractions found')
    return NextResponse.json({ 
      attractions: [], 
      source: 'no_results',
      message: `No attractions found for ${city}, ${country}. Please try a different city or check the spelling.`
    })

  } catch (error) {
    console.error('💥 Server: Error in attractions API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
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

