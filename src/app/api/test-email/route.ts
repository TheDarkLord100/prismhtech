import { NextResponse } from "next/server";
import { sendOrderPlacedEmail } from "@/utils/OrderPlacedEmail";

export async function POST(request: Request) {
  const { orderId } = await request.json();

  if (!orderId) {
    return NextResponse.json(
      { success: false, error: "orderId required" },
      { status: 400 }
    );
  }

  try {
    await sendOrderPlacedEmail({ orderId });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
