import { Notification, notify } from "./notify";
import { load } from "@cashfreepayments/cashfree-js";

async function getCashfree() {
  return await load({ mode: "sandbox" });
}

export async function handleProceedToPayment({
  selectedDeliveryId,
  selectedBillingId,
  sameAsDelivery,
  cart,
  subtotal,
  gst,
  totalAmount,
  user,
  clearCart,
}: {
  selectedDeliveryId: string | null;
  selectedBillingId: string | null;
  sameAsDelivery: boolean;
  cart: any;
  subtotal: number;
  gst: {
    rate: number;
    type: "CGST_SGST" | "IGST";
    cgst: number;
    sgst: number;
    igst: number;
  }
  totalAmount: number;
  user: any;
  clearCart: ({ invisible }: { invisible: boolean }) => Promise<void>;
}) {
  if (!selectedDeliveryId) {
    notify(Notification.WARNING, "Please select a delivery address before proceeding.");
    return;
  }
  if (!sameAsDelivery && !selectedBillingId) {
    notify(Notification.WARNING, "Please select a billing address before proceeding.");
    return;
  }

  try {
    const cartItems = cart.items.map((item: any) => {
      if (item.item_type === "product") {
        return {
          item_type: "product",
          product_id: item.product_id,
          variant_id: item.variant.pvr_id,
          quantity: item.quantity,
          price: item.variant.price,
        };
      }
      return {
        item_type: "metal",
        metal_id: item.metal_id,
        quantity: item.quantity,
        price: item.unit_price,
      }
    });

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        pricing: {
          subtotal,
          gst,
          total: totalAmount,
        },
        receipt: `rcpt_${Date.now()}`,
        ship_adr_id: selectedDeliveryId,
        bill_adr_id: sameAsDelivery ? selectedDeliveryId : selectedBillingId,
        cart_items: cartItems,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {

      notify(
        Notification.FAILURE,
        data.error || "Failed to create order"
      );

      return;
    }

    const { payment_session_id } = data;

    if (!payment_session_id) {
      notify(
        Notification.FAILURE,
        "Failed to initiate payment session"
      );
      return;
    }

    // await clearCart({ invisible: true });

    const cashfree = await getCashfree();

    cashfree.checkout({
      paymentSessionId: payment_session_id,
      redirectTarget: "_self",
    });

  } catch (error: any) {

    console.error(error);

    notify(
      Notification.FAILURE,
      error?.message || "Something went wrong"
    );
  }
}

export async function handleRetryPayment({
  orderId,
}: {
  orderId: string;
}) {

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-sdk")) return resolve(true);

      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const loaded = await loadRazorpay();
  if (!loaded) {
    notify(Notification.FAILURE, "Failed to load Razorpay SDK. Try again.");
    return;
  }

  const res = await fetch("/api/order/retry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ order_id: orderId }),
  })

  const data = await res.json();

  if (!data.success) {
    notify(Notification.FAILURE, "Failed to initiate retry payment: " + data.error);
    return;
  }

  const razorpayOrder = data.razorpay_order;

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORYPAY_KEY!,
    amount: razorpayOrder.amount,
    currency: "INR",
    name: "Pervesh Rasayan Pvt. Ltd.",
    description: "Order Id: " + orderId,
    order_id: razorpayOrder.id,

    handler: async function (response: any) {
      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          razorpay_order_id: razorpayOrder.id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          order_id: orderId,
          transaction_id: response.razorpay_payment_id,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        notify(Notification.SUCCESS, "Payment successful!");
        window.location.href = `/order?order_id=${orderId}`;
      } else {
        notify(Notification.FAILURE, "Payment verification failed: " + verifyData.error);
      }
    },
    theme: { color: "#3399cc" },
  };

  const rzp = new (window as any).Razorpay(options);

  rzp.open();
}