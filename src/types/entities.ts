export interface Variant {
  id: string;
  name: string; 
  price?: number; 
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
  variants?: Variant[];
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
