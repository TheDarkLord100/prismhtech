"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Notification, notify } from "@/utils/notify";
import { useRouter } from "next/navigation";
import { validateDOB, validateName, validatePhone, validateGSTIN, validateLocation } from "@/utils/userValidator";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    location: "",
    gstin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    if (validateName(form.name)) {
      notify(Notification.FAILURE, validateName(form.name)!);
      setLoading(false);
      return;
    }

    if (validatePhone(form.phone)) {
      notify(Notification.FAILURE, validatePhone(form.phone)!);
      setLoading(false);
      return;
    }

    if (validateDOB(form.dob)) {
      notify(Notification.FAILURE, validateDOB(form.dob)!);
      setLoading(false);
      return;
    }

    if (validateLocation(form.location)) {
      notify(Notification.FAILURE, validateLocation(form.location)!);
      setLoading(false);
      return;
    }

    if (validateGSTIN(form.gstin)) {
      notify(Notification.FAILURE, validateGSTIN(form.gstin)!);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/complete-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
    const data = await res.json();
    if (!res.ok) {
      notify(Notification.FAILURE, data.error || "Failed to complete profile");
      setLoading(false);
      return;
    }
    notify(Notification.SUCCESS, "Profile completed successfully!");
    router.replace("/auth/callback");
  };

  return (
    <div className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-md rounded-2xl bg-[#FFFFEF] p-10 shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]">
          <h1 className="mb-8 text-3xl font-bold text-[#16463B]">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="mb-4 w-full rounded-lg bg-[#e0e0db] px-4 py-2"
              required
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="mb-4 w-full rounded-lg bg-[#e0e0db] px-4 py-2"
              required
            />

            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg bg-[#e0e0db] px-4 py-2"
              required
            />

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="mb-4 w-full rounded-lg bg-[#e0e0db] px-4 py-2"
              required
            />

            <input
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              placeholder="GST Identification Number"
              className="mb-6 w-full rounded-lg bg-[#e0e0db] px-4 py-2"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#4CAF50] py-3 font-semibold text-white hover:bg-[#9333EA]"
            >
              {loading ? "Processing..." : "Finish Setup"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
