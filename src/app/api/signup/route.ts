import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; 
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone, dob, location, gstin } = body;

    const supabase = createClient(cookies());

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not returned" }, { status: 400 });
    }

    // 2. Insert into users table
    const { error: dbError } = await supabase.from("users").insert([
      { id: userId, name, phone, dob, location, gstin },
    ]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
