import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = 'AIzaSyA_s8qPRrFrKfAvAU_N-CmIumtmDTHUmik'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const input = searchParams.get('input')

    if (!input || input.length < 2) {
      return NextResponse.json({ predictions: [] })
    }

    console.log('🔍 Server: Autocomplete search for:', input)

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`
    
    console.log('🌐 Server: Autocomplete URL:', url)
    
    const response = await fetch(url)
    console.log('📡 Server: Autocomplete response status:', response.status)

    if (!response.ok) {
      console.error('❌ Server: Autocomplete API error:', response.status)
      return NextResponse.json({ predictions: [] })
    }

    const data = await response.json()
    console.log('📊 Server: Autocomplete response:', data)

    if (data.status === 'OK' && data.predictions) {
      // Process predictions to extract city and country
      const processedPredictions = data.predictions.map((prediction: any) => {
        const description = prediction.description
        const parts = description.split(', ')
        
        // Extract city and country from the description
        let city = parts[0]
        let country = parts[parts.length - 1]
        
        // Handle cases where country might be a state/province
        if (parts.length > 2) {
          // Check if the last part is a country or state
          const lastPart = parts[parts.length - 1]
          const secondLastPart = parts[parts.length - 2]
          
          // If last part looks like a country (2-3 letters or common country names)
          if (lastPart.length <= 3 || isCommonCountry(lastPart)) {
            country = lastPart
          } else {
            country = secondLastPart
          }
        }
        
        return {
          place_id: prediction.place_id,
          description: prediction.description,
          city: city,
          country: country,
          structured_formatting: prediction.structured_formatting
        }
      })

      console.log(`✅ Server: Found ${processedPredictions.length} autocomplete suggestions`)
      return NextResponse.json({ predictions: processedPredictions })
    } else {
      console.log('⚠️ Server: No autocomplete results, status:', data.status)
      return NextResponse.json({ predictions: [] })
    }

  } catch (error) {
    console.error('💥 Server: Error in autocomplete API:', error)
    return NextResponse.json({ predictions: [] })
  }
}

function isCommonCountry(country: string): boolean {
  const commonCountries = [
    'USA', 'United States', 'Canada', 'United Kingdom', 'UK', 'France', 'Germany', 
    'Italy', 'Spain', 'Japan', 'China', 'India', 'Australia', 'Brazil', 'Mexico',
    'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria',
    'Belgium', 'Portugal', 'Greece', 'Turkey', 'Russia', 'Poland', 'Czech Republic',
    'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia',
    'Latvia', 'Lithuania', 'Ireland', 'Iceland', 'Luxembourg', 'Malta', 'Cyprus'
  ]
  
  return commonCountries.some(common => 
    country.toLowerCase().includes(common.toLowerCase()) || 
    common.toLowerCase().includes(country.toLowerCase())
  )
}
