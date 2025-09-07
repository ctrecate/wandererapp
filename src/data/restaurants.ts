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
  return restaurantsData[cityKey] || []
}
