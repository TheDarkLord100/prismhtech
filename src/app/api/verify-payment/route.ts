import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_method, transaction_id } = await request.json();
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
                status: "Payment verified",
                status_description: "Order placed successfully and payment verified",
            })
            .eq("razorpay_order_id", razorpay_order_id)
            .select()
            .single();

        if (orderError) {
            throw orderError;
        }

        await supabase.from("payments").insert({
            order_id: orderData.id,
            amount: orderData.total_amount,
            payment_id: razorpay_payment_id,
            method: payment_method,
            transaction_id: transaction_id,
            status: "Success",
        });

        const { data: cart, error: cartError } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", user.user.id)
            .single();

        if (cartError || !cart) {
            console.warn("No cart found for user:", user.user.id);
        } else {
            // Step 2: Delete all items for that cart
            const { error: clearError } = await supabase
                .from("cartItems")
                .delete()
                .eq("cart_id", cart.id);

            if (clearError) {
                console.error("Failed to clear cart items:", clearError);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}