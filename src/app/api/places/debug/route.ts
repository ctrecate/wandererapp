import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Starting API key test')
    console.log('🔍 Debug: API Key exists:', !!GOOGLE_PLACES_API_KEY)
    console.log('🔍 Debug: API Key length:', GOOGLE_PLACES_API_KEY?.length)
    console.log('🔍 Debug: API Key starts with:', GOOGLE_PLACES_API_KEY?.substring(0, 10))

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json({ error: 'No API key found' }, { status: 500 })
    }

    // Test 1: Basic search
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

    // Test 2: Get place details
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

  } catch (error) {
    console.error('💥 Debug: Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Internal error', details: errorMessage }, { status: 500 })
  }
}
