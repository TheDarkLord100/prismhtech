import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { validateName, validatePhone, validateDOB, 
  validateLocation, validateGSTIN, validatePassword,
validateEmail } from "@/utils/userValidator";

interface SignupRequestBody {
  email: string;
  password: string;
  name: string;
  phone: string;
  dob: string;
  location: string;
  gstin: string;
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

    const validators = [
      validateName(name),
      validatePhone(phone),
      validateDOB(dob),
      validateLocation(location),
      validateGSTIN(gstin),
      validatePassword(password),
      validateEmail(email),
    ];
    const errors = validators.filter((v) => v !== null);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
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
    if (err instanceof Error) {
      console.error("Signup error:", err.message);
    } else {
      console.error("Unexpected signup error:", err);
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
