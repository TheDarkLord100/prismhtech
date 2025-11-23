"use client";

import { useState, useEffect, useRef } from "react";
import type { Order } from "@/types/entities";
import type { OrderItem } from "@/types/entities";
import { useRouter } from "next/navigation";

const OrderHeader = ({ order }: { order: Order }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                setShowTooltip(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const address = order.shipping_address;

    return (
        <div className="
        grid grid-cols-2 gap-4
        lg:flex lg:justify-between lg:items-center
        text-sm text-gray-700
        ">
            {/* ORDER PLACED */}
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs tracking-wider">ORDER PLACED</span>
                <span className="font-medium text-gray-900">
                    {new Date(order.created_at).toLocaleDateString("en-IN")}
                </span>
            </div>

            {/* TOTAL */}
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs tracking-wider">TOTAL</span>
                <span className="font-medium text-gray-900">₹{order.total_amount}</span>
            </div>

            {/* SHIP TO */}
            <div className="relative flex flex-col">
                <span className="text-gray-500 text-xs tracking-wider">SHIP TO</span>

                <span
                    className="font-medium text-green-700 cursor-pointer hover:underline"
                    onClick={() => setShowTooltip(!showTooltip)}
                >
                    {address?.name}
                </span>

                {showTooltip && (
                    <div
                        ref={tooltipRef}
                        className="absolute left-0 mt-2 bg-white shadow-lg border border-gray-300 rounded-xl
                       p-4 w-72 z-50 text-sm text-gray-800"
                    >
                        <p className="font-semibold text-gray-900 mb-1">{address?.name}</p>
                        <p>{address?.address_l1}</p>
                        {address?.address_l2 && <p>{address.address_l2}</p>}
                        <p>{address?.city}, {address?.state} {address?.pincode}</p>
                        <p>{address?.country}</p>
                        <p className="mt-2 text-gray-600 text-xs">Phone: {address?.phone}</p>
                    </div>
                )}
            </div>

            {/* ORDER ID + INVOICE — ALWAYS RIGHT ALIGNED */}
            <div className="flex flex-col items-start sm:items-start lg:items-end">
                <span className="text-gray-500 text-xs tracking-wider">
                    ORDER #{order.id}
                </span>

                <a
                    href=""
                    className="text-green-700 hover:underline mt-1 text-sm"
                >
                    Download Invoice
                </a>
            </div>
        </div>
    );
};


export default function OrderCard({ order }: { order: Order }) {
    const item = order.items[0];
    const router = useRouter();

    return (
        <div className="border border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white mb-8">
            <div className="bg-gray-200 px-6 py-5">
                <OrderHeader order={order} />
            </div>

            <div className="p-6">
                <h3 className="text-lg font-bold mb-4 text-black">
                    {item.product?.name} {order.items.length > 1 ? `and ${order.items.length - 1} more item${order.items.length - 1 > 1 ? "s" : ""}` : ""}
                </h3>

                {/* FLEX WRAPPER — mobile = column, desktop = row */}
                <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-between">

                    {/* IMAGE — centered on mobile */}
                    <div className="w-64 h-64 overflow-hidden rounded-xl mx-auto lg:mx-0">
                        <img
                            src={item.product?.productImages?.[0]?.image_url ?? "/placeholder.png"}
                            alt={item.product?.name ?? "Product"}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* PROGRESS — full width on mobile, middle on desktop */}
                    <div className="flex flex-col flex-1 w-full lg:w-auto mt-4 lg:mt-0">

                        {/* STEP 1 */}
                        <div className="flex items-start">
                            <div className="flex flex-col items-center mr-3">
                                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="w-px flex-1 bg-green-700"></div>
                            </div>
                            <div className="pb-6">
                                <p className="font-medium text-gray-800">Ordered Thursday, 5 June</p>
                            </div>
                        </div>

                        {/* STEP 2 */}
                        <div className="flex items-start">
                            <div className="flex flex-col items-center mr-3">
                                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="w-px flex-1 bg-gray-300"></div>
                            </div>
                            <div className="pb-6">
                                <p className="font-medium text-gray-800">Shipped Monday, 9 June</p>
                            </div>
                        </div>

                        {/* STEP 3 */}
                        <div className="flex items-start">
                            <div className="flex flex-col items-center mr-3">
                                <div className="w-6 h-6 border-2 border-gray-400 rounded-full bg-white"></div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Arriving today</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT BUTTONS — stacked vertically, moved under progress in mobile */}
                    <div className="flex flex-col space-y-2 w-full lg:w-auto lg:items-end mt-6 lg:mt-0">
                        <button className="bg-gradient-to-r from-green-800 to-green-600 text-white font-semibold py-1.5 px-8 rounded-full w-full lg:w-64 shadow-md text-sm">
                            Get product support
                        </button>

                        <button className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-1.5 px-8 rounded-full w-full lg:w-64 shadow-md text-sm">
                            Ask Product Question
                        </button>

                        <button className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-1.5 px-8 rounded-full w-full lg:w-64 shadow-md text-sm">
                            Write a product review
                        </button>
                    </div>

                </div>

                {/* BUY AGAIN — Always at bottom */}
                <div className="flex space-x-3 mt-6 justify-center lg:justify-start">
                    <button className="bg-gradient-to-r from-green-800 to-green-600 text-white text-sm font-semibold py-1.5 px-6 rounded-full shadow-md">
                        Buy again
                    </button>

                    <button
                        className="bg-white border border-gray-300 text-gray-700 text-sm font-semibold py-1.5 px-6 rounded-full shadow-md"
                        onClick={() => router.push(`/order?order_id=${order.id}`)}
                    >
                        View Order Details
                    </button>
                </div>
            </div>


        </div>
    );
}
