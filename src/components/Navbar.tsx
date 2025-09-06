"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // lock background scroll when menu is open
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 50) {
        // scrolling down
        setHidden(true);
      } else {
        // scrolling up
        setHidden(false);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 bg-transparent backdrop-blur-md transition-transform duration-300
          ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with slight vertical padding */}
            <Link href="/" className="flex h-full items-center py-1.5">
              <Image
                src="/Assets/Logo.png"
                alt="Logo"
                width={150}
                height={80}
                unoptimized
                className="h-full w-auto object-contain"
              />
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-16">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/blogs">Blogs</Link>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact Us</Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <ShoppingCart className="w-5 h-5 cursor-pointer" />
              <Link href="/login"><User className="w-5 h-5 cursor-pointer" /></Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden p-2 rounded-lg"
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? <></> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ease-out
              ${open ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
      >
        {/* Frosted white background */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/60 backdrop-blur-md hover:bg-white/80 transition z-50 pointer-events-auto"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-black" />
        </button>

        {/* Centered menu */}
        <div className="relative h-dvh w-screen grid place-items-center">
          <nav className="flex flex-col items-center gap-8">
            <Link onClick={() => setOpen(false)} href="/" className="text-black text-2xl font-medium">Home</Link>
            <Link onClick={() => setOpen(false)} href="/products" className="text-black text-2xl font-medium">Products</Link>
            <Link onClick={() => setOpen(false)} href="/blogs" className="text-black text-2xl font-medium">Blogs</Link>
            <Link onClick={() => setOpen(false)} href="/about" className="text-black text-2xl font-medium">About Us</Link>
            <Link onClick={() => setOpen(false)} href="/contact" className="text-black text-2xl font-medium">Contact Us</Link>

            <div className="flex gap-6 pt-2">
              <ShoppingCart className="w-7 h-7 text-black" />
              <User className="w-7 h-7 text-black" />
            </div>
          </nav>
        </div>
      </div>

    </>
  );
}
