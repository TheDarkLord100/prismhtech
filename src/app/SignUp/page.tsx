"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Notification, notify } from "@/utils/notify";
import { validateEmail, validatePassword } from "@/utils/userValidator";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      notify(Notification.FAILURE, "Passwords do not match");
      return;
    }
    const emailError = validateEmail(email);
    if (emailError) {
      notify(Notification.FAILURE, emailError);
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      notify(Notification.FAILURE, passwordError);
      return;
    }
    const supabase = createClient();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    setLoading(false);
    if (error) {
      notify(Notification.FAILURE, error.message);
      return;
    }

    notify(Notification.SUCCESS, "Account created! Please verify your email.");

    router.push("/verify-email");
  };

  return (
    <div className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-md rounded-2xl bg-[#FFFDEF] p-10 shadow-[0px_0px_25px_5px_rgba(0,0,0,0.5)]">
          <h1 className="mb-8 text-3xl font-bold text-[#16463B]">
            Create Account
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2"
                required
              />
            </div>

            <div className="mb-4 relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mb-6 relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg bg-[#e0e0db] px-4 py-2 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#4CAF50] py-3 font-semibold text-white hover:bg-[#9333EA]"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
