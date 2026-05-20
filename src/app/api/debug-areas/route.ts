import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Hardcoded public anon credentials — avoids BOM/encoding issues from CLI
const SUPABASE_URL  = 'https://qsfgxevozteckpsohiop.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZmd4ZXZvenRlY2twc29oaW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzQyMjIsImV4cCI6MjA5NDgxMDIyMn0.CQiBgtpwT7c38ceZ9LS_2_yJhjTqPSW4ZZH5jb1iZ78'

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createClient<any>(SUPABASE_URL, SUPABASE_ANON)
  const { data, error } = await sb.from('areas').select('*').order('orden')

  return NextResponse.json({
    ok: !error,
    areas: data,
    count: data?.length ?? 0,
    error: error?.message ?? null,
  })
}
