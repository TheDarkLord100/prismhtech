// app/cart/page.tsx
"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/utils/store/useCartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartItem,
    getTotalItems,
    getTotalPrice
  } = useCartStore();

  const router = useRouter();

  const items = cart?.items || [];
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen justify-center py-8 px-4 pt-20 bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
        <div className="w-4/6 max-w-7xl flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDE */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Cart Section */}
            <section className="bg-[#FFFAED] w-full rounded-2xl shadow-md p-6">
              <h2 className="text-4xl font-bold mb-3">Your Cart</h2>

              <div className="flex justify-end items-center pb-3 border-b border-gray-300">
                {/* <p className="text-sm text-blue-600 cursor-pointer">Select all Items</p> */}
                <span className="text-sm font-medium text-blue-600">Price</span>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-300">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 py-4">
                    {/* Left Section */}
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-28 h-24 rounded-md overflow-hidden border">
                        <Image src={item.product.productImages[0].image_url} alt={item.product.name} fill className="object-cover" />
                      </div>

                      {/* Item details */}
                      <div className="flex flex-col">
                        <h3 className="font-bold text-gray-600">{item.product.name}</h3>
                        <br />
                        <p className="text-xs text-gray-500">
                          {item.variant.name || "Default Variant"}
                        </p>

                        {/* Quantity & Actions */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 flex-wrap">
                          <div className="flex items-center border border-purple-500 rounded-full px-2 py-0.5 gap-2">
                            {/* Trash / Decrement */}
                            <button
                              className="text-gray-600 hover:text-red-500"
                              onClick={() => {
                                updateCartItem(item.id, item.quantity - 1);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Quantity */}
                            <span className="text-sm">{item.quantity}</span>

                            {/* Increase Button */}
                            <button
                              className="text-sm font-medium text-purple-600"
                              onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          {/* Actions */}
                          <span className="text-gray-400">|</span>
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              removeFromCart(item.id);
                            }}
                          >
                            Add to list
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="cursor-pointer">See more like this</span>
                          <span className="text-gray-400">|</span>
                          <span className="cursor-pointer">Share</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section Price */}
                    <div className="flex items-end pb-1">
                      <p className="text-lg font-semibold whitespace-nowrap mt-6">
                        ₹ {item.variant.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="flex justify-end border-t border-gray-300 pt-4 mt-4">
                <p className="text-lg font-semibold">
                  Total ({totalItems} items) :{" "}
                  <span className="font-bold">₹ {totalPrice.toFixed(1)}</span>
                </p>
              </div>
            </section>

            {/* Your Items Section */}
            {/* <section className="bg-[#FFFAED] w-full rounded-2xl shadow-md p-6">
              <h2 className="text-4xl font-bold mb-3">Your Items</h2>

              <div className="flex items-center gap-10 border-b border-gray-300 pb-2">
                <p className="text-lg font-semibold text-green-600 cursor-pointer border-b-2 border-green-600">
                  Select all items ({savedItems.length} items)
                </p>
                <p className="text-lg text-gray-600 cursor-pointer">Buy it again</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FFFAED] border rounded-2xl shadow-md p-4 flex flex-col items-start"
                  >
                    <div className="relative w-full h-52 rounded-xl overflow-hidden">
                      <Image src={item.img} alt={item.name} fill className="object-cover" />
                    </div>

                    <h3 className="mt-3 text-gray-800 font-medium">{item.name}</h3>
                    <p className="text-gray-700 text-base font-semibold">
                      ₹ {item.price} {item.unit}
                    </p>

                    <button
                      className="mt-3 border border-yellow-500 text-yellow-600 px-6 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-50"
                      onClick={() => {
                        // Move to cart
                        moveSavedToCart(item.id);
                      }}
                    >
                      Move to cart
                    </button>

                    <div className="mt-3 text-sm text-blue-600 flex flex-col gap-1">
                      <span className="cursor-pointer" onClick={() => removeSavedItem(item.id)}>
                        Delete
                      </span>
                      <span className="cursor-pointer">See more like this</span>
                    </div>
                  </div>
                ))}
              </div>
            </section> */}
          </div>

          {/* RIGHT SIDE (Total Box) */}
          <aside className="bg-[#FFFDEE] w-full lg:w-80 rounded-2xl shadow-md p-6 h-fit sticky top-6">
            <p className="text-lg font-semibold mb-4">
              Total ({totalItems} items) :{" "}
              <span className="font-bold text-xl">₹ {totalPrice.toFixed(1)}</span>
            </p>
            <br />

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-4xl font-medium text-lg">
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </main>
    </>
  );
}
