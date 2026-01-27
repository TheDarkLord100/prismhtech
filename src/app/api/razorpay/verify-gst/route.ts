import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gstin = searchParams.get("gstin");

    if (!gstin) {
      return NextResponse.json(
        { error: "GST number is required" },
        { status: 400 }
      );
    }

    // Optional: GST format validation
    const GST_REGEX =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!GST_REGEX.test(gstin)) {
      return NextResponse.json(
        { error: "Invalid GST format" },
        { status: 400 }
      );
    }

    const razorpayUrl = `https://razorpay.com/api/gstin/${gstin}`;

    const response = await fetch(razorpayUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error_description:
            data?.error_description ??
            "Unable to fetch GST details. Please try again later.",
        },
        { status: response.status }
      );
    }

    // ✅ Extract only required fields
    const details =
      data?.enrichment_details?.online_provider?.details;

    const legalName = details?.legal_name?.value;
    const status = details?.status?.value;

    if (!legalName || !status) {
      return NextResponse.json(
        { error_description: "Incomplete GST data received" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        legal_name: legalName,
        status: status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GST verification error:", error);

    return NextResponse.json(
      {
        error_description:
          "Something went wrong while verifying GST. Please try again later.",
      },
      { status: 500 }
    );
  }
}
