import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import {
  validateName,
  validatePhone,
  validateDOB,
  validateLocation,
  validateGSTIN,
} from "@/utils/userValidator";

export async function POST(req: Request) {
  const supabase = createClient(cookies());
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, phone, dob, location, gstin, email } = await req.json();

  const validators = [
    validateName(name),
    validatePhone(phone),
    validateDOB(dob),
    validateLocation(location),
    validateGSTIN(gstin),
  ];

  const errors = validators.filter(Boolean);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  const { error } = await supabase
    .from("users")
    .update({ name, phone, dob, location, gstin })
    .eq("id", auth.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
