import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = 'AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Google Places API Key')
    
    // Test with the new Places API
    const testUrl = `https://places.googleapis.com/v1/places:searchText`
    
    console.log('🌐 Test URL:', testUrl)
    
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types',
      },
      body: JSON.stringify({
        textQuery: 'restaurants in New York',
        maxResultCount: 5,
        includedType: 'restaurant',
        languageCode: 'en'
      }),
    })
    
    console.log('📡 Test response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Test error response:', errorText)
      return NextResponse.json({ 
        success: false, 
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: errorText
      })
    }
    
    const data = await response.json()
    console.log('📊 Test response data:', data)
    
    return NextResponse.json({
      success: true,
      placesCount: data.places?.length || 0,
      firstPlace: data.places?.[0] || null,
      fullResponse: data
    })
    
  } catch (error) {
    console.error('💥 Test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
