export interface MenuItem {
  id: string;
  name: string;
  category: 'starters' | 'seafood' | 'goan' | 'portuguese' | 'desserts' | 'cellar';
  price: number;
  description: string;
  recommended?: boolean;
  bestSeller?: boolean;
  seasonal?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'atmosphere' | 'cuisine' | 'heritage' | 'celebrations';
  imageUrl: string;
  description: string;
}

export interface ReservationData {
  guests: string;
  date: string;
  time: string;
  occasion: string;
  seating: 'indoor' | 'outdoor';
  name: string;
  phone: string;
  email: string;
  specialRequests?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  source: 'Google Review' | 'Michelin Guide' | 'Luxe Digest' | 'Goa Chronicle';
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  pricePerPerson: number;
  imageUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: 'Heritage' | 'Chef Recipes' | 'Wine Pairings' | 'Goan Ambiance';
}

export interface CareerPosition {
  id: string;
  title: string;
  department: 'Culinary' | 'Service' | 'Beverage' | 'Management';
  type: 'Full-Time' | 'Part-Time' | 'Seasonal';
  experienceRequired: string;
  description: string;
}
