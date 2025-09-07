// Simple utility functions without external dependencies

export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ')
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  
  if (startDate.getFullYear() === endDate.getFullYear() && 
      startDate.getMonth() === endDate.getMonth()) {
    return `${start.split(',')[0]} - ${endDate.getDate()}, ${endDate.getFullYear()}`
  }
  
  return `${start} - ${end}`
}

export function getDaysBetween(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatTemperature(temp: number, unit: 'C' | 'F' = 'F'): string {
  return `${Math.round(temp)}°${unit}`
}

export function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    'clear': '☀️',
    'sunny': '☀️',
    'cloudy': '☁️',
    'overcast': '☁️',
    'rainy': '🌧️',
    'rain': '🌧️',
    'stormy': '⛈️',
    'thunderstorm': '⛈️',
    'snowy': '❄️',
    'snow': '❄️',
    'foggy': '🌫️',
    'fog': '🌫️',
    'windy': '💨',
    'wind': '💨',
  }
  
  const lowerCondition = condition.toLowerCase()
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerCondition.includes(key)) {
      return icon
    }
  }
  
  return '🌤️' // Default weather icon
}

export function getDestinationType(city: string, country: string): string {
  const beachCities = ['miami', 'san diego', 'barcelona', 'sydney', 'cancun', 'phuket']
  const mountainCities = ['denver', 'zurich', 'vancouver', 'salt lake city', 'aspen']
  const capitalCities = ['washington', 'london', 'paris', 'tokyo', 'berlin', 'rome']
  
  const lowerCity = city.toLowerCase()
  
  if (beachCities.some(beach => lowerCity.includes(beach))) {
    return 'beach'
  }
  if (mountainCities.some(mountain => lowerCity.includes(mountain))) {
    return 'mountain'
  }
  if (capitalCities.some(capital => lowerCity.includes(capital))) {
    return 'capital'
  }
  
  return 'city'
}
