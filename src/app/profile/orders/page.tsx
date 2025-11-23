"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderCard from "./OrderCard";
import type { Order } from "@/types/entities";

export default function YourOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (data?.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar type="colored" />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-20">

        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        {loading ? (
          <p className="text-gray-700">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
