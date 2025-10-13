export interface Variant {
  pvr_id: string;           // UUID
  created_at: string;       // ISO timestamp
  product_id: string | null;
  name: string | null;
  price: number | null;
  quantity: number | null;
}

export type OrderItem = {
  id: number;
  name: string;
  image: string;
  status: "Ordered" | "Shipped" | "Arriving";
  statusDate: string;
};

export type Order = {
  orderId: string;
  datePlaced: string;
  total: string;
  shipTo: string;
  deliveryExpected?: string;
  deliveredDate?: string;
  items: OrderItem[];
};

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  priority?: number;
};

export interface Product {
  id: string;
  name: string;
  description?: string;
  productImages: ProductImage[];  // rename images -> productImages
  priceType: "fixed" | "variable";
  price: number;
  ProductVariants: Variant[];
  relatedProducts?: Product[];    // optional array
};

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
  id: string; 
}

export interface CartItem {
  id: string;
  cart_id?: string | null;
  product_id?: string | null;
  variant_id?: string | null;
  quantity: number;
}

export interface CartItemDetails extends CartItem {
  product: Product;
  variant: Variant;
}

export interface CartWithItems extends Cart {
  items: CartItemDetails[];
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