"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemorialSection from "@/components/MemorialSection";
import ProductsSlider from "@/components/ProductsSlider";
import { useEffect, useState } from "react";
import type { Category, Brand } from "@/types/entities";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/brands", { cache: "no-store" }),
        ]);

        if (!catRes.ok || !brandRes.ok) throw new Error("Failed to fetch");

        const [cats, brs] = await Promise.all([catRes.json(), brandRes.json()]);
        setCategories(cats);
        setBrands(brs);
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
      <div className="relative w-full h-[100vh] font-['Gotham']">
        <video
          src="/Assets/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full absolute inset-0"
        />

        <div className="absolute bottom-20 left-5 md:left-10 lg:left-20 w-4/5 lg:w-2/5 text-left">
          <div
            className="inline-block px-6 md:px-10 py-6 rounded-2xl
        bg-white/2 backdrop-blur shadow-lg border-t border-b border-white/30"
          >
            <h3 className="text-lg md:text-2xl font-regular text-white/90 drop-shadow-lg">
              Pervesh Rasayan
            </h3>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold italic text-yellow-400 drop-shadow-lg">
              The Chemistry of Lasting Value
            </h1>

            <p className="text-sm md:text-base lg:text-lg mt-6 md:mt-10 lg:mt-16 text-white drop-shadow-md">
              Every product we deliver and every relationship we cultivate must embody
              quality, trust and long-term value. We honor our past by renewing this everyday.           
            </p>
            <button className="mt-4 md:mt-6 flex items-center gap-2 text-white/90 hover:text-white transition">
              <span className="block w-6 md:w-8 h-[1px] bg-white/60" />
              <span className="text-sm md:text-base tracking-wide">Discover</span>
            </button>
          </div>
        </div>
      </div>
      <div className="relative w-full h-[100vh] font-['Gotham']">
        <video
          src="/Assets/hero_2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full absolute inset-0"
        />

        <div className="absolute bottom-20 right-5 md:right-10 lg:right-20 w-4/5 lg:w-2/5 text-left">
          <div
            className="inline-block px-6 md:px-10 py-6 rounded-2xl
        bg-white/10 backdrop-blur shadow-lg border-t border-b border-white/30"
          >
            <h3 className="text-lg md:text-2xl font-regular text-white/90 drop-shadow-lg">
              Quality
            </h3>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold italic text-yellow-400 drop-shadow-lg">
              Built on Decades of Trust
            </h1>

            <p className="text-sm md:text-base lg:text-lg mt-6 md:mt-10 lg:mt-16 text-white drop-shadow-md">
              "Built on 41 years of unwavering service, quality, and dedication. Our foundation is the enduring legacy of Shri M.L. Kakar, whose vision made us the trusted bridge between manufacturers and discerning end-users."
            </p>

            <button className="mt-4 md:mt-6 flex items-center gap-2 text-white/90 hover:text-white transition">
              <span className="block w-6 md:w-8 h-[1px] bg-white/60" />
              <span className="text-sm md:text-base tracking-wide">Discover</span>
            </button>
          </div>
        </div>
      </div>

      <ProductsSlider categories={categories} brands={brands} />
      <MemorialSection />
      <Footer />
    </main>
  );
}
