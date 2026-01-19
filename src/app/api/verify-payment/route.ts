import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminSupabaseClient } from "@/utils/supabase/adminClient";
import { sendOrderPlacedEmail } from "@/utils/OrderPlacedEmail";

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

        const { data: orderData, error: orderFetchError } = await supabase
            .from("Orders")
            .select("*")
            .eq("id", order_id)
            .eq("user_id", user.user.id)
            .single();

        if (orderFetchError || !orderData) {
            return NextResponse.json(
                { success: false, error: "Invalid order" },
                { status: 400 }
            );
        }

        if (orderData.razorpay_order_id !== razorpay_order_id) {
            return NextResponse.json(
                { success: false, error: "Order mismatch" },
                { status: 400 }
            );
        }

        if (orderData.status === "PAID") {
            return NextResponse.json({ success: true }); // idempotent
        }


        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }

        const supabaseAdmin = createAdminSupabaseClient();

        // Insert payment (idempotent)
        const { data: existingPayment } = await supabaseAdmin
            .from("payments")
            .select("id")
            .eq("payment_id", razorpay_payment_id)
            .maybeSingle();

        if (!existingPayment) {
            const payment_method = await fetchRazorpayPaymentMethod(
                razorpay_payment_id
            );

            const { error: paymentError } = await supabaseAdmin
                .from("payments")
                .insert({
                    order_id: orderData.id,
                    payment_id: razorpay_payment_id,
                    transaction_id,
                    method: payment_method,
                    status: "SUCCESS",
                    amount: Math.round(orderData.total_amount * 100), // paise
                    currency: "INR",
                });

            if (paymentError) {
                throw paymentError;
            }
        }

        // Update order status

        const { error: orderUpdateError } = await supabase
            .from("Orders")
            .update({
                status: "Order Placed",
                status_description: "Payment successful, order placed",
                payment_status: "SUCCESS",
            })
            .eq("id", orderData.id);

        if (orderUpdateError) {
            throw orderUpdateError;
        }

        try {
            await sendOrderPlacedEmail({ orderId: orderData.id });
        } catch (err) {
            console.error("Order placed email failed:", err);
            // DO NOT fail the whole flow if email fails
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
