// Ilya Zeldner - Braude College - 2026
"use client"; // Must be client-side to handle clicks and path checking
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function Navbar() {
  const pathname = usePathname(); // Tells us which page we are on
  const router = useRouter();

  // Logic to Sign Out
  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.refresh(); // Refresh to clear data
    router.push("/"); // Go back home
  };

  // Helper to style the active link (make it blue if we are on that page)
  const isActive = (path: string) =>
    pathname === path
      ? "text-blue-400 font-bold"
      : "text-gray-300 hover:text-white";

  return (
    <nav className="bg-slate-900 text-white p-4 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* LOGO - Always goes Home */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter hover:text-blue-400 transition"
        >
          CLASSROOM<span className="text-blue-600">.APP</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex gap-6 items-center text-sm">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>

          <Link href="/login" className={isActive("/login")}>
            Student Login
          </Link>

          <Link href="/admin" className={isActive("/admin")}>
            Admin Dashboard
          </Link>

          {/* LOGOUT BUTTON - The "Reset" Switch */}
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
