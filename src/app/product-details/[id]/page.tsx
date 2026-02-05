"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product, ProductImage, Variant } from "@/types/product";
import { useCartStore } from "@/utils/store/useCartStore";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryOrBrand =
    searchParams.get("category") || searchParams.get("brand");

  const [mainProduct, setMainProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const { cart, addToCart, updateCartItem } = useCartStore();

  const itemInCart =
    cart?.items?.find(
      (item) =>
        item.product!.id === id &&
        item.variant!.pvr_id === selectedVariant?.pvr_id
    ) || null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;

        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch product");

        const data: Product = await res.json();

        setMainProduct(data);

        if (data.ProductVariants?.length > 0) {
          setSelectedVariant(data.ProductVariants[0]);
        }

        if (data.productImages?.length > 0) {
          setSelectedImage(data.productImages[0].image_url);
        } else {
          setSelectedImage(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!mainProduct) return null;

  const displayImage =
    selectedImage ??
    mainProduct.productImages?.[0]?.image_url ??
    "/Assets/no_image.png";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10 mt-10">
          {/* Breadcrumb */}
          <div className="text-white mb-10 text-3xl flex flex-wrap gap-2 items-center">
            <span
              className="font-bold cursor-pointer hover:text-yellow-400 relative"
              onClick={() => router.push("/products")}
            >
              Products
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-yellow-400" />
            </span>

            {" > "}

            {categoryOrBrand && (
              <>
                <span
                  className="font-bold cursor-pointer hover:text-green-700 relative"
                  onClick={() => router.back()}
                >
                  {categoryOrBrand}
                  <span className="absolute left-0 bottom-0 w-full h-[3px] bg-yellow-400" />
                </span>
                {" > "}
              </>
            )}

            <span className="font-semibold text-yellow-400">
              {mainProduct.name}
            </span>
          </div>

          {/* ================== MAIN SECTION ================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* ---------- LEFT COLUMN ---------- */}
            <div className="flex flex-col gap-6">
              {/* Main Image */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/10">
                <Image
                  src={displayImage}
                  alt={mainProduct.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {mainProduct.productImages?.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {mainProduct.productImages.map(
                    (img: ProductImage, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img.image_url)}
                        className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition ${selectedImage === img.image_url
                          ? "border-yellow-400"
                          : "border-white/30 hover:border-yellow-400"
                          }`}
                      >
                        <Image
                          src={img.image_url}
                          alt={img.alt_text || `Thumbnail ${idx}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* ---------- RIGHT COLUMN ---------- */}
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-semibold text-green-500">
                {mainProduct.name}
              </h1>

              {/* Variants */}
              {mainProduct.ProductVariants?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {mainProduct.ProductVariants.map((variant) => (
                    <button
                      key={variant.pvr_id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition ${selectedVariant?.pvr_id === variant.pvr_id
                        ? "bg-white text-green-900 border-white"
                        : "border-white/30 text-white hover:border-yellow-400"
                        }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-3xl font-bold text-yellow-400">
                ₹ {selectedVariant?.price ?? 0}
              </p>

              <p className="text-sm text-yellow-400">
                *Prices are exclusive of GST
              </p>
              {itemInCart ? (
                <div className="flex items-center bg-gradient-to-b from-green-800 to-green-400 rounded-md overflow-hidden w-fit">
                  <button
                    onClick={() =>
                      updateCartItem(
                        itemInCart.id,
                        itemInCart.quantity - 1
                      )
                    }
                    className="w-8 h-8 text-white font-bold"
                  >
                    −
                  </button>

                  <span className="w-10 h-8 bg-white/90 text-green-700 font-semibold flex items-center justify-center">
                    {itemInCart.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateCartItem(
                        itemInCart.id,
                        itemInCart.quantity + 1
                      )
                    }
                    className="w-8 h-8 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    addToCart(mainProduct, selectedVariant!, 1)
                  }
                  className="bg-yellow-400 text-green-900 hover:bg-yellow-300 py-2 px-6 rounded-lg font-semibold w-fit"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          {/* ================== PRODUCT DESCRIPTION ================== */}
          <div className="mt-12 border-t border-white/20 pt-6">
            <details open className="p-4 rounded-md">
              <summary className="cursor-pointer font-semibold text-yellow-400 text-lg">
                Product details
              </summary>
              <p className="mt-4 text-white leading-relaxed">
                {mainProduct.description ||
                  "Detailed description of the product goes here."}
              </p>
            </details>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
