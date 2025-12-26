// Ilya Zeldner - Braude College - 2026
import { createBrowserClient } from '@supabase/ssr'
import { useMemo } from 'react'

export function useSupabase() {
  // useMemo ensures we only create this object ONCE per page load, not on every render
  return useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), [])
}