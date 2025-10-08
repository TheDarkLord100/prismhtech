export interface Variant {
  pvr_id: string;           // UUID
  created_at: string;       // ISO timestamp
  product_id: string | null;
  name: string | null;
  price: number | null;
  quantity: number | null;
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  priority?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: ProductImage[]; 
  priceType: "fixed" | "variable";
  price: number;
  variants?: Variant[];
}

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

export interface Cart {
  id: string; // UUID
  created_at: string; // ISO timestamp
  user_id?: string | null; // nullable UUID
}

export interface CartItem {
  id: string; // UUID
  created_at: string; // ISO timestamp
  cart_id?: string | null;
  product_id?: string | null;
  variant_id?: string | null;
  quantity: number;
}

