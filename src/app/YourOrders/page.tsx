"use client";

import React from "react";
// Assuming you have these components:
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- Type Definitions (NO CHANGE) ---
type OrderItem = {
  id: number;
  name: string;
  image: string;
  status: "Ordered" | "Shipped" | "Arriving";
  statusDate: string;
};

type Order = {
  orderId: string;
  datePlaced: string;
  total: string;
  shipTo: string;
  deliveryExpected?: string;
  deliveredDate?: string;
  items: OrderItem[];
};

// --- Mock Data (NO CHANGE) ---
const mockOrders: Order[] = [
  {
    orderId: "475-75663-7456634652-A",
    datePlaced: "5 June 2025",
    total: "$70,543.00",
    shipTo: "Chow Dhammaseng Shyam",
    deliveryExpected: "20 June",
    items: [
      {
        id: 1,
        name: "Imaginea Q12 Audio Mixer 2 Channel USB Audio Interface, 48V Phantom Power, 3.5mm Headphone Input Mixer for Recording Live Streaming, Music Production, Karaoke Computer Recording Singing Live Streaming",
        image: "/images/mixer_placeholder.png",
        status: "Arriving",
        statusDate: "Thursday, 5 June",
      },
    ],
  },
  {
    orderId: "475-75663-7456634652-B",
    datePlaced: "5 June 2025",
    total: "$70,543.00",
    shipTo: "Chow Dhammaseng Shyam",
    deliveredDate: "18 June",
    items: [
      {
        id: 2,
        name: "Imaginea Q12 Audio Mixer 2 Channel USB Audio Interface, 48V Phantom Power, 3.5mm Headphone Input Mixer for Recording Live Streaming, Music Production, Karaoke Computer Recording Singing Live Streaming",
        image: "/images/mixer_placeholder.png",
        status: "Ordered",
        statusDate: "",
      },
    ],
  },
];

// --- Subcomponents (Modified OrderHeader & DeliveryStatus for fidelity) ---

const OrderHeader: React.FC<{ order: Order }> = ({ order }) => (
  // Updated header to match the Figma's more simple font-weight and line style
  <div className="flex justify-between items-center text-sm border-b border-gray-300 pb-3 mb-4 text-gray-700">
    <div className="flex space-x-12">
      <div className="flex flex-col">
        <span className="text-gray-500 font-normal uppercase text-xs tracking-wider">
          ORDER PLACED
        </span>
        <span className="font-medium text-gray-900">{order.datePlaced}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-500 font-normal uppercase text-xs tracking-wider">
          TOTAL
        </span>
        <span className="font-medium text-gray-900">{order.total}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-500 font-normal uppercase text-xs tracking-wider">
          SHIP TO
        </span>
        <a
          href={`/profile/${order.shipTo.replace(/\s/g, "-")}`}
          className="flex items-center text-green-700 hover:text-green-800"
        >
          {order.shipTo}
          {/* Tailwind arrow down icon */}
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </a>
      </div>
    </div>

    <div className="flex flex-col items-end">
      {/* Figma uses a slightly simpler ID presentation */}
      <span className="text-gray-500 font-normal uppercase text-xs tracking-wider">
        ORDER # 475-75663-7456634652
      </span>
      <div className="flex space-x-4 mt-1 text-green-700">
        <a href={`/orders/${order.orderId}`} className="hover:underline">
          View order details
        </a>
        <a
          href={`/orders/${order.orderId}/invoice`}
          className="flex items-center hover:underline"
        >
          Invoice
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
);

const DeliveryStatus: React.FC<{ status: OrderItem["status"] }> = ({
  status,
}) => {
  const steps = [
    { label: "Ordered", date: "Thursday, 5 June", isComplete: true },
    { label: "Shipped", date: "Monday, 9 June", isComplete: status !== "Ordered" },
    { label: "Arriving today", date: "", isComplete: status === "Arriving" },
  ];

  return (
    // Refactored to use relative positioning for the vertical connecting line
    <div className="flex flex-col space-y-2 pt-1">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start relative">
          {/* Vertical connector line (only for steps 0 and 1) */}
          {index < steps.length - 1 && (
            <div className={`absolute top-0 left-[11px] h-full w-[2px] transform translate-y-6 ${step.isComplete ? 'bg-green-700' : 'bg-gray-300'}`}></div>
          )}

          {/* Icon/Circle */}
          <div
            className={`mr-4 z-10 ${step.isComplete ? "text-green-700" : "text-gray-400"}`}
          >
            {/* Using a simpler circle/icon for better visual fidelity to Figma */}
            {step.isComplete ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            ) : (
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full bg-white"></div>
            )}
          </div>
          
          <div className="flex flex-col text-sm">
            <span className="font-medium text-gray-800">
                {step.label}
            </span>
            <span className="text-gray-500 text-xs">
                {step.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const isDelivered = !!order.deliveredDate;
  const item = order.items[0];

  return (
    <div className="border border-gray-200 shadow-sm p-6 mb-8 bg-white rounded-lg">
      <OrderHeader order={order} />

      {/* REFACTORED LAYOUT: Grid structure to match Figma: | Title (1fr) | Product/Status/Description (2fr) | Action Buttons (1fr) | */}
      <div className="grid grid-cols-[1.5fr_2.5fr_1fr] gap-x-8 items-start pt-2">
        
        {/* === COLUMN 1: Delivery Title === */}
        <div className="col-span-1">
          <h3
            className={`text-xl font-bold ${
              isDelivered ? "text-gray-800" : "text-red-700"
            }`}
          >
            {isDelivered
              ? `Delivered by ${order.deliveredDate}`
              : `Delivery expected by ${order.deliveryExpected}`}
          </h3>
        </div>

        {/* === COLUMN 2: Product Image, Status, and Description/Buy Buttons (COHESIVE BLOCK) === */}
        <div className="col-span-1 flex flex-col">
            <div className='flex items-start space-x-6'>
                {/* Image (Small, aligned left) */}
                <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-xl">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Status Tracker (Next to image) */}
                {!isDelivered && (
                    <div className="flex-grow">
                        <DeliveryStatus status={item.status} />
                    </div>
                )}
            </div>

            {/* Product Full Description (Below the image/status block) */}
            <p className="mt-4 text-sm text-blue-800 leading-relaxed max-w-lg">
              {item.name}
            </p>

            {/* Buy Again / View Item Buttons (Aligned with the description/image) */}
            <div className="flex space-x-4 mt-4">
                {/* Buy Again Button (Primary, same style as your original, but added shadow-md for fidelity) */}
                <button className="flex items-center bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2 px-4 rounded-full transition duration-150 shadow-md">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Buy again
                </button>
                {/* View Item Button (Secondary) */}
                <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold py-2 px-4 rounded-full transition duration-150 shadow-md">
                    View your item
                </button>
            </div>
        </div>

        {/* === COLUMN 3: Action Buttons (Right Aligned) === */}
        <div className="col-span-1 flex flex-col space-y-3 items-end">
          {/* Action Buttons (Full width within this column, same style as your original) */}
          <button className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-full transition duration-150 w-full shadow-md">
            Get product support
          </button>
          <button className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-2 px-4 rounded-full transition duration-150 w-full shadow-md">
            Ask Product Question
          </button>
          <button className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-2 px-4 rounded-full transition duration-150 w-full shadow-md">
            Write a product review
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component (Only minor style fixes for fidelity) ---
const YourOrders = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white"> {/* Changed bg-gray-50 to bg-white for body, matching the top section of the design */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-40 pb-20"> {/* Adjusted padding/margin for component start, assuming Navbar is fixed/absolute */}
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 font-medium">
          <a href="/account" className="hover:text-green-700">
            Your Account
          </a>{" "}
          &gt; <span className="font-semibold text-gray-700">Your Orders</span>
        </div>

        {/* Header & Search */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search all orders"
                className="w-96 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-700" // Changed back to rounded-lg to match Figma search bar
              />
            </div>
            <button className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-full transition duration-150"> {/* Changed back to rounded-lg */}
              Search Orders
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-0">
          <div className="flex space-x-8">
            <button className="pb-3 text-green-700 font-semibold border-b-2 border-green-700">
              Orders
            </button>
            <button className="pb-3 text-gray-600 hover:text-green-700">
              Buy Again
            </button>
            <button className="pb-3 text-gray-600 hover:text-green-700">
              Not Shipped Yet
            </button>
          </div>
        </div>

        {/* Black line from Figma is now here */}
        <div className="border-b border-black w-full mb-4 opacity-10"></div> {/* Reduced opacity as it looks very thin/light in Figma */}

        <div className="flex items-center text-sm mb-6">
          <span className="mr-2 font-medium">3 orders placed in</span>
          <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50">
            Past 3 months
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default YourOrders;