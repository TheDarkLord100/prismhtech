"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, MapPin, CreditCard, Package } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const accountOptions = [
    {
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      icon: <Package size={32} className="text-green-600" />,
      href: "/profile/orders",
    },
    {
      title: "Login & security",
      desc: "Edit login, name, and mobile number",
      icon: <Shield size={32} className="text-green-600" />,
      href: "/profile/security",
    },
    {
      title: "Your Addresses",
      desc: "Edit addresses for your orders",
      icon: <MapPin size={32} className="text-green-600" />,
      href: "/profile/addresses",
    },
    {
      title: "Payment options",
      desc: "Edit or add payment methods",
      icon: <CreditCard size={32} className="text-green-600" />,
      href: "/profile/payments",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Added padding-top to avoid overlap with fixed navbar */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Your Account</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accountOptions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-start gap-3"
            >
              <div>{item.icon}</div>
              <h2 className="text-lg font-medium text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
