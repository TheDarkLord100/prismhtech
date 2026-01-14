import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { CartItem } from "@/types/entities";

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

        const SELLER_STATE = "Haryana";
        const GST_RATE = 0.18;

        const isIntraState =
            shippingAddress.state.toLowerCase() === SELLER_STATE.toLowerCase();

        const gstAmount = subtotal * GST_RATE;

        const cgst = isIntraState ? gstAmount / 2 : 0;
        const sgst = isIntraState ? gstAmount / 2 : 0;
        const igst = !isIntraState ? gstAmount : 0;

        const totalAmount = subtotal + gstAmount;

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORYPAY_KEY || "",
            key_secret: process.env.RAZORPAY_SECRET!
        });
        const options = {
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt
        };

        const order = await razorpay.orders.create(options);

        const { data: orderData, error: orderError } = await supabase
            .from("Orders")
            .insert({
                user_id: user.user.id,
                razorpay_order_id: order.id,

                subtotal_amount: subtotal,
                gst_rate: 18,
                gst_type: isIntraState ? "CGST_SGST" : "IGST",
                cgst_amount: cgst,
                sgst_amount: sgst,
                igst_amount: igst,
                total_amount: totalAmount,

                shipping_address_id: ship_adr_id,
                billing_address_id: bill_adr_id,
                payment_type: "Razorpay",
                status: "CREATED",
                status_description: "Order created, awaiting payment",
            })
            .select()
            .single();


        if (orderError) {
            throw orderError;
        }

        const orderItems = cart_items.map((item: any) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            ordr_id: orderData.id,
            quantity: item.quantity,
            price: item.price,
        }));

        const { error: itemsError } = await supabase
            .from("OrderItems")
            .insert(orderItems);

        if (itemsError) {
            throw itemsError;
        }

        return NextResponse.json({ success: true, razorpay_order: order, order: orderData });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, error: "Failed to create order" },
            { status: 500 }
        )
    }
}