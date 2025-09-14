"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      else {
        router.push("/");
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign in:", error.message);
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("Something went wrong during login.");
      }
    }

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
            className="w-full rounded-lg bg-[#4CAF50] py-3 text-base font-semibold text-white hover:bg-[#9333EA] transition">
            Sign in
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
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#e0e0db] py-3 px-4 text-base font-bold text-[#16463B] hover:bg-gray-300 transition">
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

            {/* Apple */}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#e0e0db] py-3 px-4 text-base font-bold text-[#16463B] font hover:bg-gray-300 transition">
              <span>Create a new Account</span>
              {/* <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="black"
                d="M318.7 268.7c-.3-36.7 16-64.4 50.2-84.8-19.2-27.9-48.3-43.3-85.5-46.3-35.9-2.9-75.4 20.8-89.4 20.8-14.5 0-47.6-19.9-73.8-19.4-38.1.6-73.6 22.2-92.9 56.4-39.8 68.9-10.2 170.8 28.6 226.8 19 27.7 41.6 58.6 71.3 57.5 28.5-1.1 39.2-18.5 73.5-18.5 34.1 0 44 18.5 73.9 18 30.4-.5 49.5-27.7 68.3-55.4 21.6-31.7 30.5-62.5 30.8-64.1-0.7-0.3-59-22.6-59.2-89zM255.9 81.4c18-21.8 30.1-52.2 26.8-81.4-25.9 1-57.3 17.3-75.9 39-16.7 19.4-31.4 50.7-27.5 80.6 29.1 2.2 58.6-16.5 76.6-38.2z"
              />
            </svg> */}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
