"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: any;
  updateCartItem: (id: string, newQty: number) => void;
  removeFromCart: (id: string) => void;
}

export default function CartItem({
  item,
  updateCartItem,
  removeFromCart,
}: CartItemProps) {
  const isMetal = item.item_type === "metal";

  /* ---------------- Product image (products only) ---------------- */
  const imageUrl =
    !isMetal &&
    item.product?.productImages &&
    item.product.productImages.length > 0
      ? item.product.productImages[0].image_url
      : "/Assets/no_image.png";

  /* ---------------- Metal helpers ---------------- */
  const unit = isMetal ? item.metal.unit : null;
  const lotSize = isMetal ? item.metal.lot_size : null;

  // quantity is STORED IN UNITS
  const quantityUnits = item.quantity;

  const canDecrement =
    !isMetal || quantityUnits > item.metal.minimum_quantity;

  /* ---------------- Quantity controls ---------------- */
  const QuantityControls = (
    <div className="flex items-center border border-yellow-400 rounded-full px-2 py-1 w-fit gap-2">
      <button
        className="text-gray-600 hover:text-red-500 disabled:opacity-40"
        disabled={!canDecrement}
        onClick={() => {
          if (isMetal) {
            updateCartItem(item.id, quantityUnits - lotSize);
          } else {
            updateCartItem(item.id, quantityUnits - 1);
          }
        }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <span className="text-sm font-medium">
        {isMetal ? `${quantityUnits} ${unit}` : quantityUnits}
      </span>

      <button
        className="text-yellow-400 font-medium"
        onClick={() => {
          if (isMetal) {
            updateCartItem(item.id, quantityUnits + lotSize);
          } else {
            updateCartItem(item.id, quantityUnits + 1);
          }
        }}
      >
        +
      </button>
    </div>
  );

  /* ---------------- Prices ---------------- */
  const unitPrice = isMetal ? item.unit_price : item.variant.price;
  const totalPrice = isMetal
    ? unitPrice * quantityUnits
    : unitPrice * quantityUnits;

  return (
    <div className="py-6">
      {/* ---------------- Mobile layout ---------------- */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* Image (products only) */}
        {!isMetal && (
          <div className="relative w-full h-48 rounded-md overflow-hidden border">
            <Image
              src={imageUrl}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Details */}
        <div>
          <h3 className="font-bold text-gray-700 text-lg">
            {isMetal ? item.metal.name : item.product.name}
          </h3>

          {!isMetal && (
            <p className="text-xs text-gray-500 mt-1">
              {item.variant.name || "Default Variant"}
            </p>
          )}

          {/* Metal info */}
          {isMetal && (
            <p className="text-xs text-gray-500 mt-1">
              Lot size: {item.metal.lot_size} {unit}
            </p>
          )}

          {/* Price */}
          <p className="text-lg font-semibold text-gray-800 mt-2">
            ₹ {totalPrice.toLocaleString("en-IN")}
          </p>

          {isMetal && (
            <p className="text-xs text-gray-500">
              ₹ {unitPrice.toLocaleString("en-IN")} / {unit}
            </p>
          )}
        </div>

        {QuantityControls}

        <div className="flex items-center gap-3 text-sm text-gray-700 mt-2">
          <span
            className="cursor-pointer"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </span>
        </div>
      </div>

      {/* ---------------- Desktop layout ---------------- */}
      <div className="hidden md:flex justify-between items-start gap-4">
        {/* Left */}
        <div className="flex gap-4">
          {!isMetal && (
            <div className="relative w-28 h-24 rounded-md overflow-hidden border">
              <Image
                src={imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col justify-start">
            <h3 className="font-bold text-gray-700">
              {isMetal ? item.metal.name : item.product.name}
            </h3>

            {!isMetal && (
              <p className="text-xs text-gray-500 mt-1">
                {item.variant.name || "Default Variant"}
              </p>
            )}

            {isMetal && (
              <p className="text-xs text-gray-500 mt-1">
                Lot size: {item.metal.lot_size} {unit}
              </p>
            )}

            <div className="mt-3">{QuantityControls}</div>

            <div className="flex items-center gap-3 text-xs text-gray-600 mt-3">
              <span
                className="cursor-pointer"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </span>
            </div>
          </div>
        </div>

        {/* Right price */}
        <div className="flex items-start text-right">
          <div>
            <p className="text-lg font-semibold whitespace-nowrap">
              ₹ {totalPrice.toLocaleString("en-IN")}
            </p>

            {isMetal && (
              <p className="text-xs text-gray-500">
                ₹ {unitPrice.toLocaleString("en-IN")} / {unit}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
