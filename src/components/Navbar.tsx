"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User, ChevronDown, ChevronRight } from "lucide-react";
import { useUserStore } from "@/utils/store/userStore";
import { useAppStore } from "@/utils/store/useAppStore";

type SubmenuType = "category" | "brand" | null;

export default function Navbar({ type = "transparent" }: { type?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [productsOpen, setProductsOpen] = useState(false);
  const [submenu, setSubmenu] = useState<SubmenuType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useUserStore((s) => s.user);
  const { categories, brands } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 50) setHidden(true);
      else setHidden(false);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
        setSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setProductsOpen(false);
    setSubmenu(null);
    setMobileOpen(false);
    setMobileProductsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 
          ${type !== "transparent" ? "bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]" : ""}
          ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="absolute inset-0 bg-transparent backdrop-blur-md z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between text-white">
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

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-16">
              <Link href="/">Home</Link>

              {/* Products dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => { setProductsOpen((v) => !v); setSubmenu(null); }}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                </button>

                {productsOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-xl shadow-2xl border border-white/10"
                    style={{ background: "linear-gradient(135deg, #16463B, #317A45)" }}
                  >
                    <Link
                      href="/products"
                      onClick={closeAll}
                      className="flex items-center px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors border-b border-white/10 rounded-t-xl"
                    >
                      View All Products
                    </Link>

                    <button
                      onMouseEnter={() => setSubmenu("category")}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
                        ${submenu === "category" ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                    >
                      View by Category
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onMouseEnter={() => setSubmenu("brand")}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors rounded-b-xl
                        ${submenu === "brand" ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                    >
                      View by Brand
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {submenu && (
                      <div
                        className="absolute left-full top-0 ml-2 w-52 rounded-xl shadow-2xl border border-white/10"
                        style={{ background: "linear-gradient(135deg, #16463B, #317A45)" }}
                      >
                        {(submenu === "category" ? categories : brands).map((item, index, arr) => (
                          <Link
                            key={item.id}
                            href={
                              submenu === "category"
                                ? `/products?categoryId=${item.id}&categoryName=${encodeURIComponent(item.name)}`
                                : `/products?brandId=${item.id}&brandName=${encodeURIComponent(item.name)}`
                            }
                            onClick={closeAll}
                            className={`block px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors
                              ${index === 0 ? "rounded-t-xl" : ""}
                              ${index === arr.length - 1 ? "rounded-b-xl" : ""}`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link href="/forum">Blogs</Link>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact Us</Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/cart"><ShoppingCart className="w-5 h-5 cursor-pointer" /></Link>
              <Link href={user ? "/profile" : "/login"}><User className="w-5 h-5 cursor-pointer" /></Link>
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg relative z-20"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? null : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-[600] md:hidden transition-all duration-300 ease-out
          ${mobileOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />

        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg backdrop-blur-md hover:bg-white/80 transition z-50"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-black" />
        </button>

        <div className="relative h-dvh w-screen overflow-y-auto py-16">
          <nav className="flex flex-col items-center gap-6 w-full px-8">
            <Link onClick={closeAll} href="/" className="text-black text-2xl font-medium">Home</Link>

            <div className="w-full flex flex-col items-center gap-3">
              <button
                onClick={() => setMobileProductsOpen((v) => !v)}
                className="text-black text-2xl font-medium flex items-center gap-2"
              >
                Products
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileProductsOpen && (
                <div className="w-full flex flex-col items-center gap-2">
                  <Link onClick={closeAll} href="/products" className="text-black/70 text-lg">View All</Link>

                  <p className="text-xs uppercase tracking-widest text-black/40 mt-3">By Category</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?categoryId=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                      onClick={closeAll}
                      className="text-black/70 text-base hover:text-black transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}

                  <p className="text-xs uppercase tracking-widest text-black/40 mt-3">By Brand</p>
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/products?brandId=${brand.id}&brandName=${encodeURIComponent(brand.name)}`}
                      onClick={closeAll}
                      className="text-black/70 text-base hover:text-black transition-colors"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link onClick={closeAll} href="/forum" className="text-black text-2xl font-medium">Blogs</Link>
            <Link onClick={closeAll} href="/about" className="text-black text-2xl font-medium">About Us</Link>
            <Link onClick={closeAll} href="/contact" className="text-black text-2xl font-medium">Contact Us</Link>

            <div className="flex gap-6 pt-2">
              <Link href="/cart" onClick={closeAll}><ShoppingCart className="w-7 h-7 text-black" /></Link>
              <Link href={user ? "/profile" : "/login"} onClick={closeAll}><User className="w-7 h-7 text-black" /></Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}