// Ilya Zeldner - Braude College - 2026
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
export async function GET(request: Request) {
  // Get the current URL and the 'code' parameter from it
  const { searchParams, origin } = new URL(request.url); // Full URL
  const code = searchParams.get("code"); // Temporary "Email Code" from Supabase
  // If we have a code, try to exchange it for a session

  if (code) {
    // We have a code
    // Create the Supabase client using our  Server Helper
    // (This automatically handles the cookies)
    const supabase = await createClient(); // Get Supabase client

    // Exchange the temporary "Email Code" for a permanent "Session Cookie"
    const { error } = await supabase.auth.exchangeCodeForSession(code); // Try to exchange code

    if (!error) {
      // Success! The user is logged in. Send them to the Dashboard.
      // We use 'origin' to make sure we go to the right domain (Localhost or Vercel)
      return NextResponse.redirect(`${origin}/admin`); // Redirect to Dashboard
      // If there was an error, we fall through to the failure case below
      // which sends them back to Login with an error message.
    }
  }

  // Failure! If there was no code, or the code was expired/bad.
  // Send them back to Login with an error message so our Red Box can show it.
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`); // Redirect to Login with error
}
