"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, MapPin, CreditCard, Package } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/utils/store/userStore";
import { useRouter } from "next/navigation";

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
  ];

  const { logout } = useUserStore();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar type="colored" />

      {/* Added padding-top to avoid overlap with fixed navbar */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold mb-8">Login and Security</h1>
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="bg-yellow-400 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
