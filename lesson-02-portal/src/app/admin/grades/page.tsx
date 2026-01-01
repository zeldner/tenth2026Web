import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GradesPage() {
  const supabase = await createClient();

  // 1. Security Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch Data )Using column names)
  const { data: grades } = await supabase
    .from("grades")
    .select("*")
    .order("id", { ascending: false }); // Ordering by ID since 'created_at' might be missing

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Student Grades</h1>
          <Link
            href="/admin"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* THE TABLE */}
        <div className="bg-white rounded-lg shadow overflow-x-auto border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Student Email</th>
                <th className="p-4 font-semibold">Course Name</th>
                <th className="p-4 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    No grades found in database.
                  </td>
                </tr>
              )}

              {grades?.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50 transition">
                  {/* CORRECT MAPPING: Using  DB column names */}
                  <td className="p-4 text-slate-900 font-medium">
                    {row.student_email}
                  </td>
                  <td className="p-4 text-slate-600">{row.course_name}</td>

                  {/* Color Logic: Red if below 60, Green if above */}
                  <td
                    className={`p-4 font-bold ${
                      row.score < 60 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {row.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
