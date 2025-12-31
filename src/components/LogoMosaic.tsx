"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function LogoMosaic() {
  return (
    <div className="w-full bg-[#cfcfcf] rounded-2xl p-4">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        slidesPerView="auto"
        spaceBetween={16}
        speed={10000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        className="overflow-visible"
      >
        {[...Array(6)].map((_, i) => (
          <SwiperSlide key={i} className="!w-auto">
            <MosaicBlock />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}


/* ============================= */
/* ===== ONE MOSAIC PATTERN ==== */
/* ============================= */

function MosaicBlock() {
  return (
    <div
      className="
       flex
       gap-4
      "
    >
      <LogoGrid logos={logos} />
        <div
          key={"sarv"}
          className="flex items-center justify-center aspect-square rounded-xl shadow-md bg-white overflow-hidden"
        >
          <Image
            src={"/partners/sarvottam.png"}
            alt={"Sarvottam"}
            width={160}
            height={320}
            className="object-contain"
            priority
          />
        </div>
        <LogoGrid logos={logos_2} />
    </div>
  );
}

import Image from "next/image";

const logos = [
  { src: "/partners/grow.png", alt: "GrowChem" },
  { src: "/partners/ach.png", alt: "ACH" },
  { src: "/partners/stc.png", alt: "Satish Trading Company" },
  { src: "/partners/ra.png", alt: "RA" },
];

const logos_2 = [
  { src: "/partners/gc.png", alt: "GrowChem" },
  { src: "/partners/ne.png", alt: "ACH" },
  { src: "/partners/rtc.png", alt: "Satish Trading Company" },
  { src: "/partners/kedar.png", alt: "RA" },
];

type Logo = {
  src: string;
  alt: string;
};

type LogoGridProps = {
  logos: Logo[];
};

function LogoGrid({ logos }: LogoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
      {logos.map((logo, index) => (
        <div
          key={index}
          className="flex items-center justify-center aspect-square rounded-xl shadow-md bg-white overflow-hidden"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>
      ))}
    </div>
  );
}


