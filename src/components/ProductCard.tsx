"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/utils/store/useCartStore";
import type { Product } from "@/types/entities";

type ProductCardProps = {
  product: Product
  onClick?: () => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, cart, updateCartItem } = useCartStore();

  const defaultVariant = product.ProductVariants?.[0] || null;
  const itemPresentInCart = cart?.items?.find((item) => item.product.id === product.id) || null;
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/ProductDetails/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#FFFAED] rounded-3xl shadow-lg overflow-hidden w-[280px] cursor-pointer"
      role="button"
    >
      <div className="px-3 pt-3 pb-1">
        <div className="relative w-full h-[200px]">
          <Image src={product.productImages?.[0]?.image_url ?? "/Assets/category1.png"} alt={product.name} fill className="object-cover rounded-xl" />
        </div>
      </div>

      <div className="flex ">
        <div className="w-[60%] px-3 py-2 flex flex-col justify-center">
          <h3 className="text-gray-800 text-sm font-medium">{product.name}</h3>
          {defaultVariant ? (
            <>
              <p className="text-gray-800 text-xs">
                {defaultVariant.name}
              </p>
              <p className="text-gray-900 text-lg font-bold mt-1">
                ₹ {defaultVariant.price}
              </p>
            </>
          ) : (
            <p className="text-red-500 text-sm mt-1">
              Variant unavailable
            </p>
          )}
        </div>  

        <div className="w-[40%] px-2 py-2 flex flex-col justify-center items-center">
          {itemPresentInCart ? (
            <div
              className="flex items-center bg-gradient-to-b from-green-800 to-green-400 rounded-md overflow-hidden"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartItem(itemPresentInCart.id, itemPresentInCart.quantity - 1);
                }}
                className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
              >
                -
              </button>

              <span className="w-9 h-[22px] flex items-center justify-center bg-white text-green-700 font-semibold text-sm select-none">
                {itemPresentInCart.quantity}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartItem(itemPresentInCart.id, itemPresentInCart.quantity + 1);
                }}

                className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, defaultVariant, 1);
              }}
              className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md shadow"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
