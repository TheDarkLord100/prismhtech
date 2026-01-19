"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Order } from "@/types/entities";

const STATUS_ORDER = [
  "Order placed",
  "Order accepted",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function PaymentBadge({ status }: { status?: string }) {
  if (status === "SUCCESS") {
    return <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">Paid</span>;
  }
  if (status === "FAILED") {
    return <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">Payment Failed</span>;
  }
  return <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending Payment</span>;
}

export default function OrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Order data:", data);
        if (data?.order) setOrder(data.order);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-transparent"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-red-600">
          Order not found
        </div>
        <Footer />
      </>
    );
  }

  const historyMap = new Map(
    order.history?.map(h => [h.new_status, h.changed_at])
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] py-16 px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-8">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">Order Summary</h1>
            <PaymentBadge status={order.payment_status} />
          </div>

          <p className="text-gray-700 mb-1"><strong>Order ID:</strong> {order.id}</p>
          <p className="text-gray-700 mb-6">
            <strong>Placed on:</strong>{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN")}
          </p>

          {/* STATUS TIMELINE */}
          <div className="space-y-3 mb-8">
            {STATUS_ORDER.map((status) => {
              let isActive = false;
              let date: string | undefined;

              // ✅ Order placed is ALWAYS active
              if (status === "Order placed") {
                isActive = true;
                date = order.created_at;
              } else {
                date = historyMap.get(status);
                isActive = Boolean(date);
              }

              return (
                <div key={status} className="flex items-center gap-3">
                  {/* Dot */}
                  <div
                    className={`w-3 h-3 rounded-full ${isActive ? "bg-green-600" : "bg-gray-300"
                      }`}
                  />

                  {/* Label */}
                  <span className={isActive ? "font-medium text-black" : "text-gray-500"}>
                    {status}
                  </span>

                  {/* Date */}
                  {date && (
                    <span className="text-sm text-gray-500">
                      ({new Date(date).toLocaleDateString("en-IN")})
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ITEMS */}
          <h2 className="text-2xl font-semibold mb-4">Items</h2>
          <div className="space-y-4 mb-8">
            {order.items?.map(item => (
              <div key={item.id} className="flex items-center gap-4 border rounded-xl p-4">
                <img
                  src={item.product?.productImages?.[0]?.image_url ?? "/placeholder.png"}
                  className="w-20 h-20 rounded object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-gray-600">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* PRICE SUMMARY */}
          <div className="border-t pt-4 space-y-2 text-right">
            <p>Subtotal: ₹{order.subtotal_amount}</p>

            {order.gst_type === "CGST_SGST" ? (
              <>
                <p>CGST (9%): ₹{order.cgst_amount}</p>
                <p>SGST (9%): ₹{order.sgst_amount}</p>
              </>
            ) : (
              <p>IGST (18%): ₹{order.igst_amount}</p>
            )}

            <p className="text-xl font-bold text-green-700">
              Total: ₹{order.total_amount}
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
