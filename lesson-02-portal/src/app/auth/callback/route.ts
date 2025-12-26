// Ilya Zeldner - Braude College - 2026
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  // Get the "code" from the URL (the magic link has it)
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // If we have a code, we want to exchange it for a session cookie
  if (code) {
    const cookieStore = await cookies();

    // Create the Supabase client just for this moment
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // The Exchange: Give Code -> Get Session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // If successful, send them to the Admin page (or Home)
    if (!error) {
      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  // If something went wrong, send them back to login
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
