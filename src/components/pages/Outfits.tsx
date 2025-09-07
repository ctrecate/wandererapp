import React, { useState, useEffect } from 'react'
import { Shirt, Thermometer, Cloud, Sun, CloudRain, Snowflake } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { fetchWeatherForecast } from '@/services/weather'
import { Weather, OutfitRecommendation } from '@/types'
import { formatTemperature, getWeatherIcon } from '@/lib/utils'

const Outfits: React.FC = () => {
  const { currentTrip } = useApp()
  const [weatherData, setWeatherData] = useState<Record<string, Weather[]>>({})
  const [outfitRecommendations, setOutfitRecommendations] = useState<Record<string, OutfitRecommendation[]>>({})

  useEffect(() => {
    if (currentTrip?.destinations) {
      loadWeatherAndGenerateOutfits()
    }
  }, [currentTrip?.destinations])

  const loadWeatherAndGenerateOutfits = async () => {
    if (!currentTrip) return

    const newWeatherData: Record<string, Weather[]> = {}
    const newOutfitRecommendations: Record<string, OutfitRecommendation[]> = {}

    for (const destination of currentTrip.destinations) {
      try {
        const weather = await fetchWeatherForecast(destination.city, destination.country)
        newWeatherData[destination.id] = weather
        
        // Generate outfit recommendations based on weather
        const outfits = generateOutfitRecommendations(weather, destination.city)
        newOutfitRecommendations[destination.id] = outfits
      } catch (error) {
        console.error('Error loading weather for outfits:', error)
      }
    }

    setWeatherData(newWeatherData)
    setOutfitRecommendations(newOutfitRecommendations)
  }

  const generateOutfitRecommendations = (weather: Weather[], city: string): OutfitRecommendation[] => {
    const recommendations: OutfitRecommendation[] = []
    
    // Group weather by temperature ranges
    const tempRanges = new Map<string, Weather[]>()
    
    weather.forEach(day => {
      const avgTemp = (day.temperature.high + day.temperature.low) / 2
      let range: string
      
      if (avgTemp < 5) range = 'very-cold'
      else if (avgTemp < 15) range = 'cold'
      else if (avgTemp < 25) range = 'mild'
      else if (avgTemp < 35) range = 'warm'
      else range = 'hot'
      
      if (!tempRanges.has(range)) tempRanges.set(range, [])
      tempRanges.get(range)!.push(day)
    })

    // Generate recommendations for each temperature range
    tempRanges.forEach((days, range) => {
      const avgTemp = days.reduce((sum, day) => sum + (day.temperature.high + day.temperature.low) / 2, 0) / days.length
      const condition = days[0].condition.toLowerCase()
      
      const recommendation = generateOutfitForConditions(range, condition, avgTemp, city)
      if (recommendation) {
        recommendations.push(recommendation)
      }
    })

    return recommendations
  }

  const generateOutfitForConditions = (tempRange: string, condition: string, avgTemp: number, city: string): OutfitRecommendation | null => {
    const destinationType = getDestinationType(city)
    
    const baseOutfit = {
      id: `${tempRange}-${condition}-${city}`,
      weatherCondition: condition,
      temperature: { min: avgTemp - 5, max: avgTemp + 5 },
      destinationType,
      items: {
        tops: [] as string[],
        bottoms: [] as string[],
        outerwear: [] as string[],
        shoes: [] as string[],
        accessories: [] as string[]
      },
      tips: [] as string[]
    }

    // Temperature-based recommendations
    if (tempRange === 'very-cold') {
      baseOutfit.items.tops = ['Thermal base layer', 'Wool sweater', 'Fleece jacket']
      baseOutfit.items.bottoms = ['Thermal leggings', 'Warm pants', 'Jeans']
      baseOutfit.items.outerwear = ['Heavy winter coat', 'Down jacket', 'Wool coat']
      baseOutfit.items.shoes = ['Insulated boots', 'Winter boots', 'Wool socks']
      baseOutfit.items.accessories = ['Warm hat', 'Gloves', 'Scarf', 'Thermal socks']
      baseOutfit.tips = ['Layer up for warmth', 'Bring hand warmers', 'Protect extremities']
    } else if (tempRange === 'cold') {
      baseOutfit.items.tops = ['Long-sleeve shirt', 'Sweater', 'Cardigan']
      baseOutfit.items.bottoms = ['Jeans', 'Warm pants', 'Leggings']
      baseOutfit.items.outerwear = ['Light jacket', 'Trench coat', 'Blazer']
      baseOutfit.items.shoes = ['Boots', 'Sneakers', 'Loafers']
      baseOutfit.items.accessories = ['Light scarf', 'Hat', 'Gloves']
      baseOutfit.tips = ['Layer for versatility', 'Bring a light jacket']
    } else if (tempRange === 'mild') {
      baseOutfit.items.tops = ['T-shirt', 'Long-sleeve shirt', 'Light sweater']
      baseOutfit.items.bottoms = ['Jeans', 'Chinos', 'Skirt']
      baseOutfit.items.outerwear = ['Light jacket', 'Cardigan', 'Blazer']
      baseOutfit.items.shoes = ['Sneakers', 'Loafers', 'Boots']
      baseOutfit.items.accessories = ['Light scarf', 'Sunglasses']
      baseOutfit.tips = ['Perfect weather for layering', 'Bring a light jacket for evenings']
    } else if (tempRange === 'warm') {
      baseOutfit.items.tops = ['T-shirt', 'Tank top', 'Light blouse']
      baseOutfit.items.bottoms = ['Shorts', 'Light pants', 'Skirt']
      baseOutfit.items.outerwear = ['Light cardigan', 'Denim jacket']
      baseOutfit.items.shoes = ['Sandals', 'Sneakers', 'Flats']
      baseOutfit.items.accessories = ['Sunglasses', 'Hat', 'Light scarf']
      baseOutfit.tips = ['Stay cool and comfortable', 'Bring sun protection']
    } else if (tempRange === 'hot') {
      baseOutfit.items.tops = ['Tank top', 'Light t-shirt', 'Linen shirt']
      baseOutfit.items.bottoms = ['Shorts', 'Light skirt', 'Linen pants']
      baseOutfit.items.outerwear = ['Light shawl', 'Sun hat']
      baseOutfit.items.shoes = ['Sandals', 'Flip-flops', 'Breathable sneakers']
      baseOutfit.items.accessories = ['Sunglasses', 'Wide-brim hat', 'Sunscreen']
      baseOutfit.tips = ['Stay cool and hydrated', 'Wear light colors', 'Protect from sun']
    }

    // Weather condition adjustments
    if (condition.includes('rain')) {
      baseOutfit.items.outerwear.push('Rain jacket', 'Umbrella')
      baseOutfit.items.shoes = ['Waterproof boots', 'Rain boots']
      baseOutfit.items.accessories.push('Waterproof bag cover')
      baseOutfit.tips.push('Stay dry with waterproof gear')
    }

    if (condition.includes('snow')) {
      baseOutfit.items.outerwear.push('Snow jacket', 'Waterproof coat')
      baseOutfit.items.shoes = ['Snow boots', 'Insulated boots']
      baseOutfit.items.accessories.push('Snow gloves', 'Winter hat')
      baseOutfit.tips.push('Dress for snow and ice')
    }

    if (condition.includes('wind')) {
      baseOutfit.items.outerwear.push('Windbreaker', 'Light jacket')
      baseOutfit.tips.push('Protect against wind chill')
    }

    // Destination type adjustments
    if (destinationType === 'beach') {
      baseOutfit.items.tops.push('Swimsuit', 'Cover-up', 'Rash guard')
      baseOutfit.items.bottoms.push('Swim trunks', 'Beach shorts')
      baseOutfit.items.accessories.push('Beach towel', 'Sunscreen', 'Beach hat')
      baseOutfit.tips.push('Pack beach essentials', 'Bring extra sunscreen')
    } else if (destinationType === 'mountain') {
      baseOutfit.items.shoes.push('Hiking boots', 'Trail shoes')
      baseOutfit.items.accessories.push('Hiking backpack', 'Water bottle')
      baseOutfit.tips.push('Prepare for elevation changes', 'Bring hiking gear')
    }

    return baseOutfit
  }

  const getDestinationType = (city: string): string => {
    const beachCities = ['miami', 'san diego', 'barcelona', 'sydney', 'cancun', 'phuket']
    const mountainCities = ['denver', 'zurich', 'vancouver', 'salt lake city', 'aspen']
    
    const lowerCity = city.toLowerCase()
    
    if (beachCities.some(beach => lowerCity.includes(beach))) return 'beach'
    if (mountainCities.some(mountain => lowerCity.includes(mountain))) return 'mountain'
    return 'city'
  }

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('rain')) return <CloudRain className="h-5 w-5 text-blue-500" />
    if (condition.includes('snow')) return <Snowflake className="h-5 w-5 text-blue-300" />
    if (condition.includes('cloud')) return <Cloud className="h-5 w-5 text-gray-500" />
    if (condition.includes('clear') || condition.includes('sunny')) return <Sun className="h-5 w-5 text-yellow-500" />
    return <Cloud className="h-5 w-5 text-gray-500" />
  }

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <Shirt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trip selected</h3>
        <p className="mt-1 text-sm text-gray-500">Create a trip first to get outfit recommendations.</p>
      </div>
    )
  }

  if (currentTrip.destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <Shirt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations added</h3>
        <p className="mt-1 text-sm text-gray-500">Add destinations to your trip to get outfit recommendations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Outfit Recommendations</h1>
        <p className="text-gray-600">Smart outfit suggestions based on weather and destination</p>
      </div>

      <div className="space-y-6">
        {currentTrip.destinations.map(destination => {
          const weather = weatherData[destination.id] || []
          const outfits = outfitRecommendations[destination.id] || []

          return (
            <div key={destination.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {destination.city}, {destination.country}
              </h2>

              {weather.length === 0 ? (
                <div className="text-center py-8">
                  <Thermometer className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Loading weather data...</p>
                </div>
              ) : outfits.length === 0 ? (
                <div className="text-center py-8">
                  <Shirt className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Generating outfit recommendations...</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {outfits.map((outfit, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        {getWeatherIcon(outfit.weatherCondition)}
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {outfit.weatherCondition} Weather
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatTemperature(outfit.temperature.min)} - {formatTemperature(outfit.temperature.max)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(outfit.items).map(([category, items]) => (
                          <div key={category} className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 mb-2 capitalize">
                              {category}
                            </h4>
                            <ul className="space-y-1">
                              {items.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {outfit.tips.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
                          <ul className="space-y-1">
                            {outfit.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-blue-800 flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Outfits }
