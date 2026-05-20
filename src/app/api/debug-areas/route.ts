import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://qsfgxevozteckpsohiop.supabase.co'
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZmd4ZXZvenRlY2twc29oaW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzQyMjIsImV4cCI6MjA5NDgxMDIyMn0.CQiBgtpwT7c38ceZ9LS_2_yJhjTqPSW4ZZH5jb1iZ78'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createClient<any>(url, key)
  const { data, error } = await sb.from('areas').select('*').order('orden')

  return NextResponse.json({
    env_url_present:  !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    env_key_present:  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url_used: url.substring(0, 40) + '...',
    areas: data,
    error: error?.message ?? null,
  })
}
