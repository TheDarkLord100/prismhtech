"use client";

import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { Metal } from "@/types/entities";
import { MetalHistoryChart } from "./MetalHistoryChart";

interface Props {
    metal: Metal;
    onClose: () => void;
}

export default function MetalDetailsWidget({ metal, onClose }: Props) {
    const panelRef = useRef<HTMLDivElement | null>(null);

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
            className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl p-4 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm text-gray-500">Live price</div>
                        <div className="text-xl font-semibold text-black">
                            {metal.name}
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

                {/* Buy */}
                <button
                    className="mt-4 w-full bg-[#0f3f32] text-white py-3 rounded-xl
                     font-medium hover:bg-[#145c46] transition"
                    onClick={() => {
                        // future: redirect to checkout
                        console.log("Buy", metal.id);
                    }}
                >
                    Buy {metal.name}
                </button>
            </div>
        </div>
    );
}
