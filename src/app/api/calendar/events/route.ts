import { NextResponse } from 'next/server'
import { parseIcal } from '@/lib/calendar'

export const dynamic = 'force-dynamic'

// ─── Calendar sources ─────────────────────────────────────────────────────────
// Secret URLs are stored in Vercel env vars (repo is public — never hardcode).
// Entries with empty url are skipped automatically.
const CALENDARS = [
  { url: process.env.GOOGLE_ICAL_EVENTOS  ?? '', name: 'Eventos',          color: '#4a9bb5' },
  { url: process.env.GOOGLE_ICAL_COMPARSA ?? '', name: 'Comparsa',         color: '#9c5de8' },
  { url: process.env.GOOGLE_ICAL_CUIDADO  ?? '', name: 'Cuidado personal', color: '#2c6e8a' },
  { url: process.env.GOOGLE_ICAL_MEDICO   ?? '', name: 'Médico',           color: '#22c55e' },
  { url: process.env.GOOGLE_ICAL_TRABAJO  ?? '', name: 'Trabajo',          color: '#5a7490' },
  { url: process.env.GOOGLE_ICAL_VIAJES   ?? '', name: 'Viajes',           color: '#1a7a5e' },
  { url: process.env.GOOGLE_ICAL_FAMILIA  ?? '', name: 'Familia',          color: '#f06292' },
] as const

// ─── Route ───────────────────────────────────────────────────────────────────
export async function GET() {
  const results = await Promise.allSettled(
    CALENDARS.filter(cal => cal.url).map(async cal => {
      const res = await fetch(cal.url, { next: { revalidate: 300 } })
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${cal.name}`)
      const text = await res.text()
      return parseIcal(text).map(ev => ({
        ...ev,
        color:        ev.color ?? cal.color,
        calendarName: cal.name,
      }))
    })
  )

  const allEvents: ReturnType<typeof parseIcal> = []
  for (const r of results) {
    if (r.status === 'fulfilled') {
      allEvents.push(...r.value)
    } else {
      console.warn('[calendar/events] fetch failed:', r.reason)
    }
  }

  // Deduplicate by UID
  const seen = new Set<string>()
  const unique = allEvents.filter(ev => {
    if (seen.has(ev.id)) return false
    seen.add(ev.id)
    return true
  })

  return NextResponse.json({ events: unique })
}
