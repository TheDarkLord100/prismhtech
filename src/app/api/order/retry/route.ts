import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: "order_id is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    /* ---------------- AUTH ---------------- */
    const { data: userData, error: authError } =
      await supabase.auth.getUser();

    const user = userData?.user;

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------------- FETCH ORDER ---------------- */
    const { data: order, error: orderError } = await supabase
      .from("Orders")
      .select(`
        id,
        user_id,
        payment_status,
        total_amount
      `)
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (order.payment_status !== "FAILED") {
      return NextResponse.json(
        {
          success: false,
          error: "Retry allowed only for failed payments",
        },
        { status: 400 }
      );
    }

    /* ---------------- CREATE RAZORPAY ORDER ---------------- */
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORYPAY_KEY!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total_amount * 100), // paise
      currency: "INR",
      receipt: `retry_${Date.now()}`,
    });

    /* ---------------- UPDATE ORDER ---------------- */
    const { error: updateError } = await supabase
      .from("Orders")
      .update({
        razorpay_order_id: razorpayOrder.id,
        payment_status: "PENDING",
        status_description: "Retry payment initiated",
      })
      .eq("id", order.id);

    if (updateError) {
      throw updateError;
    }

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json({
      success: true,
      razorpay_order: razorpayOrder,
    });
  } catch (error) {
    console.error("POST /api/order/retry error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retry payment",
      },
      { status: 500 }
    );
  }
}
