"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types/entities";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [mainProduct, setMainProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");

        const allProducts: Product[] = await res.json();
        const product = allProducts.find((p) => p.id === id) || null;

        setMainProduct(product);

        if (product?.images?.length) {
          setSelectedImage(product.images[0].image_url);
        }

        setRelatedProducts(allProducts.filter((p) => p.id !== id).slice(0, 3));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!mainProduct) return null;

  const total = (mainProduct.price * quantity).toFixed(1);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar with gradient inside */}
      <Navbar />

      {/* Main content with white background */}
      <main className="bg-white flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10 mt-10">
          {/* Breadcrumb */}
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
                  src={selectedImage || mainProduct.images?.[0].image_url || "/Assets/category1.png"}
                  alt={mainProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {(mainProduct.images || ["/Assets/category1.png"]).map(
                  (img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`relative w-32 h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition ${
                        selectedImage === img.image_url
                          ? "border-green-600"
                          : "border-gray-200 hover:border-green-500"
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={`${mainProduct.name} thumbnail ${idx}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold text-green-500">
                {mainProduct.name}
              </h1>
              <p className="text-3xl font-bold bg-gradient-to-b from-green-900 to-green-400 bg-clip-text text-transparent">
                ₹ {mainProduct.price} per Kg
              </p>

              {/* Incremental Quantity UI */}
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center bg-gradient-to-b from-green-800 to-green-400 rounded-md overflow-hidden">
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
              <summary className="cursor-pointer font-semibold">
                Product details
              </summary>
              <p className="mt-2 text-gray-700">
                {mainProduct.description || "Detailed description of the product goes here."}
              </p>
            </details>
          </div>

          {/* Relevant Products */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-yellow-500 mb-4">
              Relevant products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard
                  id={product.id}
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  img={product.images?.[0].image_url || "/Assets/category1.png"}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer with gradient background */}
      <Footer />
    </div>
  );
}
