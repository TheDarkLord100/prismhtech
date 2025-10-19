"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/Assets/Category1.png",
    title: "Pervesh Rasayan",
    subtitle: "The Chemistry of Lasting Value",
    description: "Every product we deliver and every relationship we cultivate must embody quality, trust and long-term value. We honor our past by renewing this everyday."
  },
  {
    image: "/Assets/Category2.png",
    title: "Dolor Sit Amet",
    subtitle: "Second slide content goes here.",
  },
  {
    image: "/Assets/Category3.png",
    title: "Consectetur",
    subtitle: "Third slide with some description.",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative h-[100vh] w-full overflow-hidden font-['Gotham']">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Container MUST be relative for next/image fill */}
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0} // improve LCP for first image
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />


            <div className="absolute bottom-20 left-5 md:left-10 lg:left-20 w-4/5 lg:w-2/5 text-left">
              <div
                className="inline-block px-6 md:px-10 py-6 rounded-2xl 
      bg-white/2 backdrop-blur shadow-lg border-t border-b border-white/30"
              >
                {/* Subtitle */}
                <h3 className="
      text-lg md:text-2xl 
      font-regular text-white/90 drop-shadow-lg
    ">
                  Pervesh Rasayan
                </h3>

                {/* Main Title */}
                <h1 className="
      text-2xl md:text-4xl lg:text-5xl 
      font-bold italic text-yellow-400 drop-shadow-lg
    ">
                  The Chemistry of Lasting Value
                </h1>

                {/* Paragraph */}
                <p className="
      text-sm md:text-base lg:text-lg 
      mt-6 md:mt-10 lg:mt-16 
      text-white drop-shadow-md
    ">
                  Every product we deliver and every relationship we cultivate must embody
                  quality, trust and long-term value. We honor our past by renewing this everyday.
                </p>

                {/* Button */}
                <button className="
      mt-4 md:mt-6 
      flex items-center gap-2 
      text-white/90 hover:text-white transition
    ">
                  <span className="block w-6 md:w-8 h-[1px] bg-white/60" />
                  <span className="text-sm md:text-base tracking-wide">Discover</span>
                </button>
              </div>
            </div>


          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 w-full flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${current === index ? "bg-orange-400" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
