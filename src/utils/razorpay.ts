// utils/checkout/handleProceedToPayment.ts
export async function handleProceedToPayment({
  selectedDeliveryId,
  selectedBillingId,
  sameAsDelivery,
  cart,
  totalPrice,
  user,
  clearCart,
}: {
  selectedDeliveryId: string | null;
  selectedBillingId: string | null;
  sameAsDelivery: boolean;
  cart: any;
  totalPrice: number;
  user: any;
  clearCart: () => Promise<void>;
}) {
  if (!selectedDeliveryId) {
    alert("Please select a delivery address before proceeding to payment.");
    return;
  }

  // Razorpay Script Loader
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
    alert("Failed to load Razorpay SDK. Try again.");
    return;
  }

  const cartItems = cart.items.map((item: any) => ({
    product_id: item.product_id,
    variant_id: item.variant.pvr_id,
    quantity: item.quantity,
    price: item.variant.price,
  }));

  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      amount: totalPrice,
      receipt: `rcpt_${Date.now()}`,
      ship_adr_id: selectedDeliveryId,
      bill_adr_id: sameAsDelivery ? selectedDeliveryId : selectedBillingId,
      cart_items: cartItems,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    alert("Failed to create order: " + data.message);
    return;
  }

  const razorpayOrder = data.razorpay_order;
  const orderId = data.order.id;

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
        alert("Payment successful! Order ID: " + orderId);
        await clearCart();
      } else {
        alert("Payment verification failed: " + verifyData.message);
      }
    },
    prefill: {
      name: user?.name,
      email: user?.email,
      contact: user?.phone,
    },
    theme: { color: "#3399cc" },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
