import React from 'react'
import { Bus, MapPin, CreditCard, Smartphone, Plane } from 'lucide-react'
import { useApp } from '@/context/AppContext'

const Transportation: React.FC = () => {
  const { currentTrip } = useApp()

  const transportationData = {
    'paris': {
      metro: {
        name: 'Paris Metro',
        description: 'Extensive underground rail system serving Paris and surrounding areas',
        cost: '€2.10 per ticket, €14.90 for 10-ticket carnet',
        paymentMethod: 'Contactless cards, mobile payments, or Navigo Easy card',
        lines: '16 lines covering the entire city'
      },
      bus: {
        name: 'RATP Bus Network',
        description: 'Comprehensive bus system with over 300 routes',
        cost: '€2.10 per ticket (same as metro)',
        paymentMethod: 'Same as metro - contactless or Navigo card'
      },
      airport: {
        options: ['RER B train', 'Airport buses', 'Taxis', 'Uber'],
        costs: ['€10.30', '€12-17', '€50-70', '€35-55'],
        duration: ['45-60 min', '60-90 min', '45-60 min', '45-60 min']
      },
      apps: ['RATP', 'Citymapper', 'Uber', 'Bolt'],
      tips: [
        'Get a Navigo Easy card for convenience',
        'Download the RATP app for real-time updates',
        'Avoid rush hours (7-9 AM, 5-7 PM)',
        'Validate your ticket before boarding'
      ]
    },
    'london': {
      metro: {
        name: 'London Underground (Tube)',
        description: 'World\'s oldest underground railway system',
        cost: '£2.80-£6.30 depending on zones',
        paymentMethod: 'Oyster card, contactless payment, or mobile',
        lines: '11 lines serving Greater London'
      },
      bus: {
        name: 'London Buses',
        description: 'Extensive bus network with iconic red double-deckers',
        cost: '£1.75 per journey (Hopper fare allows free transfers)',
        paymentMethod: 'Oyster card, contactless, or mobile payment'
      },
      airport: {
        options: ['Heathrow Express', 'Piccadilly Line', 'Taxis', 'Uber'],
        costs: ['£25-37', '£3.10-£5.10', '£45-85', '£25-45'],
        duration: ['15-20 min', '45-60 min', '45-60 min', '45-60 min']
      },
      apps: ['TfL Go', 'Citymapper', 'Uber', 'Bolt'],
      tips: [
        'Get an Oyster card or use contactless payment',
        'Download TfL Go app for live updates',
        'Avoid peak hours (7-9 AM, 5-7 PM)',
        'Stand on the right side of escalators'
      ]
    },
    'tokyo': {
      metro: {
        name: 'Tokyo Metro & Toei Subway',
        description: 'Two subway systems serving Tokyo with excellent coverage',
        cost: '¥170-¥320 depending on distance',
        paymentMethod: 'IC cards (Suica, Pasmo) or mobile payment',
        lines: '13 lines covering central Tokyo'
      },
      bus: {
        name: 'Tokyo Buses',
        description: 'Comprehensive bus network, especially useful for areas not served by trains',
        cost: '¥210 for most routes',
        paymentMethod: 'IC cards or exact change'
      },
      airport: {
        options: ['Narita Express', 'Keisei Skyliner', 'Airport Limousine Bus', 'Taxis'],
        costs: ['¥3,070', '¥2,470', '¥3,100', '¥20,000-30,000'],
        duration: ['53-60 min', '41 min', '60-90 min', '60-90 min']
      },
      apps: ['Google Maps', 'Yahoo! Transit', 'Uber', 'DiDi'],
      tips: [
        'Get a Suica or Pasmo IC card',
        'Google Maps works excellently for navigation',
        'Trains stop running around midnight',
        'Be prepared for crowded trains during rush hour'
      ]
    },
    'new-york': {
      metro: {
        name: 'NYC Subway',
        description: '24/7 subway system serving all five boroughs',
        cost: '$2.90 per ride (unlimited transfers)',
        paymentMethod: 'MetroCard, OMNY contactless, or mobile payment',
        lines: '27 lines with 472 stations'
      },
      bus: {
        name: 'MTA Buses',
        description: 'Extensive bus network with local and express routes',
        cost: '$2.90 per ride (free transfers to subway)',
        paymentMethod: 'Same as subway - MetroCard or OMNY'
      },
      airport: {
        options: ['AirTrain + Subway', 'Airport Express Bus', 'Taxis', 'Uber/Lyft'],
        costs: ['$8.25 + $2.90', '$19', '$52-70', '$35-55'],
        duration: ['60-90 min', '60-90 min', '45-60 min', '45-60 min']
      },
      apps: ['MYmta', 'Citymapper', 'Uber', 'Lyft'],
      tips: [
        'Get a MetroCard or use OMNY contactless',
        'Download MYmta app for real-time updates',
        'Subway runs 24/7 but with reduced service at night',
        'Express trains skip local stops'
      ]
    }
  }

  const getTransportationForCity = (city: string) => {
    const cityLower = city.toLowerCase()
    
    if (cityLower.includes('paris')) {
      return transportationData['paris']
    }
    if (cityLower.includes('london')) {
      return transportationData['london']
    }
    if (cityLower.includes('tokyo')) {
      return transportationData['tokyo']
    }
    if (cityLower.includes('new york') || cityLower.includes('nyc')) {
      return transportationData['new-york']
    }
    
    return null
  }

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <Bus className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trip selected</h3>
        <p className="mt-1 text-sm text-gray-500">Create a trip first to view transportation information.</p>
      </div>
    )
  }

  if (currentTrip.destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <Bus className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations added</h3>
        <p className="mt-1 text-sm text-gray-500">Add destinations to your trip to see transportation information.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transportation Information</h1>
        <p className="text-gray-600">Public transportation guides for your destinations</p>
      </div>

      <div className="space-y-6">
        {currentTrip.destinations.map(destination => {
          const transport = getTransportationForCity(destination.city)
          
          if (!transport) {
            return (
              <div key={destination.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {destination.city}, {destination.country}
                </h2>
                <div className="text-center py-8">
                  <Bus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Transportation information not available for this destination</p>
                </div>
              </div>
            )
          }

          return (
            <div key={destination.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {destination.city}, {destination.country}
              </h2>
              
              <div className="grid gap-6">
                {/* Metro/Subway */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Bus className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">{transport.metro.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{transport.metro.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Cost:</span>
                      <span className="ml-2 text-gray-600">{transport.metro.cost}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment:</span>
                      <span className="ml-2 text-gray-600">{transport.metro.paymentMethod}</span>
                    </div>
                    {transport.metro.lines && (
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Lines:</span>
                        <span className="ml-2 text-gray-600">{transport.metro.lines}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bus */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Bus className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium text-gray-900">{transport.bus.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{transport.bus.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Cost:</span>
                      <span className="ml-2 text-gray-600">{transport.bus.cost}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment:</span>
                      <span className="ml-2 text-gray-600">{transport.bus.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Airport Transportation */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Plane className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-medium text-gray-900">Airport Transportation</h3>
                  </div>
                  <div className="space-y-2">
                    {transport.airport.options.map((option, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{option}</span>
                        <div className="text-right">
                          <span className="text-gray-600">{transport.airport.costs[index]}</span>
                          <span className="text-gray-500 ml-2">({transport.airport.duration[index]})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apps */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Smartphone className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-medium text-gray-900">Recommended Apps</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {transport.apps.map((app, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-medium text-gray-900">Travel Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {transport.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Transportation }
