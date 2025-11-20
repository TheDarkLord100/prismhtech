"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddAddressModal from "@/components/AddAddressModal";
import { useAddressStore } from "@/utils/store/useAddressStore";
import { useCartStore } from "@/utils/store/useCartStore";
import type { Address } from "@/types/entities";
import { useUserStore } from "@/utils/store/userStore";
import StepIndicator from "@/components/StepIndicator";
import AddressList from "./AddressList";
import { handleProceedToPayment } from "@/utils/razorpay";

export default function CheckoutPage() {

    const router = useRouter();
    const { addresses, fetchAddresses, addAddress, updateAddress, deleteAddress } = useAddressStore();
    const { cart, getTotalItems, getTotalPrice, clearCart } = useCartStore();

    const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
    const [selectedBillingId, setSelectedBillingId] = useState<string | null>(null);
    const [sameAsDelivery, setSameAsDelivery] = useState<boolean>(false);
    const [editAddress, setEditAddress] = useState<Address | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { user } = useUserStore();

    useEffect(() => {
        const loadAddresses = async () => await fetchAddresses();
        loadAddresses();
    }, [fetchAddresses]);

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.default);
            const defaultId = defaultAddr ? defaultAddr.adr_id : addresses[0].adr_id;
            setSelectedDeliveryId(defaultId);
            setSelectedBillingId(defaultId);
        }
    }, [addresses]);

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.default);
            const defaultId = defaultAddr ? defaultAddr.adr_id : addresses[0].adr_id;
            setSelectedDeliveryId(defaultId);
            setSelectedBillingId(defaultId);
        }
    }, [addresses]);

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    const handleSaveAddress = (addr: Address) => {
        if (editAddress) {
            updateAddress(editAddress.adr_id, addr);
            setEditAddress(null);
        } else addAddress(addr);
    };


    return (
        <>
            <Navbar />
            <main className="  bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] min-h-screen bg-gray-100 flex flex-col items-center py-16 px-4">
                <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
                    {/* LEFT SECTION */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Delivery Section */}
                        <section className="bg-[#FFFAED] rounded-4xl shadow-md p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-semibold">Select Delivery Address</h2>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-semibold"
                                >
                                    Add New Address
                                </button>
                            </div>
                            {/* Step Indicator */}
                            <StepIndicator currentStep={2} />


                            {addresses.length === 0 ? (
                                <p className="text-gray-600">No saved addresses.</p>
                            ) : (
                                <AddressList
                                    addresses={addresses}
                                    selectedId={selectedDeliveryId}
                                    onSelect={setSelectedDeliveryId}
                                    onEdit={(addr) => { setEditAddress(addr); setShowModal(true); }}
                                    onDelete={deleteAddress}
                                />
                            )}
                        </section>

                        {/* Same as Delivery Checkbox */}
                        <div className="bg-[#FFFDEE] rounded-2xl shadow-sm p-4 flex items-center gap-3 text-gray-700 text-sm">
                            <input
                                type="checkbox"
                                checked={sameAsDelivery}
                                onChange={(e) => setSameAsDelivery(e.target.checked)}
                                className="w-5 h-5 accent-green-600"
                            />
                            <label>Billing address is same as delivery address</label>
                        </div>

                        {/* Billing Section */}
                        {!sameAsDelivery && (
                            <section className="bg-[#FFFAED] rounded-4xl shadow-md p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-semibold">Select Billing Address</h2>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-semibold"
                                    >
                                        Add New Address
                                    </button>
                                </div>

                                {addresses.length === 0 ? (
                                    <p className="text-gray-600">No saved addresses.</p>
                                ) : (
                                    <AddressList
                                        addresses={addresses}
                                        selectedId={selectedBillingId}
                                        onSelect={setSelectedBillingId}
                                        onEdit={(addr) => { setEditAddress(addr); setShowModal(true); }}
                                        onDelete={deleteAddress}
                                    />
                                )}
                            </section>
                        )}
                    </div>

                    {/* RIGHT SECTION (Summary) */}
                    <aside className="bg-[#FFFDEE] w-full lg:w-80 rounded-2xl shadow-md p-6 h-fit">
                        <p className="text-lg mb-3">
                            Subtotal ({totalItems} items): <span className="font-bold">₹{totalPrice.toFixed(1)}</span>
                        </p>
                        <button
                            onClick={() =>
                                handleProceedToPayment({
                                    selectedDeliveryId,
                                    selectedBillingId,
                                    sameAsDelivery,
                                    cart,
                                    totalPrice,
                                    user,
                                    clearCart,
                                })
                            }
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-1 rounded-2xl text-lg"
                        >
                            Proceed to Buy
                        </button>
                    </aside>
                </div>
            </main>

            {showModal && (
                <AddAddressModal
                    onClose={() => setShowModal(false)}
                    isOpen={showModal}
                    onSave={handleSaveAddress}
                    initialData={editAddress || undefined}
                />
            )}

            <Footer />
        </>
    );
}
