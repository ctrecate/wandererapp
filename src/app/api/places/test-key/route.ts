import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = 'AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik'

export async function GET(request: NextRequest) {
  try {
    console.log('🔑 Testing Google Places API key permissions...')
    
    // Test 1: Basic search
    console.log('🔑 Test 1: Basic search')
    const searchUrl = 'https://places.googleapis.com/v1/places:searchText'
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.types,places.rating,places.priceLevel,places.formattedAddress,places.photos'
      },
      body: JSON.stringify({
        textQuery: 'restaurants in Venice, Italy',
        maxResultCount: 1
      })
    })
    
    console.log('🔑 Search response status:', searchResponse.status)
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()
      console.log('🔑 Search error:', errorText)
      return NextResponse.json({
        success: false,
        error: 'Search failed',
        status: searchResponse.status,
        details: errorText
      })
    }
    
    const searchData = await searchResponse.json()
    console.log('🔑 Search data:', searchData)
    
    if (!searchData.places || searchData.places.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No places found',
        searchData
      })
    }
    
    const place = searchData.places[0]
    console.log('🔑 Found place:', place.id, place.displayName?.text)
    
    // Test 2: Details request
    console.log('🔑 Test 2: Details request')
    const detailsUrl = `https://places.googleapis.com/v1/places/${place.id}`
    const detailsResponse = await fetch(detailsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'websiteUri,nationalPhoneNumber,regularOpeningHours'
      },
      body: JSON.stringify({})
    })
    
    console.log('🔑 Details response status:', detailsResponse.status)
    
    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text()
      console.log('🔑 Details error:', errorText)
      return NextResponse.json({
        success: false,
        error: 'Details failed',
        status: detailsResponse.status,
        details: errorText,
        placeId: place.id,
        placeName: place.displayName?.text
      })
    }
    
    const detailsData = await detailsResponse.json()
    console.log('🔑 Details data:', detailsData)
    
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
    
  } catch (error) {
    console.error('🔑 Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
