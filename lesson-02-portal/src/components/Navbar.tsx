// Ilya Zeldner - Braude College - 2026
"use client"; // Required because we use Hooks like useState and useEffect

import Link from "next/link";
import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

export default function Navbar() {
  // Navbar Component
  const supabase = useSupabase(); // Get Supabase client from our custom hook
  const router = useRouter(); // Next.js Router for navigation

  // Local state to track if a user is logged in
  // Initial state is null (unknown)
  const [session, setSession] = useState<Session | null>(null); // State to hold the current session

  // This effect runs immediately when the Navbar loads
  useEffect(() => {
    // Check active session immediately
    const checkSession = async () => {
      // Function to check current session
      const { data } = await supabase.auth.getSession();
      setSession(data.session); // Update state with current session
    };
    checkSession(); // Call the function to check session

    // Set up a listener for Auth changes (Login, Logout ...)
    const {
      data: { subscription }, // Subscribe to auth state changes
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Listen for auth changes
      setSession(session); // Update state when auth state changes
    });

    // Cleanup function to remove the listener when component unmounts
    return () => subscription.unsubscribe(); // Unsubscribe from auth changes
  }, [supabase]); // Empty dependency array means this runs once on mount

  // Logout function
  const handleLogout = async () => {
    // Function to handle user logout
    await supabase.auth.signOut(); // Sign out the user
    router.push("/login"); // Redirect to login page
    router.refresh(); // Refresh to clear any stale data
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/">GradeSystem 🎓</Link>
      </div>

      <div>
        {/* Conditional Rendering logic:
            IF session exists (User is logged in) -> Show "Sign Out" button
            ELSE (User is guest) -> Show "Sign In" button
        */}
        {session ? (
          <div className="flex gap-4 items-center">
            {/* Optional: Show user email */}
            <span className="text-sm text-slate-300">{session.user.email}</span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
