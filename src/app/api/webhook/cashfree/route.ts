import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminSupabaseClient } from "@/utils/supabase/adminClient";
import { sendOrderPlacedEmail } from "@/utils/OrderPlacedEmail";

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();

        const signatureHeader = request.headers.get("x-webhook-signature");
        const timestampHeader = request.headers.get("x-webhook-timestamp");

        /* ---------------- IGNORE NON-PAYMENT PINGS ---------------- */
        if (!signatureHeader || !timestampHeader) {
            console.log("No signature headers — ignoring ping");
            return NextResponse.json({ success: true });
        }

        /* ---------------- VERIFY SIGNATURE ---------------- */
        const expectedSignature = crypto
            .createHmac("sha256", process.env.CASHFREE_SECRET!)
            .update(timestampHeader + rawBody)
            .digest("base64");

        if (expectedSignature !== signatureHeader) {
            console.error("Webhook signature mismatch");
            return NextResponse.json(
                { success: false, error: "Invalid webhook signature" },
                { status: 401 }
            );
        }

        /* ---------------- PARSE EVENT ---------------- */
        const event = JSON.parse(rawBody);
        const eventType: string = event.type;

        console.log("Cashfree webhook event:", eventType);

        /* ---------------- IGNORE NON-PAYMENT EVENTS ---------------- */
        if (!eventType || eventType === "WEBHOOK") {
            return NextResponse.json({ success: true });
        }

        const payment = event.data?.payment;
        const order = event.data?.order;

        if (!payment || !order) {
            console.log("No payment/order in payload, ignoring");
            return NextResponse.json({ success: true });
        }

        const gatewayOrderId = order.order_id;
        const paymentId = String(payment.cf_payment_id);

        const supabase = createAdminSupabaseClient();

        /* ---------------- FETCH ORDER ---------------- */
        const { data: dbOrder, error: orderError } = await supabase
            .from("Orders")
            .select("*")
            .eq("gateway_order_id", gatewayOrderId)
            .single();

        if (orderError || !dbOrder) {
            console.error("Order not found for gateway_order_id:", gatewayOrderId);
            return NextResponse.json({ success: true }); // 200 so Cashfree doesn't retry
        }

        /* =====================================================
           PAYMENT_SUCCESS  (2023-08-01 event name)
        ===================================================== */
        if (eventType === "PAYMENT_SUCCESS") {

            /* --- idempotency: skip if payment already recorded --- */
            const { data: existingPayment } = await supabase
                .from("payments")
                .select("id")
                .eq("payment_id", paymentId)
                .maybeSingle();

            if (!existingPayment) {
                const { error: paymentInsertError } = await supabase
                    .from("payments")
                    .insert({
                        order_id: dbOrder.id,
                        payment_id: paymentId,
                        transaction_id: payment.payment_group ?? paymentId,
                        amount: payment.payment_amount,
                        currency: payment.payment_currency ?? "INR",
                        method: payment.payment_method
                            ? Object.keys(payment.payment_method)[0]
                            : "cashfree",
                        status: "SUCCESS",
                    });

                if (paymentInsertError) throw paymentInsertError;
            }

            /* --- idempotency: skip if order already marked paid --- */
            if (dbOrder.payment_status !== "SUCCESS") {
                const { error: updateError } = await supabase
                    .from("Orders")
                    .update({
                        payment_status: "SUCCESS",
                        status: "Order Placed",
                        status_description: "Payment successful via Cashfree",
                    })
                    .eq("id", dbOrder.id);

                if (updateError) throw updateError;

                /* --- send confirmation email --- */
                try {
                    await sendOrderPlacedEmail({ orderId: dbOrder.id });
                } catch (err) {
                    console.error("Order placed email failed:", err);
                }

                /* --- clear cart --- */
                const { data: cart } = await supabase
                    .from("carts")
                    .select("id")
                    .eq("user_id", dbOrder.user_id)
                    .single();

                if (cart) {
                    await supabase
                        .from("cartItems")
                        .delete()
                        .eq("cart_id", cart.id);
                }
            }

            return NextResponse.json({ success: true });
        }

        /* =====================================================
           PAYMENT_FAILED  (2023-08-01 event name)
        ===================================================== */
        if (eventType === "PAYMENT_FAILED") {

            const { data: existingPayment } = await supabase
                .from("payments")
                .select("id")
                .eq("payment_id", paymentId)
                .maybeSingle();

            if (!existingPayment) {
                const { error: paymentInsertError } = await supabase
                    .from("payments")
                    .insert({
                        order_id: dbOrder.id,
                        payment_id: paymentId,
                        transaction_id: payment.payment_group ?? paymentId,
                        amount: payment.payment_amount,
                        currency: payment.payment_currency ?? "INR",
                        method: payment.payment_method
                            ? Object.keys(payment.payment_method)[0]
                            : "cashfree",
                        status: "FAILED",
                    });

                if (paymentInsertError) throw paymentInsertError;
            }

            await supabase
                .from("Orders")
                .update({
                    payment_status: "FAILED",
                    status_description: "Payment failed via Cashfree",
                })
                .eq("id", dbOrder.id);

            return NextResponse.json({ success: true });
        }

        /* ---------------- IGNORE ALL OTHER EVENTS ---------------- */
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Cashfree webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Webhook handling failed" },
            { status: 500 }
        );
    }
}