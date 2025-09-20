import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; 
import { cookies } from "next/headers";

// Define the expected request body
interface SignupRequestBody {
  email: string;
  password: string;
  name: string;
  phone: string;
  dob: string;       // adjust to Date if you want real date parsing
  location: string;
  gstin?: string;    // optional
}

export async function POST(req: Request) {
  try {
    const body: SignupRequestBody = await req.json();
    const { email, password, name, phone, dob, location, gstin } = body;
    console.log("Received data:", body);

    // Validate required fields
    if (!email || !password || !name || !phone || !dob || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const supabase = createClient(cookies());

    // Create auth user
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

    // Insert into users table
    const { error: dbError } = await supabase.from("users").insert([
      { id: userId, name, email, phone, dob, location, gstin },
    ]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (err: unknown) {
    // ✅ no more `any`
    if (err instanceof Error) {
      console.error("Signup error:", err.message);
    } else {
      console.error("Unexpected signup error:", err);
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
