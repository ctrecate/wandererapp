export interface Trip {
  id: string;
  name: string;
  destinations: Destination[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  startDate: Date;
  endDate: Date;
  coordinates?: { lat: number; lng: number; };
  attractions?: Attraction[];
  restaurants?: Restaurant[];
  transportation?: TransportationInfo;
  customExcursions?: CustomExcursion[];
}

export interface Weather {
  date: string;
  temperature: { high: number; low: number; };
  condition: string;
  precipitation: number;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  category: string;
  openingHours: string;
  cost: string;
  duration: string;
  howToGetThere: string;
  isPlanned?: boolean;
  isCompleted?: boolean;
  rating?: number;
  imageUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: number; // 1-4
  rating: number;
  mustTryDishes: string[];
  address: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  isBookmarked?: boolean;
  photoUrl?: string;
}

export interface CustomExcursion {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  cost?: number;
  confirmationDetails?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface TransportationInfo {
  city: string;
  metroSystem?: {
    name: string;
    description: string;
    cost: string;
    paymentMethod: string;
  };
  busSystem?: {
    name: string;
    description: string;
    cost: string;
    paymentMethod: string;
  };
  airportTransport?: {
    options: string[];
    costs: string[];
    duration: string[];
  };
  apps: string[];
  tips: string[];
}

export interface OutfitRecommendation {
  id: string;
  weatherCondition: string;
  temperature: { min: number; max: number; };
  destinationType: string;
  items: {
    tops: string[];
    bottoms: string[];
    outerwear: string[];
    shoes: string[];
    accessories: string[];
  };
  tips: string[];
}

export interface PackingList {
  destination: string;
  weather: Weather[];
  outfitRecommendations: OutfitRecommendation[];
  essentials: string[];
  electronics: string[];
  documents: string[];
  toiletries: string[];
}

export type TabType = 'dashboard' | 'destinations' | 'weather' | 'outfits' | 'attractions' | 'transportation' | 'excursions' | 'restaurants' | 'api-test' | 'places-debug';

export interface AppState {
  currentTrip: Trip | null;
  activeTab: TabType;
  isLoading: boolean;
  error: string | null;
}
