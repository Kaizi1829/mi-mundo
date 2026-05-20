import { NextResponse } from 'next/server'
import { parseIcal } from '@/lib/calendar'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.GOOGLE_CALENDAR_ICAL_URL
  if (!url) {
    return NextResponse.json({ events: [], error: 'GOOGLE_CALENDAR_ICAL_URL not set' })
  }

  try {
    const res = await fetch(url, {
      // Revalidate every 5 minutes to keep events fresh
      next: { revalidate: 300 },
    })
    if (!res.ok) {
      return NextResponse.json({ events: [], error: `iCal fetch failed: ${res.status}` })
    }
    const text   = await res.text()
    const events = parseIcal(text)

    return NextResponse.json({ events })
  } catch (err) {
    console.error('[calendar/events]', err)
    return NextResponse.json({ events: [], error: String(err) })
  }
}
