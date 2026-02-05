"use client";

import { X } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import type { Metal } from "@/types/entities";
import { MetalHistoryChart } from "./MetalHistoryChart";
import { useCartStore } from "@/utils/store/useCartStore";

interface Props {
    metal: Metal;
    onClose: () => void;
}

export default function MetalDetailsWidget({ metal, onClose }: Props) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const { addMetalToCart, cart } = useCartStore();

    /**
     * 🔹 Business rules
     * - live_price is PER UNIT
     * - buying is done in LOTS
     * - minimum_quantity is in UNITS
     */

    // minimum selectable units (rounded UP to nearest lot)
    const minUnits = useMemo(() => {
        return (
            Math.ceil(metal.minimum_quantity / metal.lot_size) *
            metal.lot_size
        );
    }, [metal.minimum_quantity, metal.lot_size]);

    // selected units (kg)
    const [units, setUnits] = useState<number | null>(null);

    // derived values
    const totalPrice =
        units != null ? units * metal.live_price : 0;

    useEffect(() => {
        if (!cart || !cart.items) return;

        const metalItem = cart.items.find(
            (item) =>
                item.item_type === "metal" &&
                item.metal?.id === metal.id
        );

        if (metalItem) {
            setUnits(metalItem.quantity); // quantity is already in UNITS
        } else {
            setUnits(null);
        }
    }, [cart, metal.id]);


    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[10000] bg-black/40 flex items-end sm:items-center justify-center">
            <div
                ref={panelRef}
                className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl p-4 shadow-xl text-black"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm text-gray-500">Live price</div>
                        <div className="text-xl font-semibold">
                            {metal.name}
                        </div>
                        <div className="text-sm text-gray-700">
                            ₹ {metal.live_price.toLocaleString("en-IN")} /{" "}
                            {metal.unit}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded hover:bg-black/5 text-gray-600 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Chart */}
                <MetalHistoryChart metalId={metal.id} />

                {/* Lot size & minimum quantity */}
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 space-y-1">
                    <div>
                        <span className="font-medium">Lot size:</span>{" "}
                        {metal.lot_size} {metal.unit}
                    </div>
                    <div>
                        <span className="font-medium">Minimum quantity:</span>{" "}
                        {metal.minimum_quantity} {metal.unit}
                    </div>
                </div>

                {/* Weight variation note */}
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                    Note: There may be a slight variation in the total weight of
                    the order. Any difference in price will be communicated when
                    the order is ready for dispatch.
                </p>

                {/* Add to cart / Quantity selector */}
                <div className="mt-6">
                    {units === null ? (
                        <button
                            className="w-full bg-black text-white py-3 rounded-xl
                         font-medium hover:opacity-90 transition"
                            onClick={() => {
                                setUnits(minUnits);
                                addMetalToCart(metal, minUnits);
                            }}
                        >
                            Add to cart
                        </button>
                    ) : (
                        <>
                            {/* Quantity selector */}
                            <div className="flex items-center justify-between gap-4">
                                {/* Decrement */}
                                <button
                                    className="w-12 h-12 rounded-lg border text-xl font-semibold
                             hover:bg-gray-100 transition disabled:opacity-40"
                                    disabled={units <= minUnits}
                                    onClick={() => {
                                        const next = units - metal.lot_size;
                                        if (next >= minUnits) {
                                            setUnits(next);
                                            addMetalToCart(metal, -metal.lot_size);
                                        }
                                    }}
                                >
                                    −
                                </button>

                                {/* Units display */}
                                <div className="text-center">
                                    <div className="text-xl font-semibold">
                                        {units} {metal.unit}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        ₹{" "}
                                        {totalPrice.toLocaleString("en-IN")}
                                    </div>
                                </div>

                                {/* Increment */}
                                <button
                                    className="w-12 h-12 rounded-lg border text-xl font-semibold
                             hover:bg-gray-100 transition"
                                    onClick={() => {
                                        const next = units + metal.lot_size;
                                        setUnits(next);
                                        addMetalToCart(metal, metal.lot_size);
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
