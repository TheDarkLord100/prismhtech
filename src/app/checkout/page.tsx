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
            if (defaultAddr) {
                setSelectedDeliveryId(defaultAddr.adr_id);
                setSelectedBillingId(defaultAddr.adr_id);
            } else {
                setSelectedDeliveryId(addresses[0].adr_id);
                setSelectedBillingId(addresses[0].adr_id);
            }
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

    const handleProceedToPayment = async () => {
        if (!selectedDeliveryId) {
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
                ship_adr_id: selectedDeliveryId,
                bill_adr_id: sameAsDelivery ? selectedDeliveryId : selectedBillingId,
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
            name: "Pervesh Rasayan Pvt. Ltd.",
            description: "Order Id: " + orderId,
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
                name: user?.name,
                email: user?.email,
                contact: user?.phone,
            },
            theme: { color: "#3399cc" },
        }

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-100 flex flex-col items-center py-16 px-4">
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
                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
                                <div className="flex items-center gap-1">
                                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">✓</div>
                                    <span>
                                        <span className="font-semibold">Step 1:</span> Select item(s)
                                    </span>
                                </div>
                                <div className="flex-1 border-t border-gray-400 mx-2"></div>
                                <div className="flex items-center gap-1">
                                    <div className="w-5 h-5 rounded-full border border-green-600 flex items-center justify-center text-green-600 text-xs">2</div>
                                    <span>
                                        <span className="font-semibold">Step 2:</span> Select item(s)
                                    </span>

                                </div>
                                <div className="flex-1 border-t border-dashed border-gray-300 mx-2"></div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs">3</div>
                                    <span>
                                        <span className="font-semibold">Step 3:</span> Select item(s)
                                    </span>

                                </div>
                            </div>



                            {addresses.length === 0 ? (
                                <p className="text-gray-600">No saved addresses.</p>
                            ) : (
                                <ul className="flex flex-col gap-4">
                                    {addresses.map((addr) => (
                                        <li
                                            key={addr.adr_id}
                                            className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${selectedDeliveryId === addr.adr_id
                                                    ? "border-green-600 bg-green-50"
                                                    : "border-green-600 "
                                                }`}
                                            onClick={() => setSelectedDeliveryId(addr.adr_id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    checked={selectedDeliveryId === addr.adr_id}
                                                    onChange={() => setSelectedDeliveryId(addr.adr_id)}
                                                    className="mt-1 w-5 h-5 accent-green-600 cursor-pointer"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800">{addr.name}</h3>
                                                    <p className="text-sm text-gray-700 leading-snug">
                                                        {addr.address_l1}, {addr.address_l2}, {addr.city}, {addr.state} - {addr.pincode}, India
                                                    </p>
                                                    <p className="text-sm text-gray-700 mt-1">
                                                        Phone: <span className="font-medium">{addr.phone}</span>
                                                    </p>
                                                    <div className="flex gap-3 text-blue-600 text-sm mt-2">
                                                        <button onClick={(e) => { e.stopPropagation(); setEditAddress(addr); setShowModal(true); }}>Edit</button>
                                                        <span>|</span>
                                                        <button onClick={(e) => { e.stopPropagation(); deleteAddress(addr.adr_id); }}>Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
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
                                    <ul className="flex flex-col gap-4">
                                        {addresses.map((addr) => (
                                            <li
                                                key={addr.adr_id}
                                                className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${selectedBillingId === addr.adr_id
                                                        ? "border-green-600 bg-green-50"
                                                        : "border-green-600"
                                                    }`}
                                                onClick={() => setSelectedBillingId(addr.adr_id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        checked={selectedBillingId === addr.adr_id}
                                                        onChange={() => setSelectedBillingId(addr.adr_id)}
                                                        className="mt-1 w-5 h-5 accent-green-600 cursor-pointer"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-gray-800">{addr.name}</h3>
                                                        <p className="text-sm text-gray-700 leading-snug">
                                                            {addr.address_l1}, {addr.address_l2}, {addr.city}, {addr.state} - {addr.pincode}, India
                                                        </p>
                                                        <p className="text-sm text-gray-700 mt-1">
                                                            Phone: <span className="font-medium">{addr.phone}</span>
                                                        </p>
                                                        <div className="flex gap-3 text-blue-600 text-sm mt-2">
                                                            <button onClick={(e) => { e.stopPropagation(); setEditAddress(addr); setShowModal(true); }}>Edit</button>
                                                            <span>|</span>
                                                            <button onClick={(e) => { e.stopPropagation(); deleteAddress(addr.adr_id); }}>Remove</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        )}
                    </div>

                    {/* RIGHT SECTION (Summary) */}
                    <aside className="bg-[#FFFDEE] w-full lg:w-80 rounded-2xl shadow-md p-6 h-fit">
                        <p className="text-lg mb-3">
                            Subtotal ({totalItems} items): <span className="font-bold">₹{totalPrice.toFixed(1)}</span>
                        </p>

                        <div className="mt-4 mb-6">
                            <select className="w-full border border-yellow-400 rounded-lg px-3 py-2 text-sm focus:outline-none">
                                <option>EMI Available</option>
                                <option>No EMI</option>
                            </select>
                        </div>
                        <button
                            onClick={handleProceedToPayment}
                            className="w-full  bg-yellow-400 hover:bg-yellow-500 text-white py-1 rounded-2xl text-lg"
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
