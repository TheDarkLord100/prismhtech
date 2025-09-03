"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function UserDetailsPage() {
  const [showPasswordLeft, setShowPasswordLeft] = useState(false);
  const [showConfirmPasswordLeft, setShowConfirmPasswordLeft] = useState(false);
  const [showPasswordRight, setShowPasswordRight] = useState(false);
  const [showConfirmPasswordRight, setShowConfirmPasswordRight] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFDEB] px-4">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#FFFDEB] p-10 shadow-[0_0_25px_5px_rgba(168,85,247,0.6)]">
        {/* Heading */}
        <h1 className="mb-8 text-3xl font-bold text-gray-900">User details</h1>

        {/* Two Column Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
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
                type={showPasswordLeft ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10 text-base placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-[#A855F7] hover:text-[#9333EA]"
                onClick={() => setShowPasswordLeft(!showPasswordLeft)}
              >
                {showPasswordLeft ? (
                  <EyeOff size={20} strokeWidth={2.2} />
                ) : (
                  <Eye size={20} strokeWidth={2.2} />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="mb-6 relative">
              <input
                type={showConfirmPasswordLeft ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10 text-base placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-[#A855F7] hover:text-[#9333EA]"
                onClick={() => setShowConfirmPasswordLeft(!showConfirmPasswordLeft)}
              >
                {showConfirmPasswordLeft ? (
                  <EyeOff size={20} strokeWidth={2.2} />
                ) : (
                  <Eye size={20} strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div>
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
                type={showPasswordRight ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10 text-base placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-[#A855F7] hover:text-[#9333EA]"
                onClick={() => setShowPasswordRight(!showPasswordRight)}
              >
                {showPasswordRight ? (
                  <EyeOff size={20} strokeWidth={2.2} />
                ) : (
                  <Eye size={20} strokeWidth={2.2} />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="mb-6 relative">
              <input
                type={showConfirmPasswordRight ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10 text-base placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-[#A855F7] hover:text-[#9333EA]"
                onClick={() => setShowConfirmPasswordRight(!showConfirmPasswordRight)}
              >
                {showConfirmPasswordRight ? (
                  <EyeOff size={20} strokeWidth={2.2} />
                ) : (
                  <Eye size={20} strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button className="mt-2 w-32 rounded-lg bg-[#A855F7] py-3 text-base font-semibold text-white hover:bg-[#9333EA] transition">
          Submit
        </button>
      </div>
    </main>
  );
}
