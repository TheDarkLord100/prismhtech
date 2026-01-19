import { Resend } from "resend";
import { createAdminSupabaseClient } from "@/utils/supabase/adminClient";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderQueryResult = {
  id: string;
  created_at: string;
  subtotal_amount: number;
  gst_rate: number;
  gst_type: "CGST_SGST" | "IGST";
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_amount: number;
  user: {
    name: string | null;
    email: string;
  };
  shipping_address: {
    name: string | null;
    phone: string | null;
    address_l1: string | null;
    address_l2: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
  };
};



/* =======================
   Main Function
   ======================= */

export async function sendOrderPlacedEmail({
  orderId,
}: {
  orderId: string;
}) {
  const supabase = createAdminSupabaseClient();

  /* =======================
     1️⃣ Fetch Order (TYPE-LOCKED)
     ======================= */

  const { data: order, error } = await supabase
    .from("Orders")
    .select(`
      id,
      created_at,
      subtotal_amount,
      gst_rate,
      gst_type,
      cgst_amount,
      sgst_amount,
      igst_amount,
      total_amount,
      user:users!inner (
        email,
        name
      ),
      shipping_address:Addresses!Orders_shipping_address_id_fkey!inner (
        name,
        phone,
        address_l1,
        address_l2,
        city,
        state,
        pincode
      )
    `)
    .eq("id", orderId)
    .single<OrderQueryResult>();

  if (error || !order) {
    throw new Error("Order not found for email");
  }

  /* =======================
     2️⃣ Fetch Items
     ======================= */

  const { data: itemsData, error: itemsError } = await supabase
    .from("OrderItems")
    .select(`
    quantity,
    price,
    product:products (
      name
    ),
    variant:ProductVariants (
      name
    )
  `)
    .eq("ordr_id", orderId);


  if (itemsError || !itemsData || itemsData.length === 0) {
    throw new Error("Order items not found");
  }

  /* =======================
     3️⃣ Build Items HTML
     ======================= */

  const itemsHtml = (itemsData as any[])
    .map((item) => {
      const product = item.product ?? null;
      const variant = item.variant ?? null;

      return `
        <tr>
          <td>
            ${product?.name ?? "Product"}
            ${variant?.name ? `(${variant.name})` : ""}
          </td>
          <td>${item.quantity}</td>
          <td>₹${item.price}</td>
        </tr>
      `;
    })
    .join("");

  /* =======================
     4️⃣ GST HTML
     ======================= */

  const gstHtml =
    order.gst_type === "CGST_SGST"
      ? `
        <p>CGST (9%): ₹${order.cgst_amount}</p>
        <p>SGST (9%): ₹${order.sgst_amount}</p>
      `
      : `
        <p>IGST (18%): ₹${order.igst_amount}</p>
      `;

  /* =======================
     5️⃣ Email HTML
     ======================= */

  const orderUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/order?order_id=${order.id}`;

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmed</title>
  </head>

  <body style="margin:0; padding:0; background-color:#f6f6f6; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6; padding:30px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background-color:#16463B; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">
                  Pervesh Rasayan Pvt. Ltd.
                </h1>
                <p style="color:#cfe8dc; margin:6px 0 0; font-size:14px;">
                  Order Confirmation
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:30px;">

                <p style="color:#333; font-size:15px; line-height:1.6;">
                  Hi <strong>${order.user.name ?? "Customer"}</strong>,
                </p>

                <p style="color:#555; font-size:15px; line-height:1.6;">
                  Thank you for your order! Your order
                  <strong>#${order.id}</strong> has been successfully placed.
                </p>

                <!-- Items -->
                <table width="100%" cellpadding="8" cellspacing="0"
                  style="border-collapse:collapse; margin-top:20px; font-size:14px;">
                  <tr style="background-color:#eaf5ef;">
                    <th align="left">Item</th>
                    <th align="center">Qty</th>
                    <th align="right">Price</th>
                  </tr>
                  ${itemsHtml}
                </table>

                <!-- Summary -->
                <table width="100%" cellpadding="6" cellspacing="0"
                  style="margin-top:20px; font-size:14px;">
                  <tr>
                    <td align="left">Subtotal</td>
                    <td align="right">₹${order.subtotal_amount}</td>
                  </tr>

                  ${order.gst_type === "CGST_SGST"
      ? `
                        <tr>
                          <td align="left">CGST (9%)</td>
                          <td align="right">₹${order.cgst_amount}</td>
                        </tr>
                        <tr>
                          <td align="left">SGST (9%)</td>
                          <td align="right">₹${order.sgst_amount}</td>
                        </tr>
                      `
      : `
                        <tr>
                          <td align="left">IGST (18%)</td>
                          <td align="right">₹${order.igst_amount}</td>
                        </tr>
                      `
    }

                  <tr style="font-weight:bold; border-top:1px solid #ddd;">
                    <td align="left">Total Paid</td>
                    <td align="right">₹${order.total_amount}</td>
                  </tr>
                </table>

                <!-- CTA -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${orderUrl}"
                    style="
                      display:inline-block;
                      padding:14px 28px;
                      background-color:#4CAF50;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:6px;
                      font-weight:bold;
                      font-size:16px;
                    ">
                    View Order Details
                  </a>
                </div>

                <p style="color:#777; font-size:13px; line-height:1.6;">
                  If the button does not work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all; font-size:13px; color:#4CAF50;">
                  ${orderUrl}
                </p>

                <hr style="border:none; border-top:1px solid #e0e0e0; margin:30px 0;" />

                <p style="color:#999; font-size:12px;">
                  This is a provisional order confirmation.  
                  A tax invoice will be issued separately once the order is processed.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f0f5f3; padding:15px; text-align:center;">
                <p style="margin:0; font-size:12px; color:#777;">
                  © ${new Date().getFullYear()} Pervesh Rasayan Pvt. Ltd.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`;


  /* =======================
     6️⃣ Send Email
     ======================= */
  await resend.emails.send({
    from: `Pervesh Rasayan <${process.env.FROM_EMAIL!}>`,
    to: order.user.email,
    subject: `Order Confirmed – ${order.id}`,
    html,
  });
}
