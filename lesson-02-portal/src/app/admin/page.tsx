// Ilya Zeldner - 2026 Web Development - Braude College
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Check User (Security)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // GET REAL DATA: Count how many rows are in the 'grades' table
  // 'count: exact' tells Supabase to just count them, not download all 1000 rows (opt fast!)
  const { count: gradesCount } = await supabase
    .from("grades")
    .select("*", { count: "exact", head: true });

  // Handle database errors (e.g., if table is empty)
  const safeCount = gradesCount || 0;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-500">
            Logged in as:{" "}
            <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {user.email}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DATA*/}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Database Stats
            </h2>
            <div className="text-slate-600 space-y-2">
              <p className="flex justify-between">
                <span>Total Grades/Rows:</span>
                <span className="font-bold text-blue-600 text-xl">
                  {safeCount}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                * This data comes directly from Supabase
              </p>
            </div>
          </div>

          {/* LINKS  */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Quick Actions
            </h2>

            {/* Link 1: View Grades */}
            <Link
              href="/admin/grades"
              className="block w-full bg-slate-900 text-white text-center px-4 py-3 rounded hover:bg-slate-700 transition mb-3"
            >
              View Full Grade Table
            </Link>

            {/* Link 2: Upload New Grade */}
            <Link
              href="/admin/upload_new_grade"
              className="block w-full border border-slate-300 text-slate-700 text-center px-4 py-3 rounded hover:bg-slate-50 transition"
            >
              Upload New Grade
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
