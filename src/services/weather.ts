import { Weather } from '@/types'

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo-key'

export interface WeatherResponse {
  list: Array<{
    dt: number
    main: {
      temp: number
      temp_min: number
      temp_max: number
      humidity: number
    }
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    wind: {
      speed: number
    }
    pop: number // probability of precipitation
  }>
}

export async function fetchWeatherForecast(city: string, country: string): Promise<Weather[]> {
  // For demo purposes, return mock data if no API key
  if (OPENWEATHER_API_KEY === 'demo-key') {
    return getMockWeatherData(city)
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${OPENWEATHER_API_KEY}&units=metric`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data: WeatherResponse = await response.json()
    
    // Group by day and get daily forecasts
    const dailyForecasts = new Map<string, WeatherResponse['list'][0]>()
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!dailyForecasts.has(date) || item.main.temp_max > dailyForecasts.get(date)!.main.temp_max) {
        dailyForecasts.set(date, item)
      }
    })

    return Array.from(dailyForecasts.values()).slice(0, 7).map(item => ({
      date: new Date(item.dt * 1000).toISOString().split('T')[0],
      temperature: {
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min)
      },
      condition: item.weather[0].description,
      precipitation: Math.round(item.pop * 100),
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed
    }))
  } catch (error) {
    console.error('Error fetching weather:', error)
    return getMockWeatherData(city)
  }
}

function getMockWeatherData(city: string): Weather[] {
  const conditions = ['clear', 'cloudy', 'rainy', 'sunny', 'partly cloudy']
  const icons = ['01d', '02d', '03d', '04d', '10d']
  
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    const high = Math.floor(Math.random() * 15) + 15 // 15-30°C
    const low = high - Math.floor(Math.random() * 10) - 5 // 5-15°C lower
    
    return {
      date: date.toISOString().split('T')[0],
      temperature: { high, low },
      condition,
      precipitation: Math.floor(Math.random() * 30),
      icon: icons[Math.floor(Math.random() * icons.length)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 10) + 5 // 5-15 km/h
    }
  })
}
