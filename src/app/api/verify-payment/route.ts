import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminSupabaseClient } from "./adminClient";

export async function POST(request: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            order_id,
            transaction_id } = await request.json();

        const supabase = createClient(cookies());
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }

        const { data: orderData, error: orderError } = await supabase
            .from("Orders")
            .update({
                status: "Order Placed",
                status_description: "Order placed successfully",
            })
            .eq("razorpay_order_id", razorpay_order_id)
            .select()
            .single();

        if (orderError) {
            throw orderError;
        }

        const { data: existingPayment } = await supabase
            .from("payments")
            .select("id")
            .eq("payment_id", razorpay_payment_id)
            .maybeSingle();

        if (!existingPayment) {
            const supabaseAdmin = createAdminSupabaseClient();
             
            const payment_method = await fetchRazorpayPaymentMethod(razorpay_payment_id);

            const { error: paymentError } = await supabaseAdmin
                .from("payments")
                .insert({
                    order_id: orderData.id,
                    amount: orderData.total_amount,
                    payment_id: razorpay_payment_id,
                    transaction_id,
                    method: payment_method,
                    status: "Success",
                })
                .select()
                .single();

            if (paymentError) {
                console.error("Payment insert failed:", paymentError);
                return NextResponse.json(
                    { success: false, error: "Payment insert failed" },
                    { status: 500 }
                );
            }
        }

        const { data: cart } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", user.user.id)
            .single();

        if (cart) {
            await supabase.from("cartItems").delete().eq("cart_id", cart.id);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

async function fetchRazorpayPaymentMethod(paymentId: string) {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_RAZORYPAY_KEY}:${process.env.RAZORPAY_SECRET}`
  ).toString("base64");

  const res = await fetch(
    `https://api.razorpay.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to fetch Razorpay payment: " + text);
  }

  const data = await res.json();
  return data.method ?? null; // "upi" | "card" | "netbanking" | etc.
}
