import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const ALLOWED_FIELDS = ["name", "phone", "dob", "location"] as const;
type AllowedField = (typeof ALLOWED_FIELDS)[number];

export async function PATCH(req: Request) {
  try {
    const { field, value } = await req.json();

    if (!ALLOWED_FIELDS.includes(field)) {
      return NextResponse.json(
        { error: "Invalid field" },
        { status: 400 }
      );
    }

    const validationError = validateField(field, value);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({ [field]: value })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

function validateField(field: AllowedField, value: string): string | null {
  switch (field) {
    case "name":
      if (!/^[a-zA-Z ]{2,50}$/.test(value))
        return "Name must contain only letters and spaces";
      return null;

    case "phone":
      if (!/^[6-9]\d{9}$/.test(value))
        return "Invalid Indian mobile number";
      return null;

    case "dob": {
      const date = new Date(value);
      if (isNaN(date.getTime()))
        return "Invalid date";
      if (date > new Date())
        return "Date of birth cannot be in the future";
      return null;
    }

    case "location":
      if (value.length < 2 || value.length > 100)
        return "Location must be between 2 and 100 characters";
      return null;
  }
}
