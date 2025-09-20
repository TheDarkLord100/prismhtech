"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/utils/store/signupStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notify, Notification } from "@/utils/notify";

export default function UserDetailsPage() {
  const { data, setData, reset } = useSignupStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gstin, setGstin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log("Signup data from store:", data);
    if (!data || !data.name || !data.phone || !data.dob || !data.location) {
      router.replace("/signup"); // replace so user can't go back
    }
  }, []);

  const handleSubmit = async () => {
    if (loading) return;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    const finalData = {
      ...data,
      email,
      password,
      gstin,
    };

    console.log("Final submitted data:", finalData);

    const res = await fetch("/api/signup", 
      { method: "POST",
        headers: { "Content-Type": "application/json" },
         body: JSON.stringify(finalData) }
    );

   const result = await res.json();
   if (res.ok) {
      notify(Notification.SUCCESS, "Sign up successful! Please verify your email.");
     router.push("/");
   } else {
     notify(Notification.FAILURE, "Error during sign up: " + result.error);
   }

    setLoading(false);

    reset();
  };

  return (
    <div className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-md rounded-2xl bg-[#FFFFEF] p-10 shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]">
          <h1 className="mb-8 text-3xl font-bold text-[#16463B]">One more step</h1>

          {/* Email */}
          <div className="mb-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#e0e0db] px-4 py-2"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-[#A855F7]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-[#A855F7]"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* GSTIN */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="GST Identification Number"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="w-full rounded-lg bg-[#e0e0db] px-4 py-2"
              required
              disabled={loading}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg bg-[#4CAF50] py-3 text-base font-semibold text-white hover:bg-[#9333EA] transition"
          >
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
