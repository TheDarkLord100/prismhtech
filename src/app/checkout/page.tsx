"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddressCard from "@/components/AddressCard";
import AddAddressModal from "@/components/AddAddressModal";
import { useAddressStore } from "@/utils/store/useAddressStore";
import { useCartStore } from "@/utils/store/useCartStore";
import type { Address } from "@/types/entities";

export default function CheckoutPage() {
    const router = useRouter();

    const { addresses, fetchAddresses, addAddress, updateAddress, deleteAddress } = useAddressStore();
    const { cart, getTotalItems, getTotalPrice, clearCart } = useCartStore();

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [editAddress, setEditAddress] = useState<Address | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadAddresses = async () => {
            await fetchAddresses();
        };
        loadAddresses();
    }, [fetchAddresses]);

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.default);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.adr_id);
            } else {
                setSelectedAddressId(addresses[0].adr_id); // fallback: first address
            }
        }
    }, [addresses]);

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    const handleSaveAddress = (addr: Address) => {
        console.log("Saved Address:", addr);
        if (editAddress) {
            updateAddress(editAddress.adr_id, addr);
            setEditAddress(null);
        } else {
            addAddress(addr);
        }
    };

    const handleProceedToPayment = async () => {
        if (!selectedAddressId) {
            alert("Please select a delivery address before proceeding to payment.");
            return;
        }
        const loadRazorpay = () =>
            new Promise((resolve) => {
                if (document.getElementById("razorpay-sdk")) return resolve(true);
                const script = document.createElement("script");
                script.id = "razorpay-sdk";
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });

        const resLoaded = await loadRazorpay();     
        if (!resLoaded) {
            alert("Failed to load Razorpay SDK. Please try again.");
            return;
        }

        const cartItems = cart!.items.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant.pvr_id,
            quantity: item.quantity,
            price: item.variant.price,
        }))

        const res = await fetch("/api/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                amount: totalPrice,
                receipt: `rcpt_${Math.random().toString(36).substring(2, 15)}`,
                ship_adr_id: selectedAddressId,
                bill_adr_id: selectedAddressId,
                cart_items: cartItems,
            })
        })

        console.log("Create Order Response:", res);

        const data = await res.json();
        if (!data.success) {
            alert("Failed to create order: " + data.message);
            return;
        }

        const razorpayOrder = data.razorpay_order;
        const orderId = data.order.id;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORYPAY_KEY!,
            amount: razorpayOrder.amount,
            currency: "INR",
            name: "test name",
            description: "Test Transaction",
            order_id: razorpayOrder.id,
            handler: async function (response: any) {
                const verifyRes = await fetch("/api/verify-payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        razorpay_order_id: razorpayOrder.id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        order_id: orderId,
                        transaction_id: response.razorpay_payment_id,
                    }),
                });

                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    alert("Payment successful! Order ID: " + orderId);
                    await clearCart();
                    
                } else {
                    alert("Payment verification failed: " + verifyData.message);
                }
            },
            prefill: {
                name: "Test User",
                email: "test@example.com",
                contact: "9999999999",
            },
            theme: { color: "#3399cc" },
        }

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };


    return (
        <>
            <Navbar />

            <main className="flex min-h-screen justify-center py-8 px-4 pt-20 bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
                <div className="w-4/6 max-w-7xl flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-6">
                        <section className="bg-[#FFFAED] w-full rounded-2xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl font-semibold mb-8">Select Delivery Address</h1>
                                <button
                                    onClick={async () => {
                                        setShowModal(true);
                                    }}
                                    className="bg-yellow-400 text-white py-2 px-6 rounded-lg font-semibold"
                                >
                                    Add New
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="text-gray-600">
                                    No saved addresses.{" "}
                                </div>
                            ) : (
                                <ul className="flex flex-col gap-4">
                                    {addresses.map((addr) => (
                                        <li
                                            key={addr.adr_id}
                                            className={`flex gap-3 border rounded-xl p-4 transition-all ${selectedAddressId === addr.adr_id
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-300 hover:border-green-400"
                                                }`}
                                        >
                                            {/* Radio Button */}
                                            <input
                                                type="radio"
                                                name="selectedAddress"
                                                value={addr.adr_id}
                                                checked={selectedAddressId === addr.adr_id}
                                                onChange={() => setSelectedAddressId(addr.adr_id)}
                                                className="w-5 h-5 mt-1 accent-green-600 cursor-pointer"
                                            />

                                            {/* Address Details */}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 text-lg">
                                                    {addr.name}
                                                </h3>

                                                <p className="text-sm text-gray-700 mt-1 leading-snug">
                                                    {addr.address_l1}, {addr.address_l2}, {addr.city}, {addr.state} -{" "}
                                                    {addr.pincode}, India
                                                </p>

                                                <p className="text-sm text-gray-700 mt-1">
                                                    Phone number:{" "}
                                                    <span className="font-medium">
                                                        {addr.phone}
                                                    </span>
                                                </p>

                                                <div className="flex flex-wrap gap-4 text-sm text-blue-600 mt-2">
                                                    <button className="hover:underline" onClick={() => {
                                                        setEditAddress(addr);
                                                        setShowModal(true);
                                                    }}>
                                                        Edit address
                                                    </button>
                                                    <span>|</span>
                                                    <button className="hover:underline"
                                                        onClick={() => deleteAddress(addr.adr_id)}>
                                                        Remove address
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    <aside className="bg-[#FFFDEE] w-full lg:w-80 rounded-2xl shadow-md p-6 h-fit top-6">
                        <p className="text-lg font-semibold mb-4">
                            Total ({totalItems} items) :{" "}
                            <span className="font-bold text-xl">₹ {totalPrice.toFixed(1)}</span>
                        </p>
                        <p className="text-lg font-semibold mb-4">
                            Expected Delivery Date :{" "}
                            <p className="font-bold text-xl">12th March 2023</p>
                        </p>
                        <button
                            onClick={handleProceedToPayment}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-4xl font-medium text-lg">
                            Proceed to Payment
                        </button>
                    </aside>
                </div>
            </main>

            {showModal &&
                <AddAddressModal
                    onClose={() => setShowModal(false)}
                    isOpen={showModal}
                    onSave={handleSaveAddress}
                    initialData={editAddress || undefined}
                />}
            <Footer />
        </>
    );
}
