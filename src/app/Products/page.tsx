"use client";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: "Aluminum Scrap",
    price: 23.6,
    img: "/Assets/category1.png",
  }));

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
        <div className="flex justify-between items-center mb-10 w-full max-w-7xl mx-auto px-2 sm:px-4">
          <h1 className="text-2xl font-semibold text-white relative inline-block">
            Products
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full mt-1" />
          </h1>

          <div className="flex items-center gap-6 text-sm">
            {/* Sort */}
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-200">Sort</span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
                </svg>
                <span className="font-medium">Default</span>
              </div>
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
                <span className="font-medium">All</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-0 max-w-7xl w-full px-2 sm:px-4">
            {products.map((p) => (
              <div key={p.id} className="flex justify-center">
                <ProductCard name={p.name} price={p.price} img={p.img} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
