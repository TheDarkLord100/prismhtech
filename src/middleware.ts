import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

const protectedRoutes = ["/profile"];

export async function middleware(req: NextRequest) {
  const { supabase, supabaseResponse } = createClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/profile/:path*"],
};
