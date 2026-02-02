export interface Product {
  id: string;
  name: string;
  description?: string;
  productImages: ProductImage[];
  ProductVariants: Variant[];
  relatedProducts?: Product[];
};

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  priority?: number;
};

export interface Variant {
  pvr_id: string;           
  created_at: string;      
  product_id: string | null;
  name: string | null;
  price: number | null;
}