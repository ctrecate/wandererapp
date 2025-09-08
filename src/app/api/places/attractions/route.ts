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
      const url = `https://places.googleapis.com/v1/places:searchText`
      
      console.log('🌐 Server: Trying attractions URL:', url)
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.location,places.photos,places.websiteUri,places.editorialSummary',
          },
          body: JSON.stringify({
            textQuery: query,
            maxResultCount: 10,
            includedType: 'tourist_attraction',
            languageCode: 'en'
          }),
        })
        console.log('📡 Server: Attractions response status:', response.status, response.statusText)

        if (!response.ok) {
          console.log('❌ Server: HTTP Error for attractions:', response.status, response.statusText)
          const errorText = await response.text()
          console.log('❌ Attractions error details:', errorText)
          continue
        }

        const data = await response.json()
        console.log('📊 Server: Attractions API response data:', data)
        console.log('📊 Server: Attractions API response places count:', data.places?.length || 0)

        if (data.places && data.places.length > 0) {
          console.log(`✅ Server: Found ${data.places.length} attractions`)
          
          const attractions = data.places.slice(0, 10).map((place: any) => ({
            id: place.id || `attraction_${Math.random().toString(36).substr(2, 9)}`,
            name: place.displayName?.text || 'Tourist Attraction',
            description: place.editorialSummary?.text || `Popular tourist attraction in ${city}`,
            category: getCategoryFromTypes(place.types),
            openingHours: 'Hours vary', // Not available in new API without additional call
            cost: 'Varies',
            duration: '1-3 hours',
            howToGetThere: `Located at ${place.formattedAddress || city}`,
            rating: place.rating || 4.0,
            website: place.websiteUri || undefined,
            imageUrl: place.photos?.[0] ? 
              `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=400&key=${GOOGLE_PLACES_API_KEY}` :
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

