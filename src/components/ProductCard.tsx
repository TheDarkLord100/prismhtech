// components/ProductCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  id?: string;
  name: string;
  price: number;
  img: string;
  onClick?: () => void; // still supported if you want custom click
};

export default function ProductCard({ id, name, price, img, onClick }: ProductCardProps) {
  const [qty, setQty] = useState(0);
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // let parent handle if provided
    } else if (id) {
      router.push(`/ProductDetails/${id}`); // ✅ navigate to details
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
          {img ? (
            <Image src={img} alt={name} fill className="object-cover rounded-xl" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-[85px]">
        {/* Title + Price */}
        <div className="w-[60%] px-3 py-2 flex flex-col justify-center">
          <h3 className="text-gray-800 text-sm font-medium">{name}</h3>
          <p className="text-gray-900 text-lg font-bold mt-1">₹ {price} per Kg</p>
        </div>

        <div className="w-px bg-gray-300" />

        {/* Qty / Add */}
        <div className="w-[40%] px-2 py-2 flex flex-col justify-center items-center">
          {qty === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // stop navigation
                setQty(1);
              }}
              className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md shadow"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center bg-gradient-to-b from-green-800 to-green-400 rounded-md overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQty((q) => Math.max(0, q - 1));
                }}
                className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
              >
                -
              </button>

              <span className="w-9 h-[22px] flex items-center justify-center bg-white text-green-700 font-semibold text-sm select-none">
                {qty}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQty((q) => q + 1);
                }}
                className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
