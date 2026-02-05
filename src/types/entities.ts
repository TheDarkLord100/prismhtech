export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}
export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  phone?: string | null;
  dob?: string | null;
  location?: string | null;
  gstin?: string | null;
  created_at?: string;
  email_verified?: boolean;
}
export interface Address {
  adr_id: string;
  name: string | null;
  phone: string | null;
  alt_phone?: string | null;
  address_l1: string | null;
  address_l2?: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country?: string | null;
  default?: boolean | null;
}
export interface Metal {
  id: string;
  name: string;
  unit: string;
  live_price: number;
  lot_size: number;
  minimum_quantity: number;
}