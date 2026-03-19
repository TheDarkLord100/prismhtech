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

  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [avgRating, setAvgRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const REVIEWS_PER_PAGE = 5;

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);

      const res = await fetch(`/api/products/review?product_id=${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setAllReviews(data.reviews || []);
      setAvgRating(data.avg_rating || 0);
      setPage(1);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    const start = (page - 1) * REVIEWS_PER_PAGE;
    const end = start + REVIEWS_PER_PAGE;

    setVisibleReviews(allReviews.slice(start, end));
  }, [allReviews, page]);

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
        fetchReviews();
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

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

          <div className="mt-12 border-t border-white/20 pt-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Product Reviews
            </h2>

            {/* AVG RATING */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold text-white">
                {avgRating.toFixed(1)}
              </div>
              {renderStars(Math.round(avgRating))}
            </div>

            {/* REVIEWS LIST */}
            {loadingReviews ? (
              <p className="text-white">Loading reviews...</p>
            ) : visibleReviews.length === 0 ? (
              <p className="text-white">No reviews yet</p>
            ) : (
              <div className="flex flex-col gap-6">
                {visibleReviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white/10 p-4 rounded-xl border border-white/20"
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-white font-semibold">
                        {r.user?.name || "Customer"}
                      </div>

                      <div className="text-xs text-gray-300">
                        {new Date(r.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </div>

                    {/* VARIANT */}
                    <div className="text-sm text-yellow-300 mb-1">
                      {r.variant?.name}
                    </div>

                    {/* STARS */}
                    {renderStars(r.rating)}

                    {/* REVIEW */}
                    <p className="text-white mt-2 text-sm">
                      {r.review}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {
              totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-1 bg-white/20 text-white rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="text-white">
                    {page} / {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-1 bg-white/20 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
