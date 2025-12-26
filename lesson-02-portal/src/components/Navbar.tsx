// Ilya Zeldner - Braude College - 2026
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  const isActive = (path: string) =>
    pathname === path
      ? "text-blue-400 font-bold"
      : "text-gray-300 hover:text-white";

  return (
    <nav className="bg-slate-900 text-white p-4 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter hover:text-blue-400 transition"
        >
          CLASSROOM<span className="text-blue-600">.APP</span>
        </Link>

        {/* NAVIGATION LINKS */}
        {/* CHANGE 3: flex-wrap allows links to drop to a new line if screen is REALLY small */}
        <div className="flex gap-4 items-center text-sm flex-wrap justify-center">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>

          <Link href="/login" className={isActive("/login")}>
            Student Login
          </Link>

          <Link href="/admin" className={isActive("/admin")}>
            Admin
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
