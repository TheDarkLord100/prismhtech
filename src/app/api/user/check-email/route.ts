import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/utils/supabase/adminClient";



export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    const supabaseAdmin = createAdminSupabaseClient();
    // Fetch users (paginated - fine for small apps)
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        { error: "Unable to verify email" },
        { status: 500 }
      );
    }

    const existingUser = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    if (!existingUser) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const provider = existingUser.identities?.[0]?.provider;

    if (provider === "google") {
      return NextResponse.json(
        {
          exists: true,
          provider: "google",
          message:
            "This email is already registered using Google. Please sign in with Google.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        exists: true,
        provider: "email",
        message: "Email already registered. Please login.",
      },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
