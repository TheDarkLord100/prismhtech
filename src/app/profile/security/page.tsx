"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUserStore } from "@/utils/store/userStore";
import { useRouter } from "next/navigation";
import EditProfileModal from "@/components/EditProfileModal";
import { Notification, notify } from "@/utils/notify";

export default function LoginSecurity() {
  const { user, logout, updateUserField } = useUserStore();
  const router = useRouter();
  const [editField, setEditField] = useState<"name" | "phone" | "dob" | "location" | null>(null);

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar type="colored" />

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
            <button
              onClick={() => setEditField("name")}
              className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition"
            >
              Edit
            </button>
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Email</p>
              <p className="text-gray-700 break-all">{user?.email}</p>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Mobile Number</p>
              <p className="text-gray-700">{user?.phone}</p>
            </div>
            <button
              onClick={() => setEditField("phone")}
              className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div>

          {/* Password */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Password</p>
              <p className="text-gray-700">*********</p>
            </div>
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/user/reset-password", {
                    method: "POST",
                  });

                  const data = await res.json();

                  if (!res.ok) throw new Error(data.error);

                  notify(
                    Notification.SUCCESS,
                    "Password reset link has been sent to your email"
                  );
                } catch (err: any) {
                  notify(
                    Notification.FAILURE,
                    err.message || "Failed to send reset link"
                  );
                }
              }}
              className="mt-3 md:mt-0 w-40 border border-gray-400 rounded-full px-6 py-2 text-sm hover:bg-gray-100 transition"
            >
              Change Password
            </button>

          </div>

          {/* GST Number */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">GST Number</p>
              <p className="text-gray-700">{user?.gstin}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Date of Birth</p>
              <p className="text-gray-700">{user?.dob}</p>
            </div>
            <button
              onClick={() => setEditField("dob")}
              className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-8">
            <div>
              <p className="font-medium text-lg">Location</p>
              <p className="text-gray-700">{user?.location}</p>
            </div>
            <button
              onClick={() => setEditField("location")}
              className="mt-3 md:mt-0 w-32 border border-gray-400 rounded-full px-8 py-2 text-sm hover:bg-gray-100 transition">
              Edit
            </button>
          </div>
        </div>
      </main>
      <EditProfileModal
        isOpen={!!editField}
        field={editField}
        initialValue={
          editField === "name"
            ? user?.name ?? undefined
            : editField === "phone"
              ? user?.phone ?? undefined
              : editField === "dob"
                ? user?.dob ?? undefined
                : editField === "location"
                  ? user?.location ?? undefined
                  : undefined
        }
        onClose={() => setEditField(null)}
        onSave={async (value) => {
          if (!editField) return;
          try {
            await updateUserField(editField, value);
            notify(Notification.SUCCESS, "Profile updated successfully");
            setEditField(null);
          } catch (err: any) {
            notify(
              Notification.FAILURE,
              err.message || "Failed to update profile"
            );
          }
        }}
      />


      <Footer />
    </div>
  );
}
