"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { notify, Notification } from "@/utils/notify";
import { useUserStore } from "@/utils/store/userStore";
import { useCartStore } from "@/utils/store/useCartStore";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectedFrom") || "/";
  const reason = searchParams.get("reason") || "";

  useEffect(() => {
    if (reason === "auth") {
      notify(Notification.FAILURE, "You must login to proceed further");
    }
  }, [reason]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      notify(Notification.SUCCESS, "Login successful!");

      await useUserStore.getState().fetchUser();

      await useCartStore.getState().mergeGuestCart();
      
      router.push(redirectTo);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign in:", error.message);
        notify(Notification.FAILURE, error.message);
      } else {
        console.error("Unexpected error:", error);
        notify(Notification.FAILURE, "Something went wrong during login.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-md rounded-2xl bg-[#FFFFEF] p-10 shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]">
          {/* Heading */}
          <h1 className="mb-8 text-3xl font-bold text-[#16463B]">Sign in</h1>

          {/* Email */}
          <div className="mb-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 text-base placeholder-gray-500 focus:outline-none"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10 text-base placeholder-gray-500 focus:outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-[#4CAF50] hover:text-[#9333EA] focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} strokeWidth={2.2} />
              ) : (
                <Eye size={20} strokeWidth={2.2} />
              )}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="mb-6 text-left">
            <a
              href="#"
              className="text-sm font-medium text-[#4CAF50] hover:text-[#7E22CE]"
            >
              Forgot password ?
            </a>
          </div>

          {/* Sign in Button */}
          <button
            type="submit"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg bg-[#4CAF50] py-3 text-base font-semibold text-white hover:bg-[#9333EA] transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="h-[2px] flex-1 bg-[#16463B]"></div>
            <span className="mx-3 text-sm text-[#16463B] font-bold">or</span>
            <div className="h-[2px] flex-1 bg-[#16463B]"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              onClick={() =>
                supabase.auth.signInWithOAuth({ provider: "google" })
              }
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#e0e0db] py-3 px-4 text-base font-bold text-[#16463B] hover:bg-gray-300 transition"
            >
              <span>Sign in with</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="#4285F4"
                  d="M488 261.8c0-17.4-1.6-34.1-4.6-50.4H249v95.4h135c-5.9 32-23.3 59.1-49.6 77.3l80.1 62c46.9-43.3 73.5-107.1 73.5-184.3z"
                />
                <path
                  fill="#34A853"
                  d="M249 492c66.6 0 122.3-22 163.1-59.8l-80.1-62c-22.2 15-50.6 23.8-83 23.8-63.9 0-118-43.1-137.3-101.1l-84.6 65.2C64.5 444.6 150.1 492 249 492z"
                />
                <path
                  fill="#FBBC05"
                  d="M111.7 292c-4.6-13.8-7.3-28.5-7.3-43.6s2.7-29.8 7.3-43.6l-84.6-65.2C9.8 164.4 0 205.7 0 248.4s9.8 84 27.1 119l84.6-65.4z"
                />
                <path
                  fill="#EA4335"
                  d="M249 97.6c36.3 0 68.8 12.5 94.6 37.1l70.7-70.7C371.2 24.3 315.6 0 249 0 150.1 0 64.5 47.5 27.1 129.3l84.6 65.2c19.3-58 73.4-101.1 137.3-101.1z"
                />
              </svg>
            </button>

            {/* Signup */}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#e0e0db] py-3 px-4 text-base font-bold text-[#16463B] hover:bg-gray-300 transition"
            >
              <span>Create a new Account</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
