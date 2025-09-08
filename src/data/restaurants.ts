import type { Restaurant } from '@/types'

export const restaurantsData: Record<string, Restaurant[]> = {
  'paris': [
    {
      id: 'le-comptoir',
      name: 'Le Comptoir du Relais',
      cuisine: 'French Bistro',
      priceRange: 3,
      rating: 4.5,
      mustTryDishes: ['Duck confit', 'Crème brûlée', 'Escargot'],
      address: '9 Carrefour de l\'Odéon, 75006 Paris',
      phone: '+33 1 44 27 07 50',
      openingHours: '12:00 PM - 11:00 PM',
      isBookmarked: false
    },
    {
      id: 'l-ami-jean',
      name: 'L\'Ami Jean',
      cuisine: 'Modern French',
      priceRange: 4,
      rating: 4.7,
      mustTryDishes: ['Risotto', 'Pork belly', 'Chocolate mousse'],
      address: '27 Rue Malar, 75007 Paris',
      phone: '+33 1 47 05 86 89',
      openingHours: '7:00 PM - 10:30 PM (closed Sundays)',
      isBookmarked: false
    },
    {
      id: 'breizh-cafe',
      name: 'Breizh Café',
      cuisine: 'Crêperie',
      priceRange: 2,
      rating: 4.3,
      mustTryDishes: ['Galette complète', 'Crêpe Suzette', 'Cider'],
      address: '109 Rue Vieille du Temple, 75003 Paris',
      phone: '+33 1 42 72 13 77',
      openingHours: '11:30 AM - 11:00 PM',
      isBookmarked: false
    },
    {
      id: 'le-bistrot-paul-bert',
      name: 'Le Bistrot Paul Bert',
      cuisine: 'Traditional French',
      priceRange: 3,
      rating: 4.4,
      mustTryDishes: ['Steak frites', 'Tarte tatin', 'Wine selection'],
      address: '18 Rue Paul Bert, 75011 Paris',
      phone: '+33 1 43 72 24 01',
      openingHours: '12:00 PM - 2:00 PM, 7:30 PM - 11:00 PM (closed weekends)',
      isBookmarked: false
    },
    {
      id: 'l-as-du-fallafel',
      name: 'L\'As du Fallafel',
      cuisine: 'Middle Eastern',
      priceRange: 1,
      rating: 4.2,
      mustTryDishes: ['Falafel sandwich', 'Hummus', 'Sabich'],
      address: '34 Rue des Rosiers, 75004 Paris',
      phone: '+33 1 48 87 63 60',
      openingHours: '11:00 AM - 11:30 PM (closed Saturdays)',
      isBookmarked: false
    }
  ],
  'london': [
    {
      id: 'dishoom',
      name: 'Dishoom',
      cuisine: 'Indian',
      priceRange: 2,
      rating: 4.6,
      mustTryDishes: ['Black daal', 'Chicken ruby', 'Gunpowder potatoes'],
      address: '12 Upper St Martin\'s Ln, London WC2H 9FB',
      phone: '+44 20 7420 9320',
      openingHours: '8:00 AM - 11:00 PM',
      isBookmarked: false
    },
    {
      id: 'the-wolseley',
      name: 'The Wolseley',
      cuisine: 'European',
      priceRange: 4,
      rating: 4.4,
      mustTryDishes: ['Afternoon tea', 'Wiener schnitzel', 'Apple strudel'],
      address: '160 Piccadilly, St. James\'s, London W1J 9EB',
      phone: '+44 20 7499 6996',
      openingHours: '7:00 AM - 12:00 AM',
      isBookmarked: false
    },
    {
      id: 'borough-market',
      name: 'Borough Market',
      cuisine: 'Food Market',
      priceRange: 2,
      rating: 4.5,
      mustTryDishes: ['Artisan cheeses', 'Fresh oysters', 'Gourmet sandwiches'],
      address: '8 Southwark St, London SE1 1TL',
      phone: '+44 20 7407 1002',
      openingHours: '10:00 AM - 5:00 PM (Thu-Sat)',
      isBookmarked: false
    },
    {
      id: 'rules-restaurant',
      name: 'Rules Restaurant',
      cuisine: 'Traditional British',
      priceRange: 4,
      rating: 4.3,
      mustTryDishes: ['Roast beef', 'Game pie', 'Sticky toffee pudding'],
      address: '35 Maiden Ln, London WC2E 7LB',
      phone: '+44 20 7836 5314',
      openingHours: '12:00 PM - 11:30 PM',
      isBookmarked: false
    },
    {
      id: 'padella',
      name: 'Padella',
      cuisine: 'Italian',
      priceRange: 2,
      rating: 4.7,
      mustTryDishes: ['Pici cacio e pepe', 'Pappardelle with beef shin', 'Tiramisu'],
      address: '6 Southwark St, London SE1 1TQ',
      phone: '+44 20 7403 2151',
      openingHours: '12:00 PM - 10:00 PM',
      isBookmarked: false
    }
  ],
  'tokyo': [
    {
      id: 'sukiyabashi-jiro',
      name: 'Sukiyabashi Jiro',
      cuisine: 'Sushi',
      priceRange: 4,
      rating: 4.8,
      mustTryDishes: ['Omakase sushi', 'Tuna sashimi', 'Tamago'],
      address: 'Tsukamoto Sogyo Building, 2-15-4 Ginza, Chuo City, Tokyo',
      phone: '+81 3-3535-3600',
      openingHours: '11:30 AM - 2:00 PM, 5:00 PM - 8:30 PM',
      isBookmarked: false
    },
    {
      id: 'ramen-nagayama',
      name: 'Ramen Nagayama',
      cuisine: 'Ramen',
      priceRange: 1,
      rating: 4.5,
      mustTryDishes: ['Tonkotsu ramen', 'Chashu pork', 'Ajitama egg'],
      address: '2-14-3 Shibuya, Shibuya City, Tokyo',
      phone: '+81 3-3464-5577',
      openingHours: '11:00 AM - 3:00 AM',
      isBookmarked: false
    }
  ],
  'new-york': [
    {
      id: 'peter-luger',
      name: 'Peter Luger Steak House',
      cuisine: 'Steakhouse',
      priceRange: 4,
      rating: 4.4,
      mustTryDishes: ['Porterhouse steak', 'Creamed spinach', 'German potatoes'],
      address: '178 Broadway, Brooklyn, NY 11249',
      phone: '+1 718-387-7400',
      openingHours: '11:45 AM - 9:45 PM',
      isBookmarked: false
    },
    {
      id: 'joe-shanghai',
      name: 'Joe\'s Shanghai',
      cuisine: 'Chinese',
      priceRange: 2,
      rating: 4.2,
      mustTryDishes: ['Soup dumplings', 'Pork buns', 'Hot and sour soup'],
      address: '9 Pell St, New York, NY 10013',
      phone: '+1 212-233-8888',
      openingHours: '11:00 AM - 10:00 PM',
      isBookmarked: false
    }
  ]
}

export function getRestaurantsForCity(city: string): Restaurant[] {
  const cityKey = city.toLowerCase().replace(/\s+/g, '-')
  
  // Try exact match first
  if (restaurantsData[cityKey]) {
    return restaurantsData[cityKey]
  }
  
  // Try partial matches for common city names
  const cityLower = city.toLowerCase()
  
  if (cityLower.includes('paris')) {
    return restaurantsData['paris'] || []
  }
  if (cityLower.includes('london')) {
    return restaurantsData['london'] || []
  }
  if (cityLower.includes('tokyo')) {
    return restaurantsData['tokyo'] || []
  }
  if (cityLower.includes('new york') || cityLower.includes('nyc')) {
    return restaurantsData['new-york'] || []
  }
  
  // Return some sample restaurants for any other city
  return [
    {
      id: 'sample-restaurant-1',
      name: 'Local Cuisine Restaurant',
      cuisine: 'Local',
      priceRange: 2,
      rating: 4.2,
      mustTryDishes: ['Local specialty', 'Traditional dish', 'Regional favorite'],
      address: 'Main Street, City Center',
      phone: '+1 (555) 123-4567',
      openingHours: '11:00 AM - 10:00 PM',
      isBookmarked: false
    },
    {
      id: 'sample-restaurant-2',
      name: 'International Bistro',
      cuisine: 'International',
      priceRange: 3,
      rating: 4.4,
      mustTryDishes: ['Chef\'s special', 'Signature dish', 'Popular choice'],
      address: 'Downtown District',
      phone: '+1 (555) 987-6543',
      openingHours: '12:00 PM - 11:00 PM',
      isBookmarked: false
    }
  ]
}
