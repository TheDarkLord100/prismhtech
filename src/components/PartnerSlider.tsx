"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";

type Brand = {
  id: string;
  name: string;
  logo_url: string | null; // already full URL
};

export default function PartnerSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/brands", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error("Failed to fetch brands");

        const data: Brand[] = await res.json();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!brands || brands.length === 0) return <p className="text-white">No brands found.</p>;

  return (
    <div className="w-full py-20 px-8 bg-transparent">
      <div className="flex flex-col md:flex-row items-start justify-between gap-12 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="md:w-1/3">
          <h3 className="text-white text-lg uppercase tracking-widest">Our</h3>
          <h2 className="text-5xl font-bold text-yellow-400 leading-tight">
            CHANNEL <br /> PARTNERS
          </h2>
        </div>

        {/* Right Section */}
        <div className="md:w-2/3 w-full">
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={3}
            navigation
            loop
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <div className="flex flex-col">
                  {/* Brand Logo */}
                  <div className="relative w-full h-52 bg-gray-900 flex items-center justify-center">
                    {brand.logo_url ? (
                      <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        fill
                        className="object-contain p-6"
                        unoptimized
                      />
                    ) : (
                      <p className="text-gray-400">No Logo</p>
                    )}
                  </div>

                  {/* Brand Name */}
                  <div className="p-4 bg-transparent text-center">
                    <h3 className="text-white text-lg font-semibold">{brand.name}</h3>
                    <a
                      href={`/Products?brand=${brand.id}`}
                      className="text-yellow-400 mt-3 inline-block text-sm font-semibold hover:underline"
                    >
                      View products
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
