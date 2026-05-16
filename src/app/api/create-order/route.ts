import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { notify } from "@/utils/notify";

export async function POST(request: Request) {
    try {
        const {
            pricing,
            receipt,
            ship_adr_id,
            bill_adr_id,
            cart_items,
        } = await request.json();

        const { subtotal } = pricing;

        const supabase = createClient(cookies());

        /* ---------------- AUTH ---------------- */
        const { data: user, error: userError } =
            await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        /* ---------------- FETCH SHIPPING ADDRESS ---------------- */
        const { data: shippingAddress, error: addressError } =
            await supabase
                .from("Addresses")
                .select("state")
                .eq("adr_id", ship_adr_id)
                .single();

        if (addressError || !shippingAddress?.state) {
            return NextResponse.json(
                { success: false, error: "Invalid shipping address" },
                { status: 400 }
            );
        }

        /* ---------------- METAL PRICE VALIDATION ---------------- */
        const metalItems = cart_items.filter(
            (item: any) => item.item_type === "metal"
        );

        const today = new Date().toISOString().slice(0, 10);

        const { data: liveMetals, error: metalError } = await supabase
            .from("metals_live_prices")
            .select("id, live_price, last_updated_at, is_visible")
            .eq("is_visible", true)
            .gte("last_updated_at", `${today}T00:00:00`)
            .lte("last_updated_at", `${today}T23:59:59`);

        if (metalError) {
            throw metalError;
        }

        const liveMetalMap = new Map(
            liveMetals.map((m) => [m.id, m])
        );

        for (const item of metalItems) {
            const liveMetal = liveMetalMap.get(item.metal_id);

            if (!liveMetal) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "Metal price has expired. Please remove the item from the cart and try again.",
                    },
                    { status: 400 }
                );
            }

            if (item.price !== liveMetal.live_price) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "Price for metals has changed. Please remove the item from the cart and add it again.",
                    },
                    { status: 400 }
                );
            }
        }

        /* ---------------- GST CALCULATION ---------------- */
        const SELLER_STATE = "Haryana";
        const GST_RATE = 0.18;

        const isIntraState =
            shippingAddress.state.toLowerCase() ===
            SELLER_STATE.toLowerCase();

        const gstAmount = subtotal * GST_RATE;

        const cgst = isIntraState ? gstAmount / 2 : 0;
        const sgst = isIntraState ? gstAmount / 2 : 0;
        const igst = !isIntraState ? gstAmount : 0;

        const totalAmount = subtotal + gstAmount;

        /* ---------------- CREATE DB ORDER FIRST ---------------- */
        const { data: orderData, error: orderError } = await supabase
            .from("Orders")
            .insert({
                user_id: user.user.id,

                subtotal_amount: subtotal,
                gst_rate: 18,
                gst_type: isIntraState ? "CGST_SGST" : "IGST",
                cgst_amount: cgst,
                sgst_amount: sgst,
                igst_amount: igst,
                total_amount: totalAmount,

                shipping_address_id: ship_adr_id,
                billing_address_id: bill_adr_id,

                payment_type: "Cashfree",
                payment_status: "PENDING",

                status: "CREATED",
                status_description:
                    "Order created, awaiting payment",
            })
            .select()
            .single();

        if (orderError || !orderData) {
            throw orderError;
        }

        /* ---------------- CREATE CASHFREE ORDER ---------------- */
        const cfRes = await fetch(
            "https://sandbox.cashfree.com/pg/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_KEY!,
                    "x-client-secret":
                        process.env.CASHFREE_SECRET!,
                    "x-api-version": "2022-09-01",
                },
                body: JSON.stringify({
                    order_id: orderData.id,
                    order_amount: totalAmount,
                    order_currency: "INR",

                    customer_details: {
                        customer_id: user.user.id,
                        customer_email: user.user.email,
                        customer_phone: "9999999999",
                    },

                    order_meta: {
                        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order?order_id=${orderData.id}`,
                        notify_url: `https://www.perveshrasayan.com/api/webhook/cashfree`,
                    },
                }),
            }
        );

        const cfData = await cfRes.json();

        console.log("Cashfree response:", cfData);

        if (!cfRes.ok) {
            console.error("Cashfree error:", cfData);

            // Optional cleanup
            await supabase
                .from("Orders")
                .delete()
                .eq("id", orderData.id);

            throw new Error("Failed to create Cashfree order");
        }

        /* ---------------- UPDATE ORDER WITH GATEWAY ORDER ID ---------------- */
        const { error: updateError } = await supabase
            .from("Orders")
            .update({
                gateway_order_id: cfData.order_id,
            })
            .eq("id", orderData.id);

        if (updateError) {
            throw updateError;
        }

        /* ---------------- INSERT ORDER ITEMS ---------------- */
        const orderItems = cart_items.map((item: any) => {
            if (item.item_type === "product") {
                return {
                    item_type: "product",
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    ordr_id: orderData.id,
                    quantity: item.quantity,
                    price: item.price,
                };
            }

            return {
                item_type: "metal",
                metal_id: item.metal_id,
                ordr_id: orderData.id,
                quantity: item.quantity,
                price: item.price,
            };
        });

        const { error: itemsError } = await supabase
            .from("OrderItems")
            .insert(orderItems);

        if (itemsError) {
            throw itemsError;
        }

        /* ---------------- RESPONSE ---------------- */
        return NextResponse.json({
            success: true,
            order: orderData,
            payment_session_id: cfData.payment_session_id,
        });

    } catch (error) {
        console.error("Create order error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to create order",
            },
            { status: 500 }
        );
    }
}