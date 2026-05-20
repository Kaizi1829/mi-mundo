import { createClient } from '@supabase/supabase-js'

// Strip BOM (﻿) and whitespace — PowerShell sometimes injects these
// when env vars are added via CLI pipe.
const clean = (s: string | undefined) => (s ?? '').replace(/^﻿/, '').trim()

const supabaseUrl =
  clean(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://qsfgxevozteckpsohiop.supabase.co'

const supabaseAnonKey =
  clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZmd4ZXZvenRlY2twc29oaW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzQyMjIsImV4cCI6MjA5NDgxMDIyMn0.CQiBgtpwT7c38ceZ9LS_2_yJhjTqPSW4ZZH5jb1iZ78'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey)
