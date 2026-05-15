import { NextResponse } from "next/server";
import crypto from "crypto";

import { createAdminSupabaseClient } from "@/utils/supabase/adminClient";
import { sendOrderPlacedEmail } from "@/utils/OrderPlacedEmail";

export async function POST(request: Request) {
    try {
        /* ---------------- RAW BODY ---------------- */
        const rawBody = await request.text();

        const signatureHeader = request.headers.get("x-webhook-signature");
        const timestampHeader = request.headers.get("x-webhook-timestamp");
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
            headers[key] = value;
        });
        console.log("Webhook headers:", JSON.stringify(headers));
        console.log("Webhook body:", rawBody);

        if (!signatureHeader || !timestampHeader) {
            return NextResponse.json(
                { success: false, error: "Missing webhook headers" },
                { status: 400 }
            );
        }

        /* ---------------- VERIFY SIGNATURE ---------------- */
        const expectedSignature = crypto
            .createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET!)
            .update(timestampHeader + rawBody)
            .digest("base64");

        if (expectedSignature !== signatureHeader) {
            return NextResponse.json(
                { success: false, error: "Invalid webhook signature" },
                { status: 401 }
            );
        }

        /* ---------------- PARSE EVENT ---------------- */
        const event = JSON.parse(rawBody);

        const eventType = event.type;

        const payment = event.data?.payment;
        const order = event.data?.order;

        if (!payment || !order) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid webhook payload",
                },
                { status: 400 }
            );
        }

        const gatewayOrderId = order.order_id;
        const paymentId = payment.cf_payment_id;

        const supabase = createAdminSupabaseClient();

        /* ---------------- FETCH ORDER ---------------- */
        const { data: dbOrder, error: orderError } =
            await supabase
                .from("Orders")
                .select("*")
                .eq("gateway_order_id", gatewayOrderId)
                .single();

        if (orderError || !dbOrder) {
            console.error(
                "Order not found for webhook:",
                gatewayOrderId
            );

            return NextResponse.json(
                { success: false },
                { status: 404 }
            );
        }

        /* =====================================================
           PAYMENT SUCCESS
        ===================================================== */
        if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {

            /* ---------------- IDEMPOTENCY ---------------- */
            const { data: existingPayment } = await supabase
                .from("payments")
                .select("id")
                .eq("payment_id", paymentId)
                .maybeSingle();

            if (!existingPayment) {
                const { error: paymentInsertError } =
                    await supabase
                        .from("payments")
                        .insert({
                            order_id: dbOrder.id,

                            payment_id: paymentId,

                            transaction_id:
                                payment.payment_group,

                            amount: payment.payment_amount,

                            currency:
                                payment.payment_currency,

                            method: "cashfree",

                            status: "SUCCESS",
                        });

                if (paymentInsertError) {
                    throw paymentInsertError;
                }
            }

            /* ---------------- ORDER IDEMPOTENCY ---------------- */
            if (dbOrder.payment_status !== "SUCCESS") {
                const { error: updateError } =
                    await supabase
                        .from("Orders")
                        .update({
                            payment_status: "SUCCESS",

                            status: "Order Placed",

                            status_description:
                                "Payment successful via Cashfree webhook",
                        })
                        .eq("id", dbOrder.id);

                if (updateError) {
                    throw updateError;
                }

                /* ---------------- SEND EMAIL ---------------- */
                try {
                    await sendOrderPlacedEmail({
                        orderId: dbOrder.id,
                    });
                } catch (err) {
                    console.error(
                        "Order placed email failed:",
                        err
                    );
                }

                /* ---------------- CLEAR CART ---------------- */
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

            return NextResponse.json({
                success: true,
            });
        }

        /* =====================================================
           PAYMENT FAILED
        ===================================================== */
        if (eventType === "PAYMENT_FAILED_WEBHOOK") {

            /* ---------------- IDEMPOTENCY ---------------- */
            const { data: existingPayment } = await supabase
                .from("payments")
                .select("id")
                .eq("payment_id", paymentId)
                .maybeSingle();

            if (!existingPayment) {
                const { error: paymentInsertError } =
                    await supabase
                        .from("payments")
                        .insert({
                            order_id: dbOrder.id,

                            payment_id: paymentId,

                            transaction_id:
                                payment.payment_group,

                            amount: payment.payment_amount,

                            currency:
                                payment.payment_currency,

                            method: "cashfree",

                            status: "FAILED",
                        });

                if (paymentInsertError) {
                    throw paymentInsertError;
                }
            }

            /* ---------------- UPDATE ORDER ---------------- */
            await supabase
                .from("Orders")
                .update({
                    payment_status: "FAILED",

                    status_description:
                        "Payment failed via Cashfree webhook",
                })
                .eq("id", dbOrder.id);

            return NextResponse.json({
                success: true,
            });
        }

        /* ---------------- IGNORE OTHER EVENTS ---------------- */
        return NextResponse.json({
            success: true,
        });

    } catch (error) {
        console.error("Cashfree webhook error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Webhook handling failed",
            },
            { status: 500 }
        );
    }
}