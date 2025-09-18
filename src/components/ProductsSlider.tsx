"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";

type Category = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
};

const companies = [
  { id: 1, name: "Unique Rubber", logo: "/Companies/unique.png" },
  { id: 2, name: "Atotech", logo: "/Companies/atotech.png" },
  { id: 3, name: "Dummy Company 1", logo: "/Companies/unique.png" },
  { id: 4, name: "Dummy Company 2", logo: "/Companies/atotech.png" },
];

export default function ProductsSlider() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <>
      {/* Offered Products Section */}
      <section className="w-full py-20 px-8 bg-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          <div className="md:w-1/3 w-full flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-lg uppercase tracking-widest font-light">
                OUR
              </h3>
              <h2 className="text-5xl font-bold text-[#F4E16E] italic leading-tight">
                OFFERED <br /> PRODUCTS
              </h2>
              <div className="w-12 h-0.5 bg-gray-400 my-2"></div>
              <Link
                href="/Products"
                className="text-gray-300 text-base hover:text-white transition-colors duration-300"
              >
                View all products →
              </Link>
            </div>
          </div>

          <div className="md:w-2/3 w-full relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: ".custom-swiper-button-next",
                prevEl: ".custom-swiper-button-prev",
              }}
              loop
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              className="mySwiper"
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id}>
                  <Link href={`/Products?category=${encodeURIComponent(category.name)}`}>
                    <div className="flex flex-col rounded-md overflow-hidden bg-white/5 transition-transform duration-300 hover:scale-105 cursor-pointer">
                      <div className="relative w-full h-48 sm:h-64">
                        <Image
                          src={category.image_url || "/partners/partner.png"}
                          alt={category.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-4 bg-transparent text-left">
                        <h3 className="text-white text-base font-semibold">
                          {category.name}
                        </h3>
                        <p className="text-gray-300 text-xs mt-1">
                          {category.description}
                        </p>
                        <span className="text-[#F4E16E] mt-3 inline-block text-sm font-semibold hover:underline">
                          View products
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="custom-swiper-button-prev absolute top-4 left-6 z-10 hidden md:block">
              <button
                aria-label="Previous slide"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 transition-colors duration-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            <div className="custom-swiper-button-next absolute top-4 right-6 z-10 hidden md:block">
              <button
                aria-label="Next slide"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 transition-colors duration-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Associated Companies Section */}
      <section className="w-full py-20 px-8 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-8 relative w-full">
          <div className="flex flex-col gap-2 mb-8">
            <h3 className="text-white text-lg uppercase tracking-widest font-light">
              OUR
            </h3>
            <h2 className="text-5xl font-bold text-[#F4E16E] italic leading-tight">
              ASSOCIATED COMPANIES
            </h2>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: ".companies-swiper-button-next",
              prevEl: ".companies-swiper-button-prev",
            }}
            loop
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full"
          >
            {companies.map((company) => (
              <SwiperSlide key={company.id}>
                <div className="flex justify-center items-center">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={500}
                    height={100}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="companies-swiper-button-prev absolute top-1/2 -left-6 z-10 hidden md:block">
            <button
              aria-label="Previous company"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 transition-colors duration-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <div className="companies-swiper-button-next absolute top-1/2 -right-6 z-10 hidden md:block">
            <button
              aria-label="Next company"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 transition-colors duration-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
