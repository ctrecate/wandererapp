import type { Attraction } from '@/types'

export const attractionsData: Record<string, Attraction[]> = {
  'paris': [
    {
      id: 'eiffel-tower',
      name: 'Eiffel Tower',
      description: 'Iconic iron lattice tower and symbol of Paris, offering panoramic city views.',
      category: 'Landmark',
      openingHours: '9:30 AM - 11:45 PM',
      cost: '€29.40 (elevator to top)',
      duration: '2-3 hours',
      howToGetThere: 'Metro: Bir-Hakeim (Line 6) or Trocadéro (Lines 6, 9)',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400'
    },
    {
      id: 'louvre',
      name: 'Louvre Museum',
      description: 'World\'s largest art museum, home to the Mona Lisa and thousands of masterpieces.',
      category: 'Museum',
      openingHours: '9:00 AM - 6:00 PM (closed Tuesdays)',
      cost: '€17 (online), €15 (at museum)',
      duration: '3-4 hours',
      howToGetThere: 'Metro: Palais-Royal Musée du Louvre (Lines 1, 7)',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
    },
    {
      id: 'notre-dame',
      name: 'Notre-Dame Cathedral',
      description: 'Gothic masterpiece and spiritual heart of Paris (currently under restoration).',
      category: 'Religious Site',
      openingHours: 'Currently closed for restoration',
      cost: 'Free (when open)',
      duration: '1-2 hours',
      howToGetThere: 'Metro: Cité (Line 4) or Saint-Michel (Line 4)',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400'
    },
    {
      id: 'arc-triomphe',
      name: 'Arc de Triomphe',
      description: 'Monumental arch honoring those who fought for France, with city views from the top.',
      category: 'Monument',
      openingHours: '10:00 AM - 10:30 PM',
      cost: '€13',
      duration: '1-2 hours',
      howToGetThere: 'Metro: Charles de Gaulle-Étoile (Lines 1, 2, 6)',
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400'
    }
  ],
  'london': [
    {
      id: 'big-ben',
      name: 'Big Ben & Houses of Parliament',
      description: 'Iconic clock tower and seat of the UK Parliament.',
      category: 'Landmark',
      openingHours: 'Tours available on Saturdays',
      cost: '£25 (tour)',
      duration: '1-2 hours',
      howToGetThere: 'Tube: Westminster (Circle, District, Jubilee lines)',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400'
    },
    {
      id: 'tower-bridge',
      name: 'Tower Bridge',
      description: 'Victorian bascule bridge with glass walkway offering Thames views.',
      category: 'Landmark',
      openingHours: '9:30 AM - 6:00 PM',
      cost: '£12.30',
      duration: '1-2 hours',
      howToGetThere: 'Tube: Tower Hill (Circle, District lines)',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400'
    },
    {
      id: 'british-museum',
      name: 'British Museum',
      description: 'World-famous museum with vast collections of art and antiquities.',
      category: 'Museum',
      openingHours: '10:00 AM - 5:00 PM',
      cost: 'Free',
      duration: '2-4 hours',
      howToGetThere: 'Tube: Tottenham Court Road (Central, Northern lines)',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
    }
  ],
  'tokyo': [
    {
      id: 'sensoji',
      name: 'Senso-ji Temple',
      description: 'Tokyo\'s oldest temple, a vibrant Buddhist temple in Asakusa.',
      category: 'Religious Site',
      openingHours: '6:00 AM - 5:00 PM',
      cost: 'Free',
      duration: '1-2 hours',
      howToGetThere: 'Train: Asakusa Station (Ginza, Asakusa lines)',
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1542640244-a10b6e5d1e2b?w=400'
    },
    {
      id: 'tokyo-skytree',
      name: 'Tokyo Skytree',
      description: 'Tallest structure in Japan with observation decks and shopping complex.',
      category: 'Observation Deck',
      openingHours: '8:00 AM - 10:00 PM',
      cost: '¥2,100 (Tembo Deck)',
      duration: '2-3 hours',
      howToGetThere: 'Train: Tokyo Skytree Station (Tobu Skytree Line)',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1542640244-a10b6e5d1e2b?w=400'
    }
  ],
  'new-york': [
    {
      id: 'statue-liberty',
      name: 'Statue of Liberty',
      description: 'Iconic symbol of freedom and democracy, accessible by ferry.',
      category: 'Monument',
      openingHours: '9:30 AM - 3:30 PM',
      cost: '$24.50 (ferry + pedestal)',
      duration: '3-4 hours',
      howToGetThere: 'Ferry from Battery Park or Liberty State Park',
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400'
    },
    {
      id: 'central-park',
      name: 'Central Park',
      description: 'Massive urban park in Manhattan with lakes, trails, and attractions.',
      category: 'Park',
      openingHours: '6:00 AM - 1:00 AM',
      cost: 'Free',
      duration: '2-4 hours',
      howToGetThere: 'Subway: Multiple stations around the park',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
    }
  ]
}

export function getAttractionsForCity(city: string): Attraction[] {
  const cityKey = city.toLowerCase().replace(/\s+/g, '-')
  
  // Try exact match first
  if (attractionsData[cityKey]) {
    return attractionsData[cityKey]
  }
  
  // Try partial matches for common city names
  const cityLower = city.toLowerCase()
  
  if (cityLower.includes('paris')) {
    return attractionsData['paris'] || []
  }
  if (cityLower.includes('london')) {
    return attractionsData['london'] || []
  }
  if (cityLower.includes('tokyo')) {
    return attractionsData['tokyo'] || []
  }
  if (cityLower.includes('new york') || cityLower.includes('nyc')) {
    return attractionsData['new-york'] || []
  }
  
  // Return some sample attractions for any other city
  return [
    {
      id: 'sample-attraction-1',
      name: 'City Center Plaza',
      description: 'The heart of the city with beautiful architecture and local culture.',
      category: 'Landmark',
      openingHours: '24/7',
      cost: 'Free',
      duration: '1-2 hours',
      howToGetThere: 'Located in the city center, accessible by public transport',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'
    },
    {
      id: 'sample-attraction-2',
      name: 'Local History Museum',
      description: 'Discover the rich history and culture of the region.',
      category: 'Museum',
      openingHours: '10:00 AM - 6:00 PM (closed Mondays)',
      cost: '$10-15',
      duration: '2-3 hours',
      howToGetThere: 'Metro: City Center Station, Bus: Route 5',
      rating: 4.1,
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
    }
  ]
}
