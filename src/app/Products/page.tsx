// app/products/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Product } from "@/types/entities";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortType, setSortType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search state
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const category = searchParams.get("category"); // category.id
  const brand = searchParams.get("brand"); // brand.id

  /** 🔹 Fetch Products */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const url = new URL("/api/products", window.location.origin);

      if (category) url.searchParams.set("category", category);
      if (brand) url.searchParams.set("brand", brand);

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [category, brand]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /** 🔹 Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** 🔹 Filter + Sort */
  const visibleProducts = useMemo(() => {
    let result = [...products];

    // filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    // sort if needed
    if (sortType === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortType === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [products, searchTerm, sortType]);

  /** 🔹 Full page loader */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  // Handle card click navigation
  const handleCardClick = (id: string) => {
    router.push(`/ProductDetails/${id}`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-10 bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
        
        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-14">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // ✅ controlled input
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 
                bg-white/20 border border-white/30 rounded-full 
                text-white placeholder-gray-200
                focus:outline-none focus:border-purple-400 
                backdrop-blur-sm transition-colors"
            />
          </div>
        </div>

        {/* 🏷️ Header + Sort */}
        <div className="flex justify-between items-center mb-10 w-full max-w-7xl mx-auto px-2 sm:px-4 relative">
          <h1 className="text-2xl font-semibold text-white relative inline-block">
            {category
              ? `Products in category`
              : brand
              ? `Products by brand`
              : "All Products"}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full mt-1" />
          </h1>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowSortMenu((prev) => !prev)}
              className={`flex items-center gap-2 text-white px-3 py-1 rounded-md transition 
                ${sortType ? "border-2 border-purple-500" : ""}`}
            >
              <span className="text-gray-200">Sort</span>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-200 rounded-lg shadow-lg z-50">
                <p className="px-4 py-2 text-sm text-gray-400 border-b border-gray-600">
                  Sort by
                </p>
                <button
                  onClick={() => setSortType("high-to-low")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  Price - high to low
                </button>
                <button
                  onClick={() => setSortType("low-to-high")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  Price - low to high
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🛍️ Product Grid */}
        <div className="flex justify-center mb-10">
          {visibleProducts.length === 0 ? (
            <p className="text-white text-lg">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-0 max-w-7xl w-full px-2 sm:px-4">
              {visibleProducts.map((p) => (
                <div key={p.id} className="flex justify-center">
                  <ProductCard
                    name={p.name}
                    price={p.price}
                    img={p.images?.[0] || "/Assets/category1.png"}
                    onClick={() => router.push(`/ProductDetails/${p.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
}
