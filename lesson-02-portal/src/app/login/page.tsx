// Ilya Zeldner - 2026 Web Development - Braude College
// Lesson 10 - Supabase Authentication Portal
"use client";

import { useSupabase } from "@/hooks/useSupabase";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Idle");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams(); // To read URL query parameters
  const supabase = useSupabase(); // Get Supabase client

  // Check if we were sent back here with an error
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "auth-code-error" && !errorMessage) {
      setErrorMessage("Link expired or already used. Please try again.");
    }
  }, [searchParams, errorMessage]); // Add errorMessage to the list

  const handleLogin = async () => {
    // Clear old errors
    setErrorMessage("");
    setStatus("Sending...");

    // Send the link
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    }); // Send magic link
    // Handle the result

    if (error) {
      setStatus("Idle");
      setErrorMessage(error.message); // Show Supabase errors (like "Wait 60 seconds")
    } else {
      setStatus("Check your email!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      {/* w-full max-w-md ensures it fits on phones */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">User Login</h1>

        {/* ERROR BOX: Shows if something is wrong */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Braude Email
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded text-black"
            placeholder="user@braude.ac.il"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={status === "Check your email!" || status === "Sending..."}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          {status === "Idle" ? "Send Magic Link" : status}
        </button>
      </div>
    </div>
  );
}

// Wrap in Suspense for Next.js safety
export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="text-white text-center p-10">Loading...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
