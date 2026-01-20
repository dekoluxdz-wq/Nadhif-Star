
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  priceStart: number;
  icon: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
}

export interface BookingDetails {
  serviceId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  wilaya: string;
  address: string;
}

export interface Booking extends BookingDetails {
  id: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  trackingStatus: 'confirmed' | 'assigned' | 'in_progress' | 'completed';
  createdAt: string;
  serviceTitle: string; // Storing title for easier display
  rating?: number;
  review?: string;
  price: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  isTyping?: boolean;
}

export interface Address {
  id: string;
  label: string;
  wilaya: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'offer' | 'system';
  read: boolean;
}

export interface NotificationPreferences {
  bookingReminders: boolean;
  specialOffers: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  addresses: Address[];
  preferences?: NotificationPreferences;
}

export interface PaymentMethodConfig {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string; // 'Wallet' | 'CreditCard'
}

export interface AppConfig {
  identity: {
    appNameAr: string;
    appNameEn: string;
    logoUrl: string | null; // If null, uses the default SVG logo
    taglineAr: string;
    taglineEn: string;
    descriptionAr: string;
    descriptionEn: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
    website: string;
  };
  currency: {
    code: string;
    symbolAr: string;
    symbolEn: string;
  };
  locations: string[];
  paymentMethods: PaymentMethodConfig[];
  services: ServiceItem[];
}
