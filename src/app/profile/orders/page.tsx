"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Order } from "@/types/entities";
import type { OrderItem } from "@/types/entities";


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
        image: "/partners/partner.png",
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
        image: "/partners/partner.png",
        status: "Ordered",
        statusDate: "",
      },
    ],
  },
];

const OrderHeader: React.FC<{ order: Order }> = ({ order }) => (
  <div className="flex justify-between items-center text-sm text-gray-700">
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
      <span className="text-gray-500 font-normal uppercase text-xs tracking-wider">
        ORDER # {order.orderId}
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
    <div className="flex flex-col space-y-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start relative">
          {index < steps.length - 1 && (
            <div
              className={`absolute top-0 left-[11px] h-full w-[2px] transform translate-y-6 ${
                step.isComplete ? "bg-green-700" : "bg-gray-300"
              }`}
            ></div>
          )}
          <div
            className={`mr-4 z-10 ${
              step.isComplete ? "text-green-700" : "text-gray-400"
            }`}
          >
            {step.isComplete ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            ) : (
              <div className="w-6 h-6 border-2 border-gray-400 rounded-full bg-white"></div>
            )}
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-medium text-gray-800">{step.label}</span>
            <span className="text-gray-500 text-xs">{step.date}</span>
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
    <div className="border border-gray-200 shadow-sm rounded-3xl overflow-hidden mb-8 bg-white">
      <div className="bg-gray-200 px-6 py-5 rounded-t-3xl">
        <OrderHeader order={order} />
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold mb-4 text-black">
          {isDelivered
            ? `Delivered by ${order.deliveredDate}`
            : `Delivery expected by ${order.deliveryExpected}`}
        </h3>

        <div className="flex gap-6 items-start justify-between">
          <div className="w-28 h-28 overflow-hidden rounded-xl flex-shrink-0">
            {/* <Image
              src="/partners/partner.png"
              alt={item.name}
              className="w-full h-full object-cover"
            /> */}
          </div>

          {!isDelivered ? (
            <div className="flex-1 mt-2">
              <DeliveryStatus status={item.status} />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex flex-col space-y-2 items-end">
            <button className="bg-gradient-to-r from-green-800 to-green-600 text-white font-semibold py-1.5 px-8 rounded-full transition duration-150 w-64 shadow-md text-sm">
              Get product support
            </button>
            <button className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-1.5 px-8 rounded-full transition duration-150 w-64 shadow-md text-sm">
              Ask Product Question
            </button>
            <button className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-1.5 px-8 rounded-full transition duration-150 w-64 shadow-md text-sm">
              Write a product review
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-blue-800 leading-relaxed mb-4 max-w-2xl">
            {item.name}
          </p>

          <div className="flex space-x-3">
            <button className="flex items-center bg-gradient-to-r from-green-800 to-green-600 text-white text-sm font-semibold py-1.5 px-6 rounded-full transition duration-150 shadow-md">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0z"
                ></path>
              </svg>
              Buy again
            </button>

            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold py-1.5 px-6 rounded-full transition duration-150 shadow-md">
              View your item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const YourOrders = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar type="colored" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="text-sm text-gray-500 mb-6 font-medium">
          <a href="/account" className="hover:text-green-700">
            Your Account
          </a>{" "}
          &gt; <span className="font-semibold text-gray-700">Your Orders</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search all orders"
              className="w-80 p-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <button className="bg-gradient-to-r from-green-800 to-green-600 text-white font-semibold py-1.5 px-6 rounded-full w-40 shadow-md transition duration-150 text-sm">
              Search Orders
            </button>
          </div>
        </div>

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

        <div className="flex items-center text-sm mb-6 mt-4">
          <span className="mr-2">
            <span className="font-bold">3 orders</span> placed in
          </span>
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
