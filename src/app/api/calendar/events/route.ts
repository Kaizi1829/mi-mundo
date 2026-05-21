import { NextResponse } from 'next/server'
import { parseIcal } from '@/lib/calendar'

export const dynamic = 'force-dynamic'

// ─── Calendar sources ─────────────────────────────────────────────────────────
// All are public iCal feeds — safe to include in server-side code.
const CALENDARS = [
  {
    // Secret iCal URL stored in Vercel env var (repo is public — never hardcode)
    url:   process.env.GOOGLE_ICAL_EVENTOS ?? '',
    name:  'Eventos',
    color: '#4a9bb5',   // ocean blue
  },
  {
    url:   'https://calendar.google.com/calendar/ical/61611e40e571e31ecd7e6e37864c3c677e1d0b0041a0f7428acd99e3fae711f7%40group.calendar.google.com/public/basic.ics',
    name:  'Comidas',
    color: '#c4a661',   // gold
  },
  {
    url:   process.env.GOOGLE_ICAL_COMPARSA ?? '',
    name:  'Comparsa',
    color: '#9c5de8',   // purple
  },
  {
    url:   process.env.GOOGLE_ICAL_CUIDADO ?? '',
    name:  'Cuidado personal',
    color: '#2c6e8a',   // deep teal
  },
  {
    url:   'https://calendar.google.com/calendar/ical/urao0r7skaoasitbeaeefuapd0%40group.calendar.google.com/public/basic.ics',
    name:  'Médico',
    color: '#22c55e',   // light green
  },
  {
    url:   'https://calendar.google.com/calendar/ical/utk7v6f8d0v2q75c1etpm38cuk%40group.calendar.google.com/public/basic.ics',
    name:  'Trabajo',
    color: '#5a7490',   // slate blue
  },
  {
    url:   'https://calendar.google.com/calendar/ical/kp38op6eru6bflneq8rb59v500%40group.calendar.google.com/public/basic.ics',
    name:  'Viajes',
    color: '#1a7a5e',   // sea green
  },
] as const

// ─── Route ───────────────────────────────────────────────────────────────────
export async function GET() {
  const results = await Promise.allSettled(
    CALENDARS.filter(cal => cal.url).map(async cal => {
      const res = await fetch(cal.url, {
        next: { revalidate: 300 },   // cache 5 min
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${cal.name}`)
      const text = await res.text()
      return parseIcal(text).map(ev => ({
        ...ev,
        // Event's own COLOR property takes precedence; fall back to calendar color
        color:        ev.color ?? cal.color,
        calendarName: cal.name,
      }))
    })
  )

  // Collect fulfilled results, log failures
  const allEvents: ReturnType<typeof parseIcal> = []
  for (const r of results) {
    if (r.status === 'fulfilled') {
      allEvents.push(...r.value)
    } else {
      console.warn('[calendar/events] calendar fetch failed:', r.reason)
    }
  }

  // Deduplicate by UID (same event could appear in two feeds)
  const seen = new Set<string>()
  const unique = allEvents.filter(ev => {
    if (seen.has(ev.id)) return false
    seen.add(ev.id)
    return true
  })

  return NextResponse.json({ events: unique })
}
