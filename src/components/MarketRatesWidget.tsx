"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Metal } from "@/types/entities";
import MetalDetailsWidget from "./MetalDetailsWidget";

interface Props {
  metals: Metal[];
}

export default function MarketRatesWidget({ metals }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [detailsMetal, setDetailsMetal] = useState<Metal | null>(null);


  // 👉 Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed top-20 right-6 z-[9999] font-['Gotham']"
    >
      {/* CLOSED STATE */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#1a5e48] text-white px-5 py-4 rounded-xl shadow-lg
          flex items-center gap-2 hover:bg-[#FFC107] transition"
        >
          <ChevronLeft size={18} />
          <span className="text-xl font-medium">Exchange Rates</span>
        </button>
      )}

      {/* OPEN STATE */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl p-4 w-[92vw] max-w-[720px] border border-black/10">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#c89b1d]">
              Current exchange rates &gt;
            </span>

            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-black/5 text-black"
            >
              <X size={18} />
            </button>
          </div>

          {/* RATES */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {metals.map((metal) => (
              <div
                key={metal.id}
                className="min-w-[170px] rounded-xl p-4 bg-[#0f3f32] text-white"
              >
                <div className="text-xs opacity-80">{metal.name}</div>

                <div className="text-lg font-semibold mt-1">
                  ₹ {metal.live_price.toLocaleString("en-IN")}
                </div>

                <button
                  className="mt-3 text-xs font-medium
             text-[#FFC107] hover:text-[#ffda44] transition"
                  onClick={() => setDetailsMetal(metal)}
                >
                  More Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {detailsMetal && (
        <MetalDetailsWidget
          metal={detailsMetal}
          onClose={() => setDetailsMetal(null)}
        />
      )}

    </div>
  );
}
