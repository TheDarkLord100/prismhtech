"use client";

import Image from "next/image";
import { useState } from "react";

type ProductCardProps = {
  name: string;
  price: number;
  img: string;
};

export default function ProductCard({ name, price, img }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const total = (qty * price).toFixed(1);

  return (
    <div className="bg-[#FFFAED] rounded-3xl shadow-lg overflow-hidden w-[280px]">
      {/* Image Section */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative w-full h-[200px]">
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex h-[85px]">
        {/* Left: Title + Price */}
        <div className="w-[60%] px-3 py-2 flex flex-col justify-center">
          <h3 className="text-gray-800 text-sm font-medium">{name}</h3>
          <p className="text-gray-900 text-lg font-bold mt-1">
            ₹ {price} per Kg
          </p>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300" />

        {/* Right: Qty + Total */}
        <div className="w-[40%] px-2 py-2 flex flex-col justify-center items-center">
          <div className="flex items-center bg-purple-600 rounded-md overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
            >
              -
            </button>
            <span className="w-9 h-[22px] flex items-center justify-center bg-white text-purple-600 font-semibold text-sm select-none">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
            >
              +
            </button>
          </div>

          <p className="text-gray-700 text-xs mt-1">
            Total: <span className="font-semibold text-black">₹ {total}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
