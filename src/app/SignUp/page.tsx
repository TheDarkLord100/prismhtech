"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFDEB] px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#FFFDEB] p-10 shadow-[0_0_25px_5px_rgba(168,85,247,0.6)]">
        {/* Heading */}
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Sign up</h1>

        {/* Name */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 text-base placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Email or Phone */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Email or Phone"
            className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 text-base placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10 text-base placeholder-gray-500 focus:outline-none"
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-[#A855F7] hover:text-[#9333EA] focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={2.2} />
            ) : (
              <Eye size={20} strokeWidth={2.2} />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10 text-base placeholder-gray-500 focus:outline-none"
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-[#A855F7] hover:text-[#9333EA] focus:outline-none"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} strokeWidth={2.2} />
            ) : (
              <Eye size={20} strokeWidth={2.2} />
            )}
          </button>
        </div>

        {/* Sign up Button */}
        <button className="w-full rounded-lg bg-[#A855F7] py-3 text-base font-semibold text-white hover:bg-[#9333EA] transition">
          Sign Up
        </button>
      </div>
    </main>
  );
}
