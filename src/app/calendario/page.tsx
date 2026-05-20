import { Calendar } from 'lucide-react'

// Google Calendar embed — all calendars included with their colors.
// wkst=2 = week starts Monday (España), ctz=Europe/Madrid, mode=MONTH
const EMBED_SRC =
  'https://calendar.google.com/calendar/embed' +
  '?wkst=2&ctz=Europe%2FMadrid&showPrint=0&showTz=0&showCalendars=0&showTitle=0&mode=MONTH' +
  '&src=bWFydGFnYXJjaWF6YXJhdGVAZ21haWwuY29t' +
  '&src=MGY3NDg0NzViZDk1ODRjZTRjODMyMmU3M2NjYTlhOGZkNWJjMDQ3Y2YyODQ5YmZkNmFmOTM3Njc3NWQ3OTc2N0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t' +
  '&src=NjE2MTFlNDBlNTcxZTMxZWNkN2U2ZTM3ODY0YzNjNjc3ZTFkMGIwMDQxYTBmNzQyOGFjZDk5ZTNmYWU3MTFmN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t' +
  '&src=ODdkYmU3ZjhhYTNjZWY3YWM0ZGVjNjI0ODc1NzljZTFhM2RmMzE0MDU5MmYzZTQxZDQ0OWVkZjE4YzEzYjEyZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t' +
  '&src=ZmZiMjc2OTE4ZWYzNGEyNjIyMjdhMjA4ODFlNmI1OGJiYjE4YzYzNzU5NjRjNmEwN2M5ZjBmYTFlNmQ2YTM0ZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t' +
  '&src=aDB1cmEwcHRsbTg2YnFzcnYzZDNrZnRnczRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ' +
  '&src=a3AzOG9wNmVydTZiZmxuZXE4cmI1OXY1MDBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ' +
  '&src=dXJhbzByN3NrYW9hc2l0YmVhZWVmdWFwZDBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ' +
  '&src=dXRrN3Y2ZjhkMHYycTc1YzFldHBtMzhjdWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ' +
  '&color=%230ff6cf&color=%238e24aa&color=%23c0ca33&color=%23ffe785' +
  '&color=%23039be5&color=%23d81b60&color=%23f6bf26&color=%23e67c73&color=%23039be5'

export default function CalendarioPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 mb-4 rounded-2xl px-6 py-4 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #081524 0%, #0d2137 40%, #1a3a5c 100%)',
          border: '1px solid rgba(74,155,181,0.15)',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(196,166,97,0.15)', border: '1px solid rgba(196,166,97,0.3)' }}
        >
          <Calendar size={18} style={{ color: '#c4a661' }} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl font-serif font-semibold text-white">Calendario</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(168,213,226,0.65)' }}>
            Sincronizado con Google Calendar · Europa/Madrid
          </p>
        </div>
      </div>

      {/* ── Embed ──────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--border-light)', minHeight: 0 }}
      >
        <iframe
          src={EMBED_SRC}
          style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
          frameBorder="0"
          scrolling="no"
          title="Google Calendar"
        />
      </div>
    </div>
  )
}
