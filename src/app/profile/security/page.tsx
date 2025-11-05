"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUserStore } from "@/utils/store/userStore";
import { useRouter } from "next/navigation";

export default function LoginSecurity() {
  const { user, logout } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar type="colored"/>

      {/* Page Content */}
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-72">
        {/* Breadcrumb */}
        <p className="text-gray-500 text-sm mb-2">
          Your Account <span className="text-green-500">{">"}</span>{" "}
          <span className="text-green-500">Login and Security</span>
        </p>

        {/* Heading */}
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

        {/* Main Content Box */}
        <div className="bg-white rounded-4xl shadow-md border border-gray-200 divide-y divide-gray-200 max-w-8xl mx-auto">
          {/* Name */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Name</p>
              <p className="text-gray-700">{user?.name}</p>
            </div>
            <button className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Email</p>
              <p className="text-gray-700 break-all">{user?.email}</p>
            </div>
            {/* <button className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button> */}
          </div>

          {/* Mobile */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div className="max-w-lg">
              <p className="font-medium text-lg">Primary mobile number</p>
              <p className="text-gray-700">+91 {user?.phone}</p>
              <p className="text-gray-500 text-sm mt-1">
                Quickly sign in, easily recover passwords and receive security
                notifications with this mobile number.
              </p>
            </div>
            <button className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div>

          {/* Passkey */}
          {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div className="max-w-lg">
              <p className="font-medium text-lg">Passkey</p>
              <p className="text-gray-700 text-sm mt-1">
                Sign in the same way you unlock your device by using your face,
                fingerprint, or PIN.
              </p>
            </div>
            <button className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div> */}

          {/* Password */}
          <div className="flex flex-col md:flex-row justify-between items-start py-6 px-8">
            <div className="max-w-lg">
              <p className="font-medium text-lg">Password</p>
              <p className="text-gray-700">**********</p>
              <div className="flex items-start gap-2 mt-2">
                <span className="text-yellow-500 text-xl leading-none">⚠️</span>
                <p className="text-gray-500 text-sm">
                  To better protect your account, remove your password and use a
                  passkey instead.
                </p>
              </div>
            </div>

            {/* Buttons vertically aligned */}
            <div className="flex flex-col gap-3 mt-4 md:mt-0">
              {/* <button className="w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
                Remove
              </button> */}
              <button className="w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
                Change Password
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">GST Number</p>
              <p className="text-gray-700">{user?.gstin}</p>
            </div>
            {/* <button className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button> */}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Date of Birth</p>
              <p className="text-gray-700">{user?.dob}</p>
            </div>
            <button className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Location</p>
              <p className="text-gray-700">{user?.location}</p>
            </div>
            <button className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div>

          {/* 2-step Verification */}
          {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div className="max-w-lg">
              <p className="font-medium text-lg">2-step verification</p>
              <div className="flex items-start gap-2 mt-2">
                <span className="text-yellow-500 text-xl leading-none">⚠️</span>
                <p className="text-gray-500 text-sm">
                  Add a layer of security. Require a code in addition to your
                  password.
                </p>
              </div>
            </div>
            <button className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div> */}

        </div>
      </main>

      <Footer />
    </div>
  );
}
