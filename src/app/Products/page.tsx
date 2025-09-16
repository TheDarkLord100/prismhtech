"use client";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState, useRef } from "react";
import Link from "next/link"; // ✅ For navigation

// Type for products
type Product = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string;
  priceType?: "fixed" | "variable";
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Loader state
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortMenu(false);
      }
    };

    if (showSortMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortMenu]);

  // Sorting logic
  const handleSort = (type: string) => {
    const sorted = [...products];
    if (type === "high-to-low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (type === "low-to-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (type === "rating") {
      console.log("Sort by rating");
    } else if (type === "popularity") {
      console.log("Sort by popularity");
    } else if (type === "discount") {
      console.log("Sort by discount");
    }
    setProducts(sorted);
    setSelectedSort(type);
    setShowSortMenu(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-10 bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
        {/* Search Bar */}
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
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 
                bg-white/20 border border-white/30 rounded-full 
                text-white placeholder-gray-200
                focus:outline-none focus:border-purple-400 
                backdrop-blur-sm transition-colors"
            />
          </div>
        </div>

        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-10 w-full max-w-7xl mx-auto px-2 sm:px-4 relative">
          <h1 className="text-2xl font-semibold text-white relative inline-block">
            Products
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full mt-1" />
          </h1>

          <div className="flex items-center gap-6 text-sm">
            {/* Sort */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className={`flex items-center gap-2 text-white px-3 py-1 rounded-md transition 
                  ${selectedSort ? "border-2 border-purple-500" : ""}`}
              >
                <span className="text-gray-200">Sort</span>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-purple-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
                  </svg>
                </div>
              </button>

              {/* Dropdown menu */}
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-200 rounded-lg shadow-lg z-50">
                  <p className="px-4 py-2 text-sm text-gray-400 border-b border-gray-600">
                    Sort by
                  </p>
                  <button
                    onClick={() => handleSort("high-to-low")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Price - high to low
                  </button>
                  <button
                    onClick={() => handleSort("low-to-high")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Price - low to high
                  </button>
                  <button
                    onClick={() => handleSort("rating")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Customer Rating
                  </button>
                  <button
                    onClick={() => handleSort("popularity")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Popularity
                  </button>
                  <button
                    onClick={() => handleSort("discount")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Discount
                  </button>
                </div>
              )}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-200">Filter</span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex justify-center">
          {loading ? (
            // ✅ Built-in loader
            <div className="flex justify-center items-center h-40 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-0 max-w-7xl w-full px-2 sm:px-4">
              {products.map((p) => (
                <div key={p.id} className="flex justify-center">
                  {/* ✅ Wrap ProductCard with Link */}
                  <Link href={`/ProductDetails/${p.id}`} className="block w-full">
                    <ProductCard
                      name={p.name}
                      price={p.price}
                      img={p.images?.[0] || "/Assets/category1.png"}
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
