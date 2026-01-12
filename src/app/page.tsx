"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemorialSection from "@/components/MemorialSection";
import ProductsSlider from "@/components/ProductsSlider";
import { useEffect, useState } from "react";
import type { Category, Brand } from "@/types/entities";
import Image from "next/image";
import LogoMosaic from "@/components/LogoMosaic";

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
        {/* Video */}
        <video
          src="/Assets/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full absolute inset-0"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(7,7,7,1)_0%,rgba(67,44,17,0)_24%)]" />

        {/* Content */}
        <div className="absolute bottom-20 left-5 md:left-10 lg:left-20 w-4/5 lg:w-2/5 text-left z-10 ">
          <div
            className="inline-block px-6 md:px-10 py-6 rounded-2xl
      bg-black/25 md:bg-white/5 backdrop-blur shadow-lg border-t border-b border-white/30"
          >
            <h3 className="text-lg md:text-2xl text-white/90 drop-shadow-lg">
              Pervesh Rasayan
            </h3>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold italic text-yellow-400 drop-shadow-lg">
              The Chemistry of Lasting Value
            </h1>

            <p className="text-sm md:text-base lg:text-lg mt-6 md:mt-10 lg:mt-16 text-white drop-shadow-md font-extralight md:font-normal">
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
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(7,7,7,1)_0%,rgba(15,32,40,0)_24%)]" />

        <div className="absolute bottom-20 right-5 md:right-10 lg:right-20 w-4/5 lg:w-2/5 text-left">
          <div
            className="inline-block px-6 md:px-10 py-6 rounded-2xl
        bg-black/25 md:bg-white/5 backdrop-blur shadow-lg border-t border-b border-white/30"
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

      <section className="w-full py-20 px-8 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">

          {/* TEXT BLOCK */}
          <div className="w-full flex flex-col gap-6 items-start text-left">
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-lg uppercase tracking-widest font-light">
                OUR
              </h3>
              <h2 className="text-5xl font-bold text-[#F4E16E] italic leading-tight">
                CHANNEL <br /> PARTNERS
              </h2>
              <div className="w-12 h-0.5 bg-gray-400 my-2"></div>
            </div>
          </div>

        </div>

        {/* FULL WIDTH IMAGE */}
          <LogoMosaic />
      </section>

      <MemorialSection />
      <Footer />
    </main>
  );
}
