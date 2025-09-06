"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Aluminum Scrap",
      price: 23.6,
      unit: "per Kg",
      qty: 2,
      img: "/partners/partner.png",
      delivery: "Tomorrow, 28 Aug",
      checked: true,
    },
    {
      id: 2,
      name: "Gold Scrap",
      price: 27.6,
      unit: "per Kg",
      qty: 2,
      img: "/partners/partner.png",
      delivery: "Tomorrow, 28 Aug",
      checked: false,
    },
  ]);

  const subtotal = items
    .filter((item) => item.checked)
    .reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen justify-center py-8 px-4 pt-20 bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
        <div className="w-4/6 max-w-7xl flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDE */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Cart Section */}
            <section className="bg-[#FFFAED] w-full rounded-2xl shadow-md p-6">
              {/* Main Heading */}
              <h2 className="text-4xl font-bold mb-3">Your Cart</h2>

              {/* Row: Select All + Price */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                <p className="text-sm text-blue-600 cursor-pointer">
                  Select all Items
                </p>
                <span className="text-sm font-medium text-blue-600">Price</span>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-300">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-4 py-4"
                  >
                    {/* Left Section */}
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {
                          setItems((prev) =>
                            prev.map((it) =>
                              it.id === item.id
                                ? { ...it, checked: !it.checked }
                                : it
                            )
                          );
                        }}
                        className="w-5 h-5 accent-purple-600 mt-2"
                      />

                      {/* Image */}
                      <div className="relative w-28 h-24 rounded-md overflow-hidden border">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Item details */}
                      <div className="flex flex-col">
                        <h3 className="font-bold text-gray-600">{item.name}</h3>
                        <br />
                        <p className="text-xs text-gray-500">
                          Delivery by{" "}
                          <span className="font-semibold">
                            {item.delivery}
                          </span>
                        </p>

                        {/* Quantity & Actions */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 flex-wrap">
                          {/* Quantity Control (Smaller) */}
                          <div className="flex items-center border border-purple-500 rounded-full px-2 py-0.5 gap-2">
                            {/* Decrement / Trash */}
                            <button
                              className="text-gray-600 hover:text-red-500"
                              onClick={() =>
                                setItems((prev) =>
                                  prev
                                    .map((it) =>
                                      it.id === item.id
                                        ? {
                                            ...it,
                                            qty:
                                              it.qty > 1
                                                ? it.qty - 1
                                                : it.qty,
                                          }
                                        : it
                                    )
                                    .filter(
                                      (it) =>
                                        !(it.id === item.id && it.qty === 1)
                                    )
                                )
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Quantity Number */}
                            <span className="text-sm">{item.qty}</span>

                            {/* Increase Button */}
                            <button
                              className="text-sm font-medium text-purple-600"
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((it) =>
                                    it.id === item.id
                                      ? { ...it, qty: it.qty + 1 }
                                      : it
                                  )
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          {/* Actions with separators */}
                          <span className="text-gray-400">|</span>
                          <span className="cursor-pointer">Save for later</span>
                          <span className="text-gray-400">|</span>
                          <span className="cursor-pointer">
                            See more like this
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="cursor-pointer">Share</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section Price (aligned with delivery text) */}
                    <div className="flex items-end pb-1">
                      <p className="text-lg font-semibold whitespace-nowrap mt-6">
                        ₹ {item.price} {item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="flex justify-end border-t border-gray-300 pt-4 mt-4">
                <p className="text-lg font-semibold">
                  Subtotal ({items.filter((i) => i.checked).length} items) :{" "}
                  <span className="font-bold">${subtotal.toFixed(1)}</span>
                </p>
              </div>
            </section>

            {/* Your Items Section */}
            <section className="bg-[#FFFAED] w-full rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Your Items</h2>
              <div className="flex justify-between text-sm text-blue-600 mb-4">
                <p>Select all items (3 items)</p>
                <p>Buy it again</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border rounded-xl p-3 flex flex-col items-center bg-white shadow-sm"
                  >
                    <div className="relative w-full h-40 rounded-md overflow-hidden">
                      <Image
                        src="/partners/partner.png"
                        alt="Aluminum Scrap"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-2 font-medium">Aluminum Scrap</h3>
                    <p className="text-sm">₹ 23.6 per Kg</p>
                    <button className="mt-2 border border-purple-600 text-purple-600 px-4 py-1 rounded-md text-sm">
                      Move to cart
                    </button>
                    <div className="mt-2 text-xs text-gray-600 flex flex-col gap-1">
                      <span className="cursor-pointer">Delete</span>
                      <span className="cursor-pointer">Add to list</span>
                      <span className="cursor-pointer">
                        See more like this
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDE (Subtotal Box) */}
          <aside className="bg-[#FFFAED] w-full lg:w-80 rounded-2xl shadow-md p-6 h-fit sticky top-6">
            <p className="font-semibold mb-4">
              Subtotal ({items.filter((i) => i.checked).length} items) : $
              {subtotal.toFixed(1)}
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium">
              Proceed to Buy
            </button>
            <select className="w-full mt-4 border rounded-md px-3 py-2">
              <option>EMI Available</option>
              <option>No EMI</option>
            </select>
          </aside>
        </div>
      </main>
    </>
  );
}
