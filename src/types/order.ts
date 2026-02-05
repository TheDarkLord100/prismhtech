import type { Product, Variant } from "./product";
import type { Address, Metal } from "./entities";

export type OrderItem = {
  id: string;
  created_at: string;
  ordr_id: string;

  item_type: "product" | "metal";


  product_id?: string | null;
  variant_id?: string | null;

  metal_id?: string | null;
  
  quantity: number;

  price: number;
  product?: Product | null;
  variant?: Variant | null;
  metal?: Metal | null;
};



export type Order = {
  id: string;
  created_at: string;

  user_id: string;

  subtotal_amount: number;
  gst_rate: number;
  gst_type: "CGST_SGST" | "IGST";
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_amount: number;

  payment_status: string;
  payment_type: string | null;
  razorpay_order_id: string | null;

  status: string;
  status_description: string | null;

  shipping_address_id: string | null;
  billing_address_id: string | null;

  shipping_address?: Address | null;
  billing_address?: Address | null;

  items?: OrderItem[];

  history?: OrderStatusHistory[];
};

export type OrderStatusHistory = {
  id: string;
  order_id: string;

  old_status: string | null;
  new_status: string;

  changed_at: string;
  changed_by: string | null;

  note: string | null;
};