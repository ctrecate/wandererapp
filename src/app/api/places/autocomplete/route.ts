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
      console.log('⚠️ Server: No autocomplete results, status:', data.status, 'Error:', data.error_message)
      
      // Fallback: return some common cities if API fails
      const fallbackCities = getFallbackCities(input)
      console.log(`🔄 Server: Using fallback cities: ${fallbackCities.length} suggestions`)
      return NextResponse.json({ predictions: fallbackCities })
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

function getFallbackCities(input: string): any[] {
  const commonCities = [
    { city: 'New York', country: 'USA', description: 'New York, NY, USA' },
    { city: 'London', country: 'United Kingdom', description: 'London, England, UK' },
    { city: 'Paris', country: 'France', description: 'Paris, France' },
    { city: 'Tokyo', country: 'Japan', description: 'Tokyo, Japan' },
    { city: 'Barcelona', country: 'Spain', description: 'Barcelona, Spain' },
    { city: 'Rome', country: 'Italy', description: 'Rome, Italy' },
    { city: 'Berlin', country: 'Germany', description: 'Berlin, Germany' },
    { city: 'Amsterdam', country: 'Netherlands', description: 'Amsterdam, Netherlands' },
    { city: 'Vienna', country: 'Austria', description: 'Vienna, Austria' },
    { city: 'Prague', country: 'Czech Republic', description: 'Prague, Czech Republic' },
    { city: 'Budapest', country: 'Hungary', description: 'Budapest, Hungary' },
    { city: 'Warsaw', country: 'Poland', description: 'Warsaw, Poland' },
    { city: 'Copenhagen', country: 'Denmark', description: 'Copenhagen, Denmark' },
    { city: 'Stockholm', country: 'Sweden', description: 'Stockholm, Sweden' },
    { city: 'Oslo', country: 'Norway', description: 'Oslo, Norway' },
    { city: 'Helsinki', country: 'Finland', description: 'Helsinki, Finland' },
    { city: 'Zurich', country: 'Switzerland', description: 'Zurich, Switzerland' },
    { city: 'Brussels', country: 'Belgium', description: 'Brussels, Belgium' },
    { city: 'Lisbon', country: 'Portugal', description: 'Lisbon, Portugal' },
    { city: 'Athens', country: 'Greece', description: 'Athens, Greece' },
    { city: 'Istanbul', country: 'Turkey', description: 'Istanbul, Turkey' },
    { city: 'Moscow', country: 'Russia', description: 'Moscow, Russia' },
    { city: 'Dublin', country: 'Ireland', description: 'Dublin, Ireland' },
    { city: 'Reykjavik', country: 'Iceland', description: 'Reykjavik, Iceland' },
    { city: 'Sydney', country: 'Australia', description: 'Sydney, Australia' },
    { city: 'Melbourne', country: 'Australia', description: 'Melbourne, Australia' },
    { city: 'Toronto', country: 'Canada', description: 'Toronto, Canada' },
    { city: 'Vancouver', country: 'Canada', description: 'Vancouver, Canada' },
    { city: 'Montreal', country: 'Canada', description: 'Montreal, Canada' },
    { city: 'Los Angeles', country: 'USA', description: 'Los Angeles, CA, USA' },
    { city: 'Chicago', country: 'USA', description: 'Chicago, IL, USA' },
    { city: 'San Francisco', country: 'USA', description: 'San Francisco, CA, USA' },
    { city: 'Boston', country: 'USA', description: 'Boston, MA, USA' },
    { city: 'Seattle', country: 'USA', description: 'Seattle, WA, USA' },
    { city: 'Miami', country: 'USA', description: 'Miami, FL, USA' },
    { city: 'Las Vegas', country: 'USA', description: 'Las Vegas, NV, USA' },
    { city: 'Munich', country: 'Germany', description: 'Munich, Germany' },
    { city: 'Hamburg', country: 'Germany', description: 'Hamburg, Germany' },
    { city: 'Cologne', country: 'Germany', description: 'Cologne, Germany' },
    { city: 'Madrid', country: 'Spain', description: 'Madrid, Spain' },
    { city: 'Seville', country: 'Spain', description: 'Seville, Spain' },
    { city: 'Valencia', country: 'Spain', description: 'Valencia, Spain' },
    { city: 'Milan', country: 'Italy', description: 'Milan, Italy' },
    { city: 'Florence', country: 'Italy', description: 'Florence, Italy' },
    { city: 'Venice', country: 'Italy', description: 'Venice, Italy' },
    { city: 'Naples', country: 'Italy', description: 'Naples, Italy' }
  ]

  const inputLower = input.toLowerCase()
  const filtered = commonCities.filter(city => 
    city.city.toLowerCase().includes(inputLower) ||
    city.country.toLowerCase().includes(inputLower) ||
    city.description.toLowerCase().includes(inputLower)
  )

  return filtered.slice(0, 8).map(city => ({
    place_id: `fallback_${city.city.toLowerCase().replace(' ', '_')}`,
    description: city.description,
    city: city.city,
    country: city.country,
    structured_formatting: {
      main_text: city.city,
      secondary_text: city.country
    }
  }))
}
