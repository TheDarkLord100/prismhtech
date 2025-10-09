"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AddressesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-72">
        {/* Breadcrumb */}
        <p className="text-gray-500 text-sm mb-2">
          Your Account <span className="text-green-500">{">"}</span>{" "}
          <span className="text-green-500">Your Addresses</span>
        </p>

        {/* Heading */}
        <h1 className="text-3xl font-semibold mb-8">Your Addresses</h1>

        {/* Address Boxes */}
        <div className="flex flex-wrap gap-6 justify-start max-w-7xl mx-auto">
          {/* Add New Address */}
          <div className="flex flex-col justify-center items-center w-80 h-80 border-2 border-dashed border-gray-400 rounded-2xl bg-white hover:bg-gray-50 cursor-pointer transition">
            <span className="text-5xl text-gray-400">+</span>
            <p className="text-lg font-medium mt-2 text-gray-700">
              Your Addresses
            </p>
          </div>

          {/* Default Address */}
          <div className="w-80 h-80 border border-gray-400 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
            <div className="px-5 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Default</p>
              <hr className="border-gray-400 mb-3" />
              <p className="font-semibold text-lg leading-snug">
                Chow dhamma seng shyam
              </p>
              <p className="text-gray-700 text-sm mt-1 leading-tight">
                C-43
                <br />
                Pariyavaran Complex, Block-C, Ignou Road
                <br />
                New Delhi, DELHI 110030
                <br />
                India
                <br />
                Phone number: 8638082020
              </p>
              <p className="text-blue-600 text-sm mt-2 cursor-pointer hover:underline">
                Add delivery instructions
              </p>
            </div>
            <div className="flex gap-4 px-5 pb-4 text-sm">
              <button className="text-blue-600 hover:underline">Edit</button>
              <button className="text-blue-600 hover:underline">Remove</button>
            </div>
          </div>

          {/* Other Address */}
          <div className="w-80 h-80 border border-gray-400 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
            <div className="px-5 pt-4">
              <p className="font-semibold text-lg leading-snug">
                Chow dhamma seng shyam
              </p>
              <p className="text-gray-700 text-sm mt-1 leading-tight">
                C-43
                <br />
                Pariyavaran Complex, Block-C, Ignou Road
                <br />
                New Delhi, DELHI 110030
                <br />
                India
                <br />
                Phone number: 8638082020
              </p>
              <p className="text-blue-600 text-sm mt-2 cursor-pointer hover:underline">
                Add delivery instructions
              </p>
            </div>
            <div className="flex flex-wrap gap-3 px-5 pb-4 text-sm">
              <button className="text-blue-600 hover:underline">Edit</button>
              <button className="text-blue-600 hover:underline">Remove</button>
              <button className="text-blue-600 hover:underline">
                Set as Default
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
