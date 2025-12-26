// Ilya Zeldner - Braude College - 2026
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-5xl font-black text-blue-600 mb-8">
        Braude Web Portal
      </h1>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-slate-200 rounded-lg font-bold hover:bg-slate-300"
        >
          Student Login
        </Link>
        <Link
          href="/admin"
          className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
        >
          Admin Access (Protected)
        </Link>
      </div>
    </main>
  );
}
