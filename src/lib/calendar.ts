// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalEvent {
  id: string
  title: string
  start: string   // ISO 8601 string (timezone-aware)
  end: string     // ISO 8601 string
  allDay: boolean
  description?: string
  location?: string
  color?: string  // CSS hex color derived from Google Calendar color property
}

// ─── iCal Parser (RFC 5545) ───────────────────────────────────────────────────

/** Unfold RFC 5545 line folding: continuation lines start with space or tab */
function unfold(raw: string): string[] {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n[ \t]/g, '')     // join folded lines
    .split('\n')
}

/** Parse a property line like "DTSTART;TZID=Europe/Madrid:20260520T090000" */
function parseProp(line: string): { name: string; params: string; value: string } | null {
  const ci = line.indexOf(':')
  if (ci < 0) return null
  const left = line.slice(0, ci)
  const value = line.slice(ci + 1)
  const si = left.indexOf(';')
  if (si < 0) return { name: left.toUpperCase(), params: '', value }
  return { name: left.slice(0, si).toUpperCase(), params: left.slice(si + 1), value }
}

/**
 * Convert iCal date/datetime value to ISO string.
 * - DATE: "20260520" → "2026-05-20T00:00:00"
 * - DATETIME UTC: "20260520T090000Z" → "2026-05-20T09:00:00Z"
 * - DATETIME local: "20260520T090000" → "2026-05-20T09:00:00" (treated as local)
 */
function parseIcalDate(value: string, params: string): { iso: string; allDay: boolean } {
  const allDay = params.includes('VALUE=DATE') || (value.length === 8 && !value.includes('T'))
  if (allDay) {
    return {
      iso: `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T00:00:00`,
      allDay: true,
    }
  }
  const y  = value.slice(0, 4)
  const mo = value.slice(4, 6)
  const d  = value.slice(6, 8)
  const h  = value.slice(9, 11)
  const mi = value.slice(11, 13)
  const s  = value.slice(13, 15) || '00'
  const utc = value.endsWith('Z') ? 'Z' : ''
  return { iso: `${y}-${mo}-${d}T${h}:${mi}:${s}${utc}`, allDay: false }
}

/** Unescape iCal text value escape sequences */
function esc(v: string): string {
  return v
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
    .trim()
}

/**
 * Map Google Calendar named colors to CSS hex.
 * Google uses lowercase names; we map to marina palette where sensible.
 */
function mapColor(v: string): string | undefined {
  const map: Record<string, string> = {
    tomato:    '#dc3545',
    flamingo:  '#e07b39',
    tangerine: '#c4a661',
    banana:    '#c4a661',
    sage:      '#2c6e8a',
    basil:     '#1a3a5c',
    peacock:   '#4a9bb5',
    blueberry: '#1a3a5c',
    lavender:  '#a8d5e2',
    grape:     '#5a7490',
    graphite:  '#5a7490',
  }
  return map[v.toLowerCase()]
}

/** Parse a full iCal feed text into CalEvent[] */
export function parseIcal(text: string): CalEvent[] {
  const lines  = unfold(text)
  const events: CalEvent[] = []

  let inEvent = false
  let props:  Record<string, string> = {}   // property name → value
  let params: Record<string, string> = {}   // property name → params string

  for (const line of lines) {
    if (!line.trim()) continue

    if (line === 'BEGIN:VEVENT') {
      inEvent = true
      props  = {}
      params = {}
      continue
    }

    if (line === 'END:VEVENT') {
      inEvent = false
      // Skip cancelled events
      if (props.STATUS === 'CANCELLED') continue
      if (!props.UID || !props.SUMMARY || !props.DTSTART) continue

      const { iso: startIso, allDay } = parseIcalDate(props.DTSTART, params.DTSTART ?? '')
      const endRaw    = props.DTEND ?? props.DTSTART
      const { iso: endIso } = parseIcalDate(endRaw, params.DTEND ?? params.DTSTART ?? '')

      events.push({
        id:          props.UID,
        title:       esc(props.SUMMARY),
        start:       startIso,
        end:         endIso,
        allDay,
        description: props.DESCRIPTION ? esc(props.DESCRIPTION) : undefined,
        location:    props.LOCATION    ? esc(props.LOCATION)    : undefined,
        color:       props.COLOR       ? mapColor(props.COLOR)  : undefined,
      })
      continue
    }

    if (!inEvent) continue

    const p = parseProp(line)
    if (!p) continue
    props[p.name]  = p.value
    if (p.params) params[p.name] = p.params
  }

  return events
}

// ─── Helper functions for UI ───────────────────────────────────────────────────

/** Events that overlap a given calendar day */
export function eventsForDay(events: CalEvent[], day: Date): CalEvent[] {
  const y = day.getFullYear(), m = day.getMonth(), d = day.getDate()
  const dayStart = new Date(y, m, d, 0, 0, 0).getTime()
  const dayEnd   = new Date(y, m, d, 23, 59, 59).getTime()
  return events
    .filter(e => {
      const s = new Date(e.start).getTime()
      const en = new Date(e.end).getTime()
      return s <= dayEnd && en >= dayStart
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

/**
 * Derive a display color for an event.
 * Uses the event's own COLOR property if set, otherwise keyword-matches the title.
 */
export function eventColor(ev: CalEvent): string {
  if (ev.color) return ev.color
  const t = ev.title.toLowerCase()
  if (/axa|p[oó]liza|seguro|siniestro|mediador|aseguradora/.test(t)) return '#e07b39'
  if (/opa|oposici|temario|examen|badajoz|m[eé]rida|extremadura/.test(t)) return '#c4a661'
  if (/neting|marketing|campa[nñ]a|instagram|facebook/.test(t))           return '#2c6e8a'
  if (/m[eé]dico|dentista|farmacia|hospital|cl[ií]nica/.test(t))          return '#4a9bb5'
  return '#4a9bb5'   // ocean blue default
}
