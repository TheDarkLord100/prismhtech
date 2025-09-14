"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/utils/store/signupStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignUpPage() {
  const router = useRouter();
  const setData = useSignupStore((state) => state.setData);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData(formData); // save into store
    router.push("/userdetails"); // move to next page
  };

  return (
    <div className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-md rounded-2xl bg-[#FFFDEF] p-10 shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]">
          <h1 className="mb-8 text-3xl font-bold text-[#16463B]">
            Let's Get started
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#4CAF50] py-3 text-base font-semibold text-white hover:bg-[#9333EA] transition"
            >
              Next
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
