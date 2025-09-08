import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = 'AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const country = searchParams.get('country')
    const debug = searchParams.get('debug')

    if (!city || !country) {
      return NextResponse.json({ error: 'City and country are required' }, { status: 400 })
    }

    // Debug mode - test API key and basic functionality
    if (debug === 'true') {
      console.log('🔍 Debug: Starting API key test')
      console.log('🔍 Debug: API Key exists:', !!GOOGLE_PLACES_API_KEY)
      console.log('🔍 Debug: API Key length:', GOOGLE_PLACES_API_KEY?.length)
      console.log('🔍 Debug: API Key starts with:', GOOGLE_PLACES_API_KEY?.substring(0, 10))

      // Test basic search
      console.log('🔍 Debug: Test 1 - Basic search')
      const searchResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.types'
        },
        body: JSON.stringify({
          textQuery: 'restaurant in Venice Italy',
          maxResultCount: 1,
          includedType: 'restaurant',
          languageCode: 'en'
        })
      })

      console.log('📡 Debug: Search response status:', searchResponse.status, searchResponse.statusText)
      
      if (!searchResponse.ok) {
        const errorText = await searchResponse.text()
        console.log('❌ Debug: Search failed:', errorText)
        return NextResponse.json({ 
          error: 'Search failed', 
          status: searchResponse.status, 
          details: errorText 
        }, { status: searchResponse.status })
      }

      const searchData = await searchResponse.json()
      console.log('📊 Debug: Search data:', searchData)

      if (!searchData.places || searchData.places.length === 0) {
        return NextResponse.json({ error: 'No places found' }, { status: 404 })
      }

      const place = searchData.places[0]
      console.log('🔍 Debug: Found place:', place.displayName?.text, 'ID:', place.id)

      // Test place details
      console.log('🔍 Debug: Test 2 - Get place details')
      const detailsResponse = await fetch(`https://places.googleapis.com/v1/places/${place.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'websiteUri,nationalPhoneNumber,regularOpeningHours'
        },
        body: JSON.stringify({})
      })

      console.log('📡 Debug: Details response status:', detailsResponse.status, detailsResponse.statusText)
      
      if (!detailsResponse.ok) {
        const errorText = await detailsResponse.text()
        console.log('❌ Debug: Details failed:', errorText)
        return NextResponse.json({ 
          error: 'Details failed', 
          status: detailsResponse.status, 
          details: errorText,
          placeId: place.id,
          placeName: place.displayName?.text
        }, { status: detailsResponse.status })
      }

      const detailsData = await detailsResponse.json()
      console.log('📊 Debug: Details data:', detailsData)

      return NextResponse.json({
        success: true,
        place: {
          id: place.id,
          name: place.displayName?.text,
          types: place.types
        },
        details: {
          website: detailsData.websiteUri || null,
          phone: detailsData.nationalPhoneNumber || null,
          openingHours: detailsData.regularOpeningHours || null
        },
        rawDetails: detailsData
      })
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
      const url = `https://places.googleapis.com/v1/places:searchText`
      
      console.log('🌐 Server: Trying URL:', url)
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.types,places.location,places.photos,places.websiteUri,places.editorialSummary',
          },
          body: JSON.stringify({
            textQuery: query,
            maxResultCount: 10,
            includedType: 'restaurant',
            languageCode: 'en'
          }),
        })
        console.log('📡 Server: Response status:', response.status, response.statusText)

        if (!response.ok) {
          console.log('❌ Server: HTTP Error:', response.status, response.statusText)
          const errorText = await response.text()
          console.log('❌ Error details:', errorText)
          continue
        }

        const data = await response.json()
        console.log('📊 Server: API response data:', data)
        console.log('📊 Server: API response places count:', data.places?.length || 0)

        if (data.places && data.places.length > 0) {
          console.log(`✅ Server: Found ${data.places.length} restaurants`)
          
          // Get detailed information for each place
          const restaurants = await Promise.all(
            data.places.slice(0, 10).map(async (place: any) => {
              let detailedInfo = {
                website: undefined,
                phone: undefined,
                openingHours: 'Hours not available'
              }

              // Get detailed place information using POST request
              try {
                const detailsUrl = `https://places.googleapis.com/v1/places/${place.id}`
                console.log('🔍 Server: Fetching details for place:', place.id)
                console.log('🔍 Server: Details URL:', detailsUrl)
                
                const detailsResponse = await fetch(detailsUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                    'X-Goog-FieldMask': 'websiteUri,nationalPhoneNumber,regularOpeningHours'
                  },
                  body: JSON.stringify({})
                })

                console.log('📡 Server: Details response status:', detailsResponse.status, detailsResponse.statusText)

                if (detailsResponse.ok) {
                  const detailsData = await detailsResponse.json()
                  console.log('📊 Server: Details data for', place.displayName?.text, ':', detailsData)
                  
                  detailedInfo = {
                    website: detailsData.websiteUri || undefined,
                    phone: detailsData.nationalPhoneNumber || undefined,
                    openingHours: detailsData.regularOpeningHours?.weekdayDescriptions?.join(', ') || 'Hours not available'
                  }
                  
                  console.log('✅ Server: Extracted info for', place.displayName?.text, ':', detailedInfo)
                } else {
                  const errorText = await detailsResponse.text()
                  console.log('❌ Server: Details API error:', detailsResponse.status, errorText)
                }
              } catch (error) {
                console.log('⚠️ Server: Could not fetch detailed info for place:', place.id, error)
              }

              const restaurant = {
                id: place.id || `restaurant_${Math.random().toString(36).substr(2, 9)}`,
                name: place.displayName?.text || 'Restaurant',
                cuisine: getCuisineFromTypes(place.types),
                priceRange: place.priceLevel ? place.priceLevel + 1 : 2,
                rating: place.rating || 4.0,
                mustTryDishes: getDefaultDishesForCuisine(getCuisineFromTypes(place.types)),
                address: place.formattedAddress || `${city}, ${country}`,
                phone: detailedInfo.phone,
                website: detailedInfo.website,
                openingHours: detailedInfo.openingHours,
                isBookmarked: false,
                photoUrl: place.photos?.[0] ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=400&key=${GOOGLE_PLACES_API_KEY}` : undefined
              }
              
              console.log('🍽️ Server: Final restaurant data for', restaurant.name, ':', {
                website: restaurant.website,
                phone: restaurant.phone,
                openingHours: restaurant.openingHours
              })
              
              return restaurant
            })
          )

          console.log('🍽️ Server: Final restaurants array:', restaurants.map(r => ({
            name: r.name,
            website: r.website,
            phone: r.phone,
            openingHours: r.openingHours
          })))
          
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

