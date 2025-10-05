"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useUserStore } from "@/utils/store/userStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const user = useUserStore((s) => s.user);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 50) {
        setHidden(true);
      } else {
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
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300
    ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* Gradient background behind frosted blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] backdrop-blur-md z-0" />

        {/* Navbar content above the blur */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between text-white">
            {/* Logo */}
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
              <Link href="/Products">Products</Link>
              <Link href="/blogs">Blogs</Link>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact Us</Link>
            </div>

            {/* Desktop icons */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/Cart">
                <ShoppingCart className="w-5 h-5 cursor-pointer" />
              </Link>
              <Link href={user ? "/profile" : "/login"}>
                <User className="w-5 h-5 cursor-pointer" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden p-2 rounded-lg relative z-20"
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? null : <Menu />}
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
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/60 backdrop-blur-md hover:bg-white/80 transition z-50"
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
              <Link href="/Cart">
                <ShoppingCart className="w-7 h-7 text-black" />
              </Link>
              <Link href={user ? "/profile" : "/login"}>
                <User className="w-7 h-7 text-black" />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
