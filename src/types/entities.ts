// src/types.ts
export interface Variant {
  id: string;
  name: string;   // e.g., "Small", "Red", "64GB"
  price?: number; // optional extra price if variable
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[]; // multiple image URLs
  priceType: "fixed" | "variable";
  price: number; // base price (for fixed), or starting price (for variable)
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