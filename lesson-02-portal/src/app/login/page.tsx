// Ilya Zeldner - 2026 Web Development - Braude College
// Lesson 10 - Supabase Authentication Portal
"use client";
import { createClient } from "@/lib/supabase";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Idle");
  const supabase = createClient();

  const handleLogin = async () => {
    setStatus("Sending...");
    // This sends a Magic Link to the email
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (error) setStatus("Error: " + error.message);
    else setStatus("Check your email!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <h1 className="text-2xl font-bold mb-4">Student Login</h1>
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter Braude Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {status === "Idle" ? "Send Magic Link" : status}
        </button>
      </div>
    </div>
  );
}
