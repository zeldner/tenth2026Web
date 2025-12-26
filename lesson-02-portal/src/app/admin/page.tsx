// Ilya Zeldner - 2026 Web Development - Braude College
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function AdminPage() {
  // Setup Server Client (for reading data securely)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // Get the User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the Grades
  const { data: grades } = await supabase.from("grades").select("*");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-3xl font-bold text-green-400 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-slate-400 mb-8">Logged in as: {user?.email}</p>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h2 className="text-xl font-bold mb-4">Student Grades (Secure Data)</h2>
        <div className="space-y-2">
          {grades?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-slate-700 pb-2"
            >
              <span>{item.student_email}</span>
              <span className="font-mono text-yellow-400">
                {item.score} / 100
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
