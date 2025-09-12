"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

type Product = {
  name: string;
  price: number;
  img: string;
};

const productsList: Product[] = [
  { name: "Aluminum Scrap", price: 23.6, img: "/Assets/category1.png" },
  { name: "Copper Scrap", price: 45.5, img: "/Assets/category2.png" },
  { name: "Plastic Scrap", price: 12.3, img: "/Assets/category3.png" },
  { name: "Iron Scrap", price: 15.0, img: "/Assets/category1.png" },
];

export default function ProductDetailsPage() {
  const [mainProduct, setMainProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    setMainProduct(productsList[0]);
    setRelatedProducts(productsList.slice(1));
  }, []);

  const handleProductClick = (clickedProduct: Product) => {
    if (!mainProduct) return;

    setRelatedProducts((prev) => {
      return [mainProduct, ...prev.filter((p) => p.name !== clickedProduct.name)];
    });

    setMainProduct(clickedProduct);
    setQuantity(1);
  };

  if (!mainProduct) return null;

  const total = (mainProduct.price * quantity).toFixed(1);

  return (
    <>
      <Navbar />
      {/* push the whole content down */}
      <div className="max-w-6xl mx-auto px-6 py-10 mt-10">
        {/* Search bar at the top center */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </div>
        </div>

        {/* Breadcrumb below search */}
        <div className="text-gray-600 mb-10 text-3xl text-start">
          <span className="font-bold text-green-900 relative inline-block">
            Products
            <span className="absolute left-0 bottom-0 w-full h-[3px] bg-yellow-400"></span>
          </span>{" "}
          {" > "} Electroplating {" > "} {mainProduct.name}
        </div>

        {/* Main Product Display */}
        <div className="flex flex-col md:flex-row items-start gap-10">
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative w-[700px] h-[400px] rounded-2xl overflow-hidden">
              <Image
                src={mainProduct.img}
                alt={mainProduct.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="relative w-32 h-32 rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-green-500"
                >
                  <Image
                    src={mainProduct.img}
                    alt={`${mainProduct.name} thumbnail ${num}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-green-500">{mainProduct.name}</h1>
            <p className="text-3xl font-bold bg-gradient-to-b from-green-900 to-green-400 bg-clip-text text-transparent">
              ₹ {mainProduct.price} per Kg
            </p>

            {/* Incremental Quantity UI */}
            <div className="flex flex-col justify-start items-start">
              <div className="flex items-center bg-gradient-to-b from-green-800 to-green-400 rounded-md overflow-hidden ">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
                >
                  -
                </button>

                <span className="w-9 h-[22px] flex items-center justify-center bg-white text-green-700 font-semibold text-sm select-none mx-2">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
                >
                  +
                </button>
              </div>

              <p className="text-gray-500 text-s mt-1">
                Total: <span className="font-semibold text-gray-500">₹ {total}</span>
              </p>
            </div>

            <button className="bg-yellow-400 text-white py-2 px-6 rounded-lg">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="mt-8">
          <details className="bg-gray-100 p-4 rounded-md">
            <summary className="cursor-pointer font-semibold">Product details</summary>
            <p className="mt-2 text-gray-700">
              Detailed description of the product goes here.
            </p>
          </details>
        </div>

        {/* Relevant Products */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-yellow-500 mb-4">Relevant products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((product, idx) => (
              <ProductCard
                key={idx}
                name={product.name}
                price={product.price}
                img={product.img}
                onClick={() => handleProductClick(product)}
                isMain={false}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
