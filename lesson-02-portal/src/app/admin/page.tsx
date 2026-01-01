// Ilya Zeldner - Braude College - 2026
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const cookieStore = await cookies(); // Get the cookies object

  const supabase = createServerClient(
    // Create Supabase Client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll(); // Read all cookies from the request
        },
        setAll(cookiesToSet) {
          // This allows Supabase to set the "Login Cookie"
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            ); // Set cookies on the request
          } catch {
            // The setAll method was called from a Server Component.
            // This can be ignored if we have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  // Get the current User
  const {
    data: { user },
  } = await supabase.auth.getUser(); // Fetch current user

  if (!user) {
    redirect("/login"); // If no user, redirect to login
  }

  // Format the Date
  const rawDate = user.last_sign_in_at; // Raw last sign-in date
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleString("en-GB", {
        timeZone: "Asia/Jerusalem",
        hour12: false, // 24-hour format
        year: "numeric", // Full year
        day: "2-digit", // 2-digit day
        month: "2-digit", // 2-digit month
        hour: "2-digit", // 2-digit hour
        minute: "2-digit", // 2-digit minute
      })
    : "First login"; // Fallback for first login

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard 🛠️</h1>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-2">Session Info</h2>
        <div className="text-slate-600">
          <p className="font-medium">Last Login:</p>
          <p className="text-2xl font-mono text-blue-600 mt-1">
            {formattedDate} 📅
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <a
          href="/admin/grades"
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
        >
          View Grades 📊
        </a>
        <a
          href="/admin/upload_new_grade"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Grade 📝
        </a>
      </div>
    </div>
  );
}
