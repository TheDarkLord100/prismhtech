"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Notification, notify } from "@/utils/notify";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      notify(Notification.SUCCESS, "Message sent successfully!");
      form.reset();
    } catch (err: any) {
        notify(Notification.FAILURE, err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] text-white">
      <Navbar />

      <div className="text-center pt-24 pb-12">
        <h1 className="text-5xl font-bold text-yellow-400">
          Drop a Message
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/10 backdrop-blur-md rounded-2xl p-10">

          {/* LEFT */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-yellow-400">
              Contact Information
            </h2>

            <div>
              <p className="font-medium text-yellow-400">Phone</p>
              <p>0129-2414130, 2413279</p>
            </div>

            <div>
              <p className="font-medium text-yellow-400">Email</p>
              <p>vinod@perveshimpex.com</p>
            </div>

            {/* Google Maps */}
            <div className="mt-6 rounded-xl overflow-hidden border border-white/20">
              <iframe
                src="https://www.google.com/maps?q=28.389751451522965, 77.30260197892464&z=15&output=embed"
                width="100%"
                height="220"
                loading="lazy"
                className="border-0"
              />
            </div>
          </div>

          {/* RIGHT */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input name="name" required placeholder="Name"
              className="w-full rounded-lg bg-white/20 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none" />

            <input name="email" type="email" required placeholder="Email"
              className="w-full rounded-lg bg-white/20 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none" />

            <input name="phone" placeholder="Phone Number"
              className="w-full rounded-lg bg-white/20 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none" />

            <textarea name="message" rows={4} required placeholder="Message"
              className="w-full rounded-lg bg-white/20 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none" />

            <button
              disabled={loading}
              className="w-full bg-yellow-400 text-[#16463B] font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
