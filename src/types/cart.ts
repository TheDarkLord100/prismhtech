import type { Product, Variant } from "./product";
import type { Metal } from "./entities";

export interface Cart {
    id: string;
}

export interface CartItem {
    id: string;
    cart_id?: string | null;
    item_type: "product" | "metal";
    product_id?: string | null;
    variant_id?: string | null;
    quantity: number;

    metal_id?: string | null;
    unit_price?: number | null;
}

export interface CartItemDetails extends CartItem {
    product?: Product;
    variant?: Variant;

    metal?: Metal;
}

export interface CartWithItems extends Cart {
    items: CartItemDetails[];
}
