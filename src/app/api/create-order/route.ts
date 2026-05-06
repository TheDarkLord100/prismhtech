import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

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
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { data: shippingAddress, error: addressError } = await supabase
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

        // Checking if the metal prices are still valid or not

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

        if (metalError) throw metalError;

        const liveMetalMap = new Map(
            liveMetals.map(m => [m.id, m])
        );

        for (const item of metalItems) {
            const liveMetal = liveMetalMap.get(item.metal_id);

            if (!liveMetal) {
                return NextResponse.json(
                    { success: false, error: "Metal price has expired. Please remove the item from the cart and try again." },
                    { status: 400 }
                );
            }

            if (item.price !== liveMetal.live_price) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Price for metals has changed. Please remove the item from the cart and add it again.`,
                    },
                    { status: 400 }
                );
            }
        }

        const SELLER_STATE = "Haryana";
        const GST_RATE = 0.18;

        const isIntraState =
            shippingAddress.state.toLowerCase() === SELLER_STATE.toLowerCase();

        const gstAmount = subtotal * GST_RATE;

        const cgst = isIntraState ? gstAmount / 2 : 0;
        const sgst = isIntraState ? gstAmount / 2 : 0;
        const igst = !isIntraState ? gstAmount : 0;

        const totalAmount = subtotal + gstAmount;

        // const razorpay = new Razorpay({
        //     key_id: process.env.NEXT_PUBLIC_RAZORYPAY_KEY || "",
        //     key_secret: process.env.RAZORPAY_SECRET!
        // });
        // const options = {
        //     amount: Math.round(totalAmount * 100),
        //     currency: "INR",
        //     receipt
        // };

        // const order = await razorpay.orders.create(options);

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
                status: "CREATED",
                status_description: "Order created, awaiting payment",
            })
            .select()
            .single();

        if (orderError) {
            throw orderError;
        }

        const cfRes = await fetch("https://api.cashfree.com/pg/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_KEY!,
                "x-client-secret": process.env.CASHFREE_SECRET!,
                "x-api-version": "2022-09-01",
            },
            body: JSON.stringify({
                order_id: orderData.id, // or use your DB id later (see note below)
                order_amount: totalAmount,
                order_currency: "INR",
                customer_details: {
                    customer_id: user.user.id,
                    customer_email: user.user.email,
                    customer_phone: user.user.phone || undefined,
                },
                order_meta: {
                    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-status?order_id={order_id}`,
                },
            }),
        });

        const cfData = await cfRes.json();

        if (!cfRes.ok) {
            console.error("Cashfree error:", cfData);
            throw new Error("Failed to create Cashfree order");
        }

        const { error: updateError } = await supabase
            .from("Orders")
            .update({
                gateway_order_id: cfData.order_id,
            })
            .eq("id", orderData.id);

        if (updateError) {
            throw updateError;
        }



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
            }
        });

        const { error: itemsError } = await supabase
            .from("OrderItems")
            .insert(orderItems);

        if (itemsError) {
            throw itemsError;
        }

        return NextResponse.json({ success: true, payment_session_id: cfData.payment_session_id, order: orderData });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, error: "Failed to create order" },
            { status: 500 }
        )
    }
}