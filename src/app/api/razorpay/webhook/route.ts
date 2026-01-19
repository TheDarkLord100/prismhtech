import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminSupabaseClient } from "@/utils/supabase/adminClient";
import { sendOrderPlacedEmail } from "@/utils/OrderPlacedEmail";

export async function POST(request: Request) {
  const body = await request.text(); // IMPORTANT: raw body
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing signature" },
      { status: 400 }
    );
  }

  // 1️⃣ Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json(
      { success: false, error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  // 2️⃣ Parse event
  const event = JSON.parse(body);

  const supabase = createAdminSupabaseClient();

  /* =====================================================
     🔹 PAYMENT SUCCESS (existing logic – unchanged)
     ===================================================== */
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;
    const paymentMethod = payment.method;

    const { data: order, error: orderError } = await supabase
      .from("Orders")
      .select("*")
      .eq("razorpay_order_id", razorpayOrderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found for webhook:", razorpayOrderId);
      return NextResponse.json({ success: false });
    }

    // Idempotency
    if (order.payment_status === "SUCCESS") {
      return NextResponse.json({ success: true });
    }

    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("payment_id", razorpayPaymentId)
      .maybeSingle();

    if (!existingPayment) {
      await supabase.from("payments").insert({
        order_id: order.id,
        payment_id: razorpayPaymentId,
        transaction_id: razorpayPaymentId,
        amount: payment.amount,
        currency: payment.currency,
        method: paymentMethod,
        status: "SUCCESS",
      });
    }

    await supabase
      .from("Orders")
      .update({
        status: "Order Placed",
        status_description: "Payment captured via Razorpay webhook",
        payment_status: "SUCCESS",
      })
      .eq("id", order.id);

    try {
      await sendOrderPlacedEmail({ orderId: order.id });
    } catch (err) {
      console.error("Webhook email failed:", err);
    }

    return NextResponse.json({ success: true });
  }

  /* =====================================================
     🔹 NEW: PAYMENT FAILED (ONLY ADDITION)
     ===================================================== */
  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    const { data: order } = await supabase
      .from("Orders")
      .select("id")
      .eq("razorpay_order_id", razorpayOrderId)
      .single();

    if (!order) {
      return NextResponse.json({ success: true });
    }

    // Record failed payment (optional but useful)
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("payment_id", razorpayPaymentId)
      .maybeSingle();

    if (!existingPayment) {
      await supabase.from("payments").insert({
        order_id: order.id,
        payment_id: razorpayPaymentId,
        transaction_id: razorpayPaymentId,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: "FAILED",
      });
    }

    // Update order payment status ONLY
    await supabase
      .from("Orders")
      .update({
        payment_status: "FAILED",
        status_description: "Payment failed via Razorpay",
      })
      .eq("id", order.id);

    return NextResponse.json({ success: true });
  }

  // Ignore all other events
  return NextResponse.json({ success: true });
}
