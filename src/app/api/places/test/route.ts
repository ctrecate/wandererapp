import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = 'AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Google Places API Key')
    
    // Test with a simple, well-known location
    const testUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+New+York&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
    
    console.log('🌐 Test URL:', testUrl)
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TravelApp/1.0)',
      },
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
      status: data.status,
      resultsCount: data.results?.length || 0,
      errorMessage: data.error_message,
      firstResult: data.results?.[0] || null,
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
