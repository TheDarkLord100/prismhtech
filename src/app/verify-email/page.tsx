"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notify, Notification } from "@/utils/notify";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const RESEND_KEY = "verify_email_resend_at";

    const startCooldown = () => {
        const until = Date.now() + 60_000;
        localStorage.setItem(RESEND_KEY, until.toString());
        setCooldown(60);
    };

    useEffect(() => {
        const stored = localStorage.getItem(RESEND_KEY);
        if (!stored) return;

        const until = parseInt(stored);
        const remaining = Math.ceil((until - Date.now()) / 1000);

        if (remaining > 0) setCooldown(remaining);
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown(c => {
                if (c <= 1) {
                    localStorage.removeItem(RESEND_KEY);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);


    const checkVerified = async () => {
        setChecking(true);
        const { data } = await supabase.auth.getUser();

        if (data?.user?.email_confirmed_at) {
            router.replace("/auth/callback");
            return;
        }

        notify(Notification.FAILURE, "Email not verified yet.");
        setChecking(false);
    };

    const resend = async () => {
        setLoading(true);
        const { data } = await supabase.auth.getUser();

        if (!data?.user?.email) {
            notify(Notification.FAILURE, "Not logged in");
            setLoading(false);
            return;
        }

        await supabase.auth.resend({
            type: "signup",
            email: data.user.email,
        });

        notify(Notification.SUCCESS, "Verification email sent.");
        startCooldown();
        setLoading(false);
    };


    // Auto check every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user?.email_confirmed_at) {
                router.replace("/auth/callback");
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
            <Navbar />
            <main className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl bg-[#FFFDEF] p-10 text-center shadow-lg">
                    <h1 className="mb-4 text-2xl font-bold text-[#16463B]">
                        Verify your email
                    </h1>
                    <p className="mb-6 text-gray-600">
                        We’ve sent a verification link to your email.
                        Click it, then return here.
                    </p>

                    <button
                        onClick={checkVerified}
                        disabled={checking}
                        className="mb-4 w-full rounded-lg bg-[#4CAF50] py-3 font-semibold text-white hover:bg-[#9333EA]"
                    >
                        {checking ? "Checking..." : "Continue"}
                    </button>

                    <button
                        onClick={resend}
                        disabled={loading || cooldown > 0}
                        className="w-full rounded-lg border border-[#4CAF50] py-3 font-semibold text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white disabled:opacity-50"
                    >
                        {cooldown > 0
                            ? `Resend in ${cooldown}s`
                            : loading
                                ? "Sending..."
                                : "Resend email"}
                    </button>

                    <p className="mt-6 text-sm text-gray-500">
                        Didn’t receive the email? Check spam or resend.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
