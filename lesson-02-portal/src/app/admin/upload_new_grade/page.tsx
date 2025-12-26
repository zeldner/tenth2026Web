// Ilya Zeldner - 2026 Web Development - Braude College
"use client"; // Client Component because we have a Form

import { useSupabase } from "@/hooks/useSupabase";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddGradePage() {
  const supabase = useSupabase();
  const router = useRouter(); // For redirecting after success

  // Form State
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Send data to Supabase
    const { error } = await supabase.from("grades").insert([
      {
        student_email: email,
        course_name: course, // Mapped to your DB column
        score: Number(score), // Convert text to number
      },
    ]);

    setLoading(false);

    // 2. Handle Result
    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("✅ Grade added successfully!");
      // Clear form
      setEmail("");
      setCourse("");
      setScore("");
      // Optional: Redirect back to dashboard after 1 second
      setTimeout(() => router.push("/admin/grades"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Add New Student Grade
        </h1>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`p-3 rounded mb-4 text-center text-sm ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Student Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@braude.ac.il"
              className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
            />
          </div>

          {/* Course Name Input (Mapped to course_name) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Course Name
            </label>
            <input
              required
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Web Development"
              className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
            />
          </div>

          {/* Score Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Score (0-100)
            </label>
            <input
              required
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="85"
              className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Add Grade"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/admin"
            className="text-slate-500 hover:text-blue-600 text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
