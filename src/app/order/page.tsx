"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import { Order, OrderItem } from "@/types/entities";

export default function OrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch order info using the order_id
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (data?.order) {
          setOrder({
            ...data.order,
            items: data.items ?? [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] min-h-screen flex justify-center py-16 px-4">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">

          {/* LEFT CONTENT SECTION */}
          <div className="flex-1 flex flex-col gap-8">

            {/* SUCCESS HEADER */}
            <section className="bg-[#FFFAED] rounded-4xl shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold text-green-700">
                  Order Successfully Placed
                </h2>
              </div>

              {/* Step Indicator at Step 3 */}
              <StepIndicator currentStep={4} />

              <hr className="my-5 border-t border-gray-300" />

              {/* ORDER DETAILS */}
              {loading ? (
                <p className="text-gray-700">Loading order details...</p>
              ) : order ? (
                <div className="flex gap-6 mt-6">

                  {/* LEFT — Product Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={
                        order.items?.[0].product?.productImages?.[0]?.image_url ??
                        "/placeholder.png"
                      }
                      alt={order.items?.[0].product?.name ?? "Product"}
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                  </div>

                  {/* RIGHT — Details */}
                  <div className="flex flex-col gap-3">

                    {/* Expected Delivery */}
                    <h3 className="text-xl font-semibold text-gray-900">
                      Delivery expected by "N/A"
                    </h3>

                    {/* Ordered time */}
                    <p className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-600 text-lg">✔</span>
                      Ordered {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })
                        : ""}
                    </p>

                    {/* Shipping Status */}
                    <p className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400 text-lg">○</span>
                      Not shipped yet
                    </p>

                    {/* Expected Delivery */}
                    <p className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400 text-lg">○</span>
                      Expected delivery "N/A"
                    </p>

                    {/* Product Name */}
                    <p className="text-blue-700 hover:underline text-sm font-medium max-w-xl leading-tight">
                      {order.items?.[0].product?.name ?? "Unnamed Product"}
                      {(order.items?.length) > 1 && (
                        <span className="text-gray-600 ml-2">
                          +{order.items.length - 1} more item
                          {order.items.length - 1 > 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-red-600">Could not load order details.</p>
              )}

              <button
                onClick={() => router.push("/")}
                className="w-full bg-green-600 hover:bg-green-700 text-white my-5 py-3 rounded-xl text-lg font-medium"
              >
                Continue Shopping
              </button>
            </section>
          </div>

        
        </div>
      </main>

      <Footer />
    </>
  );
}
