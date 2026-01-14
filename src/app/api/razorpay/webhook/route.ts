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

  // We care about successful payments only
  if (event.event !== "payment.captured") {
    return NextResponse.json({ success: true });
  }

  const payment = event.payload.payment.entity;
  const razorpayOrderId = payment.order_id;
  const razorpayPaymentId = payment.id;
  const paymentMethod = payment.method;

  const supabase = createAdminSupabaseClient();

  // 3️⃣ Fetch order using razorpay_order_id
  const { data: order, error: orderError } = await supabase
    .from("Orders")
    .select("*")
    .eq("razorpay_order_id", razorpayOrderId)
    .single();

  if (orderError || !order) {
    console.error("Order not found for webhook:", razorpayOrderId);
    return NextResponse.json({ success: false });
  }

  // 4️⃣ Idempotency: if already paid, stop
  if (order.status === "PAID") {
    return NextResponse.json({ success: true });
  }

  // 5️⃣ Insert payment if not exists
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
      amount: payment.amount, // already in paise
      currency: payment.currency,
      method: paymentMethod,
      status: "SUCCESS",
    });
  }

  // 6️⃣ Mark order as PAID
  await supabase
    .from("Orders")
    .update({
      status: "Order Placed",
      status_description: "Payment captured via Razorpay webhook",
    })
    .eq("id", order.id);

  // 7️⃣ Send confirmation email (non-blocking)
  try {
    await sendOrderPlacedEmail({ orderId: order.id });
  } catch (err) {
    console.error("Webhook email failed:", err);
  }

  return NextResponse.json({ success: true });
}
