"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddressCard from "@/components/AddressCard";
import AddAddressModal from "@/components/AddAddressModal";
import type { Address } from "@/types/entities";
import { useAddressStore } from "@/utils/store/useAddressStore";

export default function AddressesPage() {
  const { addresses, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddressStore();

  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleSaveAddress = (addr: Address) => {
    console.log("Saved Address:", addr);
    if (selectedAddress) {
      updateAddress(selectedAddress.adr_id, addr);
    } else {
      addAddress(addr);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar type="colored" />

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-72">
        {/* Breadcrumb */}
        <p className="text-gray-500 text-sm mb-2">
          Your Account <span className="text-green-500">{">"}</span>{" "}
          <span className="text-green-500">Your Addresses</span>
        </p>

        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold mb-8">Your Addresses</h1>
          <button
            onClick={async () => {
              setSelectedAddress(null);
              setShowModal(true);
            }}
            className="bg-yellow-400 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Add Address
          </button>
        </div>

        {/* Address Boxes */}
        <div className="flex flex-wrap gap-6 justify-start max-w-7xl mx-auto">

          {addresses.map((addr) => (
            <AddressCard
              key={addr.adr_id}
              address={addr}
              onEdit={(id) => {
                setSelectedAddress(addr);
                setShowModal(true);
              }}
              onRemove={(id) => deleteAddress(id)}
              onSetDefault={(id) => setDefaultAddress(id)}
            />
          ))}
        </div>
      </main>
      <AddAddressModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAddress}
        initialData={selectedAddress || undefined}
      />
      <Footer />
    </div>
  );
}
