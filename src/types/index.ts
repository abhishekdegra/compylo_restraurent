export interface MenuItem {
  id: string
  name: string
  subtitle?: string
  description: string
  price: string
  category: 'starters' | 'mains' | 'desserts' | 'cocktails' | 'tasting'
  image: string
  tags?: string[]
  isChefSpecial?: boolean
  isVeg?: boolean
  calories?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  publication?: string
  quote: string
  rating: number
  date: string
}

export interface GalleryImage {
  id: string
  title: string
  category: string
  image: string
  span?: string
}

export interface ReservationData {
  name: string
  phone: string
  email: string
  guests: string
  date: string
  time: string
  seatingArea: 'main-dining' | 'chef-counter' | 'private-salon' | 'terrace'
  specialRequests?: string
}

