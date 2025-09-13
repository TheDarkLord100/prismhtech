import { createClient } from "@supabase/supabase-js";

// Read from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

// Create a single supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey);
