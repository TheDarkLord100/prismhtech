"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

import type { Category, Brand } from "@/types/entities";

export default function ProductsSlider({
  categories,
  brands,
}: {
  categories: Category[];
  brands: Brand[];
}) {
  return (
    <>
      {/* Offered Products Section */}
      <section className="w-full py-20 px-8 bg-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          {/* Left heading */}
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

          {/* Right carousel */}
          <div className="md:w-2/3 w-full relative">
            {categories.length === 0 ? (
              <p className="text-white text-lg">No categories found.</p>
            ) : (
              <div className="relative">
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
                >
                  {categories.map((category) => (
                    <SwiperSlide key={category.id} className="!h-auto">
                      <Link
                        href={`/Products?categoryId=${category.id}&categoryName=${encodeURIComponent(
                          category.name
                        )}`}
                      >
                        <div className="flex flex-col h-full rounded-md overflow-hidden bg-white/5 transition-transform duration-300 hover:scale-105 cursor-pointer">
                          <div className="relative w-full h-48 sm:h-64">
                            <Image
                              src={category.image_url || "/partners/partner.png"}
                              alt={category.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-4 text-left flex flex-col flex-1">
                            <h3 className="text-white text-base font-semibold">
                              {category.name}
                            </h3>
                            <p className="text-gray-300 text-xs mt-1 flex-1">
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
                {/* LEFT BUTTON */}
                <button
                  className="custom-swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2
             w-10 h-10 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 
             flex items-center justify-center transition z-100"
                >
                  {/* Left Arrow Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* RIGHT BUTTON */}
                <button
                  className="custom-swiper-button-next absolute right-2 top-1/2 -translate-y-1/2
             w-10 h-10 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 
             flex items-center justify-center transition z-100"
                >
                  {/* Right Arrow Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

            )}
          </div>
        </div>
      </section>

      {/* Associated Companies */}
      <section className="w-full py-20 px-8 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-8 relative w-full">
          <div className="flex flex-col gap-2 mb-8">
            <h3 className="text-white text-lg uppercase tracking-widest font-light">OUR</h3>
            <h2 className="text-5xl font-bold text-[#F4E16E] italic leading-tight">
              ASSOCIATED COMPANIES
            </h2>
          </div>

          {brands.length === 0 ? (
            <p className="text-white text-lg">No brands found.</p>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: ".companies-swiper-button-next",
                prevEl: ".companies-swiper-button-prev",
              }}
              loop
              speed={3000}
              autoplay={{ delay: 0, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full"
            >
              {brands.map((brand) => (
                <SwiperSlide key={brand.id}>
                  <Link
                    href={`/Products?brandId=${brand.id}&brandName=${encodeURIComponent(
                      brand.name
                    )}`}
                  >
                    <div className="flex justify-center items-center cursor-pointer hover:opacity-90 transition">
                      {brand.logo_url ? (
                        <Image
                          src={brand.logo_url}
                          alt={brand.name}
                          width={500}
                          height={100}
                          className="object-contain h-60"
                          unoptimized
                        />
                      ) : (
                        <p className="text-gray-400">No Logo</p>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    </>
  );
}
