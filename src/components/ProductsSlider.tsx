"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";

// Define a type for your product data
type Product = {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
};

// Use a more semantically appropriate name for the data array
const products: Product[] = [
  {
    id: 1,
    title: "Electroplating",
    description: "Luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 2,
    title: "Laboratory Reagents",
    description: "Luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 3,
    title: "PH Paper",
    description: "Luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 4,
    title: "Hydrogen Peroxide",
    description: "Luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 5,
    title: "Water Treatment",
    description: "Luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    image: "/partners/partner.png",
    link: "#",
  },
];

export default function ProductsSlider() {
  return (
    <>
      <section className="w-full py-20 px-8 bg-transparent">
        {/* Main container with max-w and center alignment */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          {/* Left side text and view all link */}
          <div className="md:w-1/3 w-full flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-lg uppercase tracking-widest font-light">
                OUR
              </h3>
              <h2 className="text-5xl font-bold text-[#F4E16E] italic leading-tight">
                OFFERED <br /> PRODUCTS
              </h2>
              {/* Horizontal line for visual separation */}
              <div className="w-12 h-0.5 bg-gray-400 my-2"></div>
              <Link
                href="#"
                className="text-gray-300 text-base hover:text-white transition-colors duration-300"
              >
                View all products →
              </Link>
            </div>
          </div>

          {/* Right side slider container */}
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
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  {/* Individual product card */}
                  <div className="flex flex-col rounded-md overflow-hidden bg-white/5 transition-transform duration-300 hover:scale-105">
                    {/* Image container */}
                    <div className="relative w-full h-48 sm:h-64">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    {/* Text section */}
                    <div className="p-4 bg-transparent text-left">
                      <h3 className="text-white text-base font-semibold">
                        {product.title}
                      </h3>
                      <p className="text-gray-300 text-xs mt-1">
                        {product.description}
                      </p>
                      <Link
                        href={product.link}
                        className="text-[#F4E16E] mt-3 inline-block text-sm font-semibold hover:underline"
                      >
                        View products
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom navigation arrows for Swiper */}
            {/* Previous Button (on the top left) */}
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
            {/* Next Button (on the top right) */}
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
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-8">
          <div className="flex flex-col gap-2 mb-8">
            <h3 className="text-white text-lg uppercase tracking-widest font-light">
              OUR
            </h3>
            <h2 className="text-5xl font-bold text-[#F4E16E] italic leading-tight">
              ASSOCIATED COMPANIES
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-start w-full">
            {/* Unique Rubber Logo */}
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <Image
                src="Companies/unique.png"
                alt="Unique Rubber Logo"
                width={500} // Adjust width as needed
                height={70} // Adjust height as needed
                className="object-contain"
                unoptimized
              />
            </div>
            
            {/* Atotech Logo */}
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <Image
                src="Companies/atotech.png"
                alt="Atotech Logo"
                width={500} // Adjust width as needed
                height={70} // Adjust height as needed
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}