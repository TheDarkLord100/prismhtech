"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Order } from "@/types/entities";

export default function OrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState<Order>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          setOrder(data.order);
          setItems(data.items ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
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
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600 text-xl">Order not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] py-16 px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-8">

          {/* ORDER HEADER */}
          <h1 className="text-3xl font-bold mb-6 text-green-700">Order Summary</h1>
          {/* ORDER STATUS */}
          <div className="mb-6">
            <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold
    bg-green-100 text-green-700 border border-green-300">
              {order.status}
            </div>

            {order.status_description && (
              <p className="text-gray-700 mt-2">
                {order.status_description}
              </p>
            )}
          </div>

          <p className="text-gray-700 mb-2">
            <strong>Order ID:</strong> {order.id}
          </p>
          <p className="text-gray-700 mb-6">
            <strong>Order Date:</strong>{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>

          {/* ORDER ITEMS */}
          <h2 className="text-2xl font-semibold mb-4">Items</h2>
          <div className="flex flex-col gap-6 mb-8">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border rounded-xl p-4"
              >
                {/* IMAGE */}
                <img
                  src={
                    item.product.productImages?.[0]?.image_url ??
                    "/placeholder.png"
                  }
                  className="w-20 h-20 object-cover rounded-lg"
                />

                {/* DETAILS */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">
                    ₹{item.product.price} × {item.quantity}
                  </p>
                </div>

                {/* SUBTOTAL */}
                <p className="text-lg font-semibold">
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="border-t pt-4 mb-10">
            <p className="text-xl font-bold text-right">Total: ₹{total}</p>
          </div>

          {/* ADDRESSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* BILLING ADDRESS */}
            <div className="border rounded-xl p-5">
              <h3 className="text-xl font-semibold mb-3">Billing Address</h3>
              <p>{order.billing_address?.name}</p>
              <p>{order.billing_address?.address_l1}, {order.billing_address?.address_l2}</p>
              <p>
                {order.billing_address?.city}, {order.billing_address?.state} -{" "}
                {order.billing_address?.pincode}
              </p>
              <p>Phone: {order.billing_address?.phone}</p>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="border rounded-xl p-5">
              <h3 className="text-xl font-semibold mb-3">Shipping Address</h3>
              <p>{order.shipping_address?.name}</p>
              <p>{order.shipping_address?.address_l1}, {order.shipping_address?.address_l2}</p>
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.state} -{" "}
                {order.shipping_address?.pincode}
              </p>
              <p>Phone: {order.shipping_address?.phone}</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
