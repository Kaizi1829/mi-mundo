import { createClient } from '@supabase/supabase-js'

// Supabase anon (public) credentials — safe to hardcode by design.
// NEXT_PUBLIC_* vars had BOM corruption from PowerShell CLI; hardcoding avoids
// any env-var encoding issues while keeping the same security posture.
const SUPABASE_URL  = 'https://qsfgxevozteckpsohiop.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZmd4ZXZvenRlY2twc29oaW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzQyMjIsImV4cCI6MjA5NDgxMDIyMn0.CQiBgtpwT7c38ceZ9LS_2_yJhjTqPSW4ZZH5jb1iZ78'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(SUPABASE_URL, SUPABASE_ANON)
