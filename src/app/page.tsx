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

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [liveMetals, setLiveMetals] = useState<Metal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, brandRes, metalsRes] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/brands", { cache: "no-store" }),
          fetch("/api/live-prices", { cache: "no-store" }),
        ]);

        if (!catRes.ok || !brandRes.ok) throw new Error("Failed to fetch");

        const [cats, brs] = await Promise.all([
          catRes.json(),
          brandRes.json()
        ]);

        setCategories(cats);
        setBrands(brs);

        if (metalsRes.ok) {
          const metalsData = await metalsRes.json();
          setLiveMetals(metalsData.metals);
        } else {
          setLiveMetals([]);
        }

      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
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
