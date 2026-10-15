export type Sector = 'crafts' | 'profs';

export interface ProviderOffer {
  active: boolean;
  title: string;
  badge?: string;
}

export interface Provider {
  id: string;
  name: string;
  nick: string;
  prof: string;
  sector: Sector;
  category?: string;
  village: string;
  street: string;
  phone: string;
  phoneWa: string;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  verified: boolean;
  photo?: string;
  photos?: string[];
  lat?: number;
  lng?: number;
  mapUrl?: string;
  price?: string;
  exp?: string;
  specialty?: string;
  tools?: string[];
  email?: string;
  office?: string;
  location?: string;
  offer?: ProviderOffer;
  createdAt?: number;
}

export interface User {
  phone: string;
  name: string;
  password?: string;
  createdAt: number;
  isBlocked?: boolean;
}

export interface Appointment {
  id: string | number;
  craftId: string;
  craftNick: string;
  day: string;
  time: string;
  rawDate: string;
  rawTime: string;
  custName: string;
  custPhone: string;
  custAddr: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  code: string;
  notes?: string;
  createdAt?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'craftsman';
  text: string;
  timestamp: number;
  timeStr: string;
  unreadClient?: boolean;
  unreadCraftsman?: boolean;
}

export interface ChatMeta {
  chatId: string;
  craftsmanId: string;
  craftsmanNick: string;
  clientPhone: string;
  clientName: string;
  lastMessage: string;
  updatedAt: number;
  unreadClient?: boolean;
  unreadCraftsman?: boolean;
}

export interface Complaint {
  id: string | number;
  phone: string;
  name: string;
  craftsmanInfo: string;
  text: string;
  createdAt: number;
  dateStr: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface Review {
  id: string;
  craftId: string;
  userPhone: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: number;
}

export interface FilterState {
  searchQuery: string;
  profession: string;
  village: string;
  sector: Sector | 'all';
}
