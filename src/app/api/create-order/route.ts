import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { CartItem } from "@/types/entities";

export async function POST(request: Request) {
    try {
        const { amount, receipt, ship_adr_id, bill_adr_id, cart_items } = await request.json();

        const supabase = createClient(cookies());
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORYPAY_KEY || "",
            key_secret: process.env.RAZORPAY_SECRET!
        });
        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt
        };

        const order = await razorpay.orders.create(options);

        const { data: orderData, error: orderError } = await supabase
        .from("Orders")
        .insert({
            user_id: user.user.id,
            razorpay_order_id: order.id,
            total_amount: amount,
            shipping_address_id: ship_adr_id,
            billing_address_id: bill_adr_id,
            payment_type: "Razorpay",
            status: "Order created",
            status_description: "Order has been created and is pending payment",
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
            {success: false, error: "Failed to create order"},
            {status: 500}
        )
    }
}