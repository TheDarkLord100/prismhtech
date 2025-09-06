"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";

type Partner = {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
};

const partners: Partner[] = [
  {
    id: 1,
    title: "Electroplating",
    description: "Luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 2,
    title: "Metal Finishing",
    description: "High-quality coating and durability solutions.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 3,
    title: "Surface Treatment",
    description: "Advanced processes for better performance.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 4,
    title: "Anodizing",
    description: "Durable surface coating for protection and aesthetics.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 5,
    title: "Powder Coating",
    description: "Environmentally friendly, long-lasting finish.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 6,
    title: "Galvanizing",
    description: "Corrosion resistance through zinc coating.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 7,
    title: "Polishing",
    description: "Smooth finishes for a premium look and feel.",
    image: "/partners/partner.png",
    link: "#",
  },
  {
    id: 8,
    title: "Heat Treatment",
    description: "Enhancing strength and durability of metals.",
    image: "/partners/partner.png",
    link: "#",
  },
];

export default function PartnerSlider() {
  return (
    <div className="w-full py-20 px-8 bg-gradient-to-r from-green-900 via-green-800 to-green-700">
      <div className="flex flex-col md:flex-row items-start justify-between gap-12 max-w-7xl mx-auto">
        
        {/* Slider on Left Side */}
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
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="flex flex-col">
                  {/* Image */}
                  <div className="relative w-full h-52">
                    <Image
                      src={partner.image}
                      alt={partner.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Transparent Text Section */}
                  <div className="p-4 bg-transparent">
                    <h3 className="text-white text-lg font-semibold">
                      {partner.title}
                    </h3>
                    <p className="text-gray-200 text-sm mt-1">
                      {partner.description}
                    </p>
                    <a
                      href={partner.link}
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

        {/* Static Section on Right Side */}
        <div className="md:w-1/3">
          <h3 className="text-white text-lg uppercase tracking-widest">Our</h3>
          <h2 className="text-5xl font-bold text-yellow-400 leading-tight">
            OFFERED <br /> PRODUCTS
          </h2>
        </div>
      </div>
    </div>
  );
}
