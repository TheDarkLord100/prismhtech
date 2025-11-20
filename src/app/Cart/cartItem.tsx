"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: any;
  updateCartItem: (id: string, newQty: number) => void;
  removeFromCart: (id: string) => void;
}

export default function CartItem({ item, updateCartItem, removeFromCart }: CartItemProps) {
  return (
    <div className="py-6">

      {/* Mobile layout: column */}
      <div className="flex flex-col gap-4 md:hidden">

        {/* Image */}
        <div className="relative w-full h-48 rounded-md overflow-hidden border">
          <Image
            src={item.product.productImages[0].image_url}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <h3 className="font-bold text-gray-600 text-lg">{item.product.name}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {item.variant.name || "Default Variant"}
          </p>

          {/* Price */}
          <p className="text-lg font-semibold text-gray-700 mt-2">
            ₹ {item.variant.price}
          </p>
        </div>

        {/* Options row */}
        <div className="flex items-center gap-3 text-sm text-gray-700 flex-wrap mt-2">
          <span
            className="cursor-pointer"
            onClick={() => removeFromCart(item.id)}
          >
            Add to list
          </span>
          <span className="text-gray-400">|</span>
          <span className="cursor-pointer">See more like this</span>
          <span className="text-gray-400">|</span>
          <span className="cursor-pointer">Share</span>
        </div>

        {/* Quantity box */}
        <div className="mt-2 flex items-center border border-purple-500 rounded-full px-2 py-1 w-fit gap-2">
          <button
            className="text-gray-600 hover:text-red-500"
            onClick={() => updateCartItem(item.id, item.quantity - 1)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <span>{item.quantity}</span>

          <button
            className="text-purple-600 font-medium"
            onClick={() => updateCartItem(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Desktop layout: row */}
      <div className="hidden md:flex justify-between items-start gap-4">

        {/* Left section: image + details */}
        <div className="flex gap-4">

          {/* Image */}
          <div className="relative w-28 h-24 rounded-md overflow-hidden border">
            <Image
              src={item.product.productImages[0].image_url}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start">
            <h3 className="font-bold text-gray-600">{item.product.name}</h3>

            <p className="text-xs text-gray-500 mt-1">
              {item.variant.name || "Default Variant"}
            </p>

            {/* Quantity controls */}
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-600 flex-wrap">
              <div className="flex items-center border border-purple-500 rounded-full px-2 py-0.5 gap-2">
                <button
                  className="text-gray-600 hover:text-red-500"
                  onClick={() => updateCartItem(item.id, item.quantity - 1)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <span>{item.quantity}</span>

                <button
                  className="text-purple-600 font-medium"
                  onClick={() => updateCartItem(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Options on separate line */}
            <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap mt-3">
              <span className="cursor-pointer" onClick={() => removeFromCart(item.id)}>Add to list</span>
              <span className="text-gray-400">|</span>

              <span className="cursor-pointer">See more like this</span>
              <span className="text-gray-400">|</span>

              <span className="cursor-pointer">Share</span>
            </div>
          </div>
        </div>

        {/* Right: Price */}
        <div className="flex items-start">
          <p className="text-lg font-semibold whitespace-nowrap mt-1">
            ₹ {item.variant.price}
          </p>
        </div>
      </div>
    </div>
  );
}
