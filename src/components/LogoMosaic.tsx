"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Logo = {
  id: number;
  src: string;
  alt: string;
};

const slideA: Logo[] = [
  { id: 1, src: "/partners/grow.png", alt: "GC" },
  { id: 2, src: "/partners/ach.png", alt: "ACH" },
  { id: 3, src: "/partners/stc.png", alt: "STC" },
  { id: 4, src: "/partners/ra.png", alt: "RA" },
];

const slideB: Logo[] = [
  { id: 5, src: "/partners/gc.png", alt: "GC" },
  { id: 6, src: "/partners/rtc.png", alt: "RTC" },
  { id: 7, src: "/partners/ne.png", alt: "NE" },
  { id: 8, src: "/partners/kedar.png", alt: "Kedar" },
];

const commonLogo: Logo = {
  id: 9,
  src: "/partners/sarvottam.png",
  alt: "Sarvottam",
};

const commonLogo2: Logo = {
  id: 10,
  src: "/partners/all.png",
  alt: "All Stars",
}

export default function LogoMosaic() {
  const [active, setActive] = useState<0 | 1>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-72 md:h-72 lg:h-140 overflow-hidden">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {/* Slide A */}
        <Slide logos={slideA} commonSide="right" />

        {/* Slide B */}
        <Slide logos={slideB} commonSide="left" />
      </div>
    </div>
  );
}

function Slide({ logos, commonSide }: { logos: Logo[]; commonSide: "left" | "right" }) {
  const [a, b, c, d] = logos;

  return (
    <div className="flex-[0_0_100%] grid grid-cols-3 grid-rows-2 gap-4 p-4">
      {commonSide === "left" ? (
        <>
          <div className="row-span-2">
            <LogoCard logo={commonLogo} />
          </div>

          <LogoCard logo={a} />
          <LogoCard logo={b} />
          <LogoCard logo={c} />
          <LogoCard logo={d} />
        </>
      ) : (
        <>
          <LogoCard logo={a} />
          <LogoCard logo={b} />
          <div className="row-span-2">
            <LogoCard logo={commonLogo2} />
          </div>

          <LogoCard logo={c} />
          <LogoCard logo={d} />
        </>
      )}
    </div>
  );
}



function LogoCard({ logo }: { logo: Logo }) {
  return (
    <div className="relative bg-white w-full h-full ">
      <Image
        src={logo.src}
        alt={logo.alt}
        fill
        className="object-contain"
      />
    </div>
  );
}
