"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemorialSection from "@/components/MemorialSection";
import ProductsSlider from "@/components/ProductsSlider";
import { useEffect, useState } from "react";
import type { Category, Brand, Metal } from "@/types/entities";
import HeroVideoSection from "@/components/HeroVideoSection";
import ChannelPartner from "@/components/ChannelPartner";
import MarketRatesWidget from "@/components/MarketRatesWidget";
import { useAppStore } from "@/utils/store/useAppStore";

export default function HomePage() {
  const { categories, brands, loading } = useAppStore();
  const [liveMetals, setLiveMetals] = useState<Metal[]>([]);
  const [pageLoading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchMetals() {
      try {
        const res = await fetch("/api/live-prices", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setLiveMetals(data.metals);
        }
      } catch (err) {
        console.error("Error fetching live prices:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetals();

  }, []);

  if (loading || pageLoading) {
    return (
      <div className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] text-white">
      <Navbar />
      <HeroVideoSection />
      <ProductsSlider categories={categories} brands={brands} />
      <ChannelPartner />
      {liveMetals.length > 0 && (
        <MarketRatesWidget metals={liveMetals} />
      )}
      <MemorialSection />
      <Footer />
    </main>
  );
}
