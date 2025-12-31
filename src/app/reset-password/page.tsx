"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Notification, notify } from "@/utils/notify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResetPasswordPage() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // 🔑 THIS IS THE IMPORTANT PART
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true);
        }
      }
    );

    // Clean URL hash (tokens)
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );
    }

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleReset() {
    if (!isRecovery || loading) {
      notify(
        Notification.FAILURE,
        "Invalid or expired password reset link"
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      notify(Notification.FAILURE, error.message);
      setLoading(false);
      return;
    }

    // 🔐 CRITICAL: invalidate recovery session
    await supabase.auth.signOut();

    notify(
      Notification.SUCCESS,
      "Password updated successfully. Please log in again."
    );

    setLoading(false);
  }

  const disabled =
    loading ||
    !isRecovery ||
    password.length < 8 ||
    password !== confirmPassword;

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar type="colored" />

      <main className="flex-grow pt-28 pb-16 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-72 flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-4xl shadow-md border border-gray-200 p-8">
          <h1 className="text-3xl font-semibold mb-2">
            Reset Password
          </h1>

          {!isRecovery && (
            <p className="text-red-500 mb-6">
              Invalid or expired password reset link.
            </p>
          )}

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
          />

          <button
            disabled={disabled}
            onClick={handleReset}
            className="w-full bg-yellow-400 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
