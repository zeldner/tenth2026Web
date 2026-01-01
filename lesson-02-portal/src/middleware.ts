// Ilya Zeldner - Braude College - 2026
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Setup the response
  const response = NextResponse.next({
    // Create a NextResponse
    request: { headers: request.headers }, // Forward request headers
  }); // Pass headers to the response

  // check if the user is logged in
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // This allows Supabase to read the "Login Cookie"
          return request.cookies.getAll(); // Read all cookies from the request
        },
        setAll(cookiesToSet) {
          // This allows Supabase to set the "Login Cookie"
          cookiesToSet.forEach( 
            ({ name, value }) => request.cookies.set(name, value) // Set cookies on the request
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ); // Set cookies on the response
        },
      },
    } // Pass in the cookie functions
  ); // Create Supabase Client

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // THE GUARD LOGIC
  // If user tries to go to /admin AND is not logged in -> Kick to /login
  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"], // Only run this guard on /admin paths
};
