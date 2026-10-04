/**
 * Restaurant Reservation & Ordering Mobile Application
 * Core Data Models & Schemas
 */

export type CuisineType = 'all' | 'khmer' | 'western' | 'chinese' | 'drinks';

export interface SavedCard {
  id: string;
  card_holder: string;
  brand: 'visa' | 'mastercard' | 'jcb' | 'unionpay';
  last4: string;
  exp_month: string;
  exp_year: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_image?: string;
  address?: string;
  saved_card?: SavedCard;
  created_at: string;
}

export interface Cuisine {
  id: string;
  slug: CuisineType;
  name: string;
  localName?: string;
  description: string;
  item_count: number;
}

export interface Category {
  id: string;
  cuisine_id: string;
  name: string;
  description: string;
}

export interface ProductOptionSize {
  id: 'small' | 'regular' | 'large';
  name: string;
  priceDelta: number;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  category_id: string;
  cuisine_id: string;
  name: string;
  local_name?: string;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  review_count: number;
  is_available: boolean;
  is_popular?: boolean;
  is_recommended?: boolean;
  is_special_offer?: boolean;
  discount_percent?: number;
  preparation_time_minutes: number;
  spice_level?: number; // 0: None, 1: Mild, 2: Medium, 3: Authentic Hot
  dietary_tags?: ('gluten_free' | 'vegetarian' | 'halal' | 'chef_signature')[];
  sizes: ProductOptionSize[];
  add_ons: ProductAddOn[];
}

export interface CartItem {
  id: string; // unique item instance id
  product: Product;
  selectedSize: ProductOptionSize;
  selectedAddOns: ProductAddOn[];
  selectedSpiceLevel?: number;
  specialInstructions?: string;
  quantity: number;
  itemTotal: number;
}

export type OrderType = 'dine_in' | 'takeaway';
export type PaymentMethod = 'cash' | 'khqr' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  order_type: OrderType;
  table_number?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  tip?: number;
  split_count?: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  special_request?: string;
  created_at: string;
  estimated_minutes: number;
}

export type TableType = 'standard' | 'window' | 'vip_room' | 'outdoor';
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface Table {
  id: string;
  table_number: string;
  table_type: TableType;
  area_name: 'Window Area' | 'Main Dining Hall' | 'VIP Lounge' | 'Garden Terrace';
  capacity: number;
  status: TableStatus;
  ambiance_description?: string;
  x: number; // grid position x
  y: number; // grid position y
  width: number;
  height: number;
}

export type ReservationType = 'table' | 'private_room' | 'event' | 'whole_restaurant';
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'seated' | 'completed' | 'cancelled' | 'rejected' | 'no_show';

export interface ExtraReservationService {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Reservation {
  id: string;
  booking_id: string;
  user_id: string;
  table_id: string;
  table_number: string;
  reservation_type: ReservationType;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  extra_services: ExtraReservationService[];
  special_request?: string;
  deposit_amount: number;
  deposit_required: boolean;
  deposit_paid: boolean;
  status: ReservationStatus;
  qr_code_data: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  order_id?: string;
  reservation_id?: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_reference: string;
  paid_at: string;
}
