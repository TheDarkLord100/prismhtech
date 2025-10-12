"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product, ProductImage, Variant } from "@/types/entities";
import { useCartStore } from "@/utils/store/useCartStore";
import { notify, Notification } from "@/utils/notify";


export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryOrBrand =
    searchParams.get("category") || searchParams.get("brand");

  const [mainProduct, setMainProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { cart, addToCart, loading, updateCartItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;

        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch product details");

        const productData: Product & {
          relatedProducts: Product[];
        } = await res.json();

        console.log("Fetched product data:", productData);

        setMainProduct(productData);
        setRelatedProducts(productData.relatedProducts || []);

        if (productData.ProductVariants?.length) {
          setSelectedVariant(productData.ProductVariants[0]);
        }

        if (productData.productImages?.length) {
          setSelectedImage(productData.productImages[0].image_url);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!mainProduct) return null;

  const price = selectedVariant?.price ?? mainProduct.price ?? 0;

  const total = (price * quantity).toFixed(2);

  const currentCartItem = cart?.items?.find(
    (item) =>
      item.product_id === mainProduct.id &&
      item.variant_id === selectedVariant?.pvr_id
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="bg-[#F2F2F2] flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10 mt-10">
          {/* Breadcrumb */}
          <div className="text-gray-600 mb-10 text-3xl text-start flex flex-wrap gap-2 items-center">
            <span
              className="font-bold text-green-900 relative inline-block cursor-pointer hover:text-green-700"
              onClick={() => router.push("/Products")}
            >
              Products
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-yellow-400"></span>
            </span>
            {" > "}
            {categoryOrBrand && (
              <>
                <span
                  className="font-bold text-green-900 relative inline-block cursor-pointer hover:text-green-700"
                  onClick={() => router.back()}
                >
                  {categoryOrBrand}
                  <span className="absolute left-0 bottom-0 w-full h-[3px] bg-yellow-400"></span>
                </span>
                {" > "}
              </>
            )}
            <span className="font-semibold text-gray-700">
              {mainProduct.name}
            </span>
          </div>

          {/* Main Product Display */}
          <div className="flex flex-col md:flex-row items-start gap-10">
            <div className="flex flex-col gap-4">
              <div className="relative w-full max-w-[700px] aspect-[16/9] rounded-2xl overflow-hidden mx-auto">
                <Image
                  src={
                    selectedImage ||
                    mainProduct.productImages?.[0]?.image_url ||
                    "/Assets/category1.png"
                  }
                  alt={mainProduct.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 700px"
                  priority
                />
              </div>

              <div className="flex gap-3">
                {(mainProduct.productImages || []).map(
                  (img: ProductImage, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`relative w-32 h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition ${selectedImage === img.image_url
                        ? "border-green-600"
                        : "border-gray-200 hover:border-green-500"
                        }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={
                          img.alt_text ||
                          `${mainProduct.name} thumbnail ${idx}`
                        }
                        fill
                        className="object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {mainProduct.ProductVariants?.length ? (
              <div className="flex flex-wrap gap-3 mt-4">
                {mainProduct.ProductVariants.map((variant) => (
                  <div
                    key={variant.pvr_id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg cursor-pointer border-2 transition select-none ${selectedVariant?.pvr_id === variant.pvr_id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-400"
                      }`}
                  >
                    {variant.name || "Unnamed Variant"}
                  </div>
                ))}
              </div>
            ) : null}

            {/* Product Info */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold text-green-500">
                {mainProduct.name}
              </h1>
              <p className="text-3xl font-bold bg-gradient-to-b from-green-900 to-green-400 bg-clip-text text-transparent">
                ₹ {selectedVariant?.price ?? mainProduct.price ?? 0}
              </p>

              <div className="flex flex-col items-start gap-3">
                {currentCartItem && currentCartItem.quantity === 0 ?
                  <><div className="flex items-center bg-gradient-to-b from-green-800 to-green-400 rounded-md overflow-hidden">
                    <button
                      onClick={() =>
                        updateCartItem(
                          currentCartItem.id,
                          Math.max(0, currentCartItem.quantity - 1)
                        )
                      }
                      className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
                    >
                      -
                    </button>

                    <span className="w-9 h-[22px] flex items-center justify-center bg-white text-green-700 font-semibold text-sm select-none mx-2">
                      {currentCartItem.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateCartItem(
                          currentCartItem.id,
                          currentCartItem.quantity + 1
                        )
                      }
                      className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                    <p className="text-gray-500 text-s">
                      In cart: <span className="font-semibold">{currentCartItem.quantity}</span>
                    </p></>
                  :
                  <button
                    onClick={() =>
                      addToCart(mainProduct, selectedVariant!, quantity)
                    }
                    disabled={loading}
                    className="bg-yellow-400 text-white py-2 px-6 rounded-lg font-semibold"
                  >
                    {loading ? "Adding..." : "Add to Cart"}
                  </button>
                }
              </div>

            </div>
          </div>

          {/* Product Details Accordion */}
          <div className="mt-8">
            <details className="bg-gray-100 p-4 rounded-md">
              <summary className="cursor-pointer font-semibold">
                Product details
              </summary>
              <p className="mt-2 text-gray-700">
                {mainProduct.description ||
                  "Detailed description of the product goes here."}
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
                  product={product}
                  key={product.id}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
