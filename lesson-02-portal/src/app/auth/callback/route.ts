// Ilya Zeldner - Braude College - 2026
// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
// This imports the helper we just created in step 1
import { createClient } from "@/lib/supabase-server";
export async function GET(request: Request) {
  // 1. Get the current URL and the 'code' parameter from it
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    // 2. Create the Supabase client using our new Server Helper
    // (This automatically handles the cookies for us)
    const supabase = await createClient();

    // 3. Exchange the temporary "Email Code" for a permanent "Session Cookie"
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 4. Success! The user is logged in. Send them to the Dashboard.
      // We use 'origin' to make sure we go to the right domain (Localhost or Vercel)
      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  // 5. Failure! If there was no code, or the code was expired/bad.
  // Send them back to Login with an error message so our Red Box can show it.
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
