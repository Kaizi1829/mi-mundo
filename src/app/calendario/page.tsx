'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  ChevronLeft, ChevronRight, Calendar, MapPin, Clock, X,
} from 'lucide-react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isToday, isSameMonth,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { CalEvent } from '@/lib/calendar'
import { eventsForDay, eventColor } from '@/lib/calendar'

const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// ─── Month grid helper ────────────────────────────────────────────────────────
function buildGrid(viewDate: Date) {
  const monthStart = startOfMonth(viewDate)
  const monthEnd   = endOfMonth(viewDate)
  const gridStart  = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd    = endOfWeek(monthEnd,     { weekStartsOn: 1 })
  return eachDayOfInterval({ start: gridStart, end: gridEnd })
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CalendarioPage() {
  const [viewDate,  setViewDate]  = useState(new Date())
  const [events,    setEvents]    = useState<CalEvent[]>([])
  const [loading,   setLoading]   = useState(true)
  const [hasUrl,    setHasUrl]    = useState(true)
  const [selected,  setSelected]  = useState<string | null>(null)   // "yyyy-MM-dd"

  // Fetch once on mount (covers ~1 yr of events from iCal feed)
  useEffect(() => {
    fetch('/api/calendar/events')
      .then(r => r.json())
      .then(data => {
        if (data.error === 'GOOGLE_CALENDAR_ICAL_URL not set') setHasUrl(false)
        setEvents(data.events ?? [])
      })
      .catch(() => {/* silent */})
      .finally(() => setLoading(false))
  }, [])

  const gridDays = useMemo(() => buildGrid(viewDate), [viewDate])

  const monthLabel = format(viewDate, 'MMMM yyyy', { locale: es })
    .replace(/^\w/, c => c.toUpperCase())

  const prevMonth = () => {
    setSelected(null)
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  const nextMonth = () => {
    setSelected(null)
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }
  const goToday = () => {
    setSelected(null)
    setViewDate(new Date())
  }

  // ── Selected day detail
  const selectedDate   = selected ? new Date(selected + 'T00:00:00') : null
  const selectedEvents = selectedDate ? eventsForDay(events, selectedDate) : []

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between mb-5 rounded-2xl px-6 py-4"
        style={{
          background: 'linear-gradient(135deg, #081524 0%, #0d2137 40%, #1a3a5c 100%)',
          border: '1px solid rgba(74,155,181,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(196,166,97,0.15)', border: '1px solid rgba(196,166,97,0.3)' }}
          >
            <Calendar size={18} style={{ color: '#c4a661' }} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold text-white">Calendario</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(168,213,226,0.65)' }}>
              {hasUrl ? 'Sincronizado con Google Calendar' : 'Vista de calendario — Google Calendar pendiente de configurar'}
            </p>
          </div>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 h-9 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(196,166,97,0.18)', color: '#c4a661', border: '1px solid rgba(196,166,97,0.3)' }}
          >
            Hoy
          </button>
          <button onClick={prevMonth}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ChevronLeft size={16} color="white" />
          </button>
          <span className="text-base font-semibold text-white min-w-[160px] text-center">
            {monthLabel}
          </span>
          <button onClick={nextMonth}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ChevronRight size={16} color="white" />
          </button>
        </div>
      </div>

      {/* ── Setup notice ───────────────────────────────────────────────────── */}
      {!hasUrl && !loading && (
        <div
          className="mb-5 rounded-2xl px-5 py-4"
          style={{ background: 'rgba(196,166,97,0.07)', border: '1px solid rgba(196,166,97,0.22)' }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: '#c4a661' }}>
            ⚠ Conexión con Google Calendar pendiente
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(196,166,97,0.75)' }}>
            Añade la variable de entorno{' '}
            <code className="font-mono text-xs bg-black/25 px-1.5 py-0.5 rounded">GOOGLE_CALENDAR_ICAL_URL</code>{' '}
            en Vercel con la URL secreta iCal de tu Google Calendar.
            La encuentras en <strong>Google Calendar → ⚙ Configuración → tu calendario → Dirección secreta en formato iCal</strong>.
          </p>
        </div>
      )}

      {/* ── Calendar grid ──────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid var(--border-light)' }}
      >
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b" style={{ background: '#f4f7fa', borderColor: 'var(--border-light)' }}>
          {DOW.map(d => (
            <div
              key={d}
              className="py-3 text-center text-xs font-bold uppercase tracking-widest"
              style={{ color: '#5a7490' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid body */}
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div
              className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#4a9bb5', borderTopColor: 'transparent' }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {gridDays.map(day => {
              const dateStr    = format(day, 'yyyy-MM-dd')
              const inMonth    = isSameMonth(day, viewDate)
              const isToday_   = isToday(day)
              const isSelected = selected === dateStr
              const dayEvs     = eventsForDay(events, day)

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelected(isSelected ? null : dateStr)}
                  className="min-h-[100px] p-2 border-r border-b cursor-pointer transition-colors hover:bg-slate-50"
                  style={{
                    borderColor: 'var(--border-light)',
                    background: isSelected
                      ? 'rgba(74,155,181,0.07)'
                      : isToday_
                      ? 'rgba(196,166,97,0.04)'
                      : undefined,
                  }}
                >
                  {/* Day number */}
                  <div className="mb-1.5">
                    <span
                      className="text-sm w-7 h-7 flex items-center justify-center rounded-full"
                      style={{
                        fontWeight: isToday_ ? 700 : inMonth ? 600 : 400,
                        background: isToday_ ? '#c4a661' : 'transparent',
                        color: isToday_ ? '#0d2137' : inMonth ? '#1a2e44' : '#b0c0d0',
                      }}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Event chips */}
                  <div className="space-y-0.5">
                    {dayEvs.slice(0, 3).map(ev => {
                      const c = eventColor(ev)
                      return (
                        <div
                          key={ev.id}
                          className="text-xs px-1.5 py-0.5 rounded truncate"
                          style={{ background: `${c}1a`, color: c, fontWeight: 500 }}
                          title={ev.title}
                        >
                          {!ev.allDay && (
                            <span className="opacity-70 mr-0.5">
                              {format(new Date(ev.start), 'HH:mm')}
                            </span>
                          )}
                          {ev.title}
                        </div>
                      )
                    })}
                    {dayEvs.length > 3 && (
                      <p className="text-xs px-1.5" style={{ color: '#8a9bb0' }}>
                        +{dayEvs.length - 3} más
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Selected day detail ────────────────────────────────────────────── */}
      {selectedDate && selectedEvents.length > 0 && (
        <div
          className="mt-4 rounded-2xl px-5 py-4"
          style={{ background: 'white', border: '1px solid var(--border-light)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
                .replace(/^\w/, c => c.toUpperCase())}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg)', color: 'var(--muted)' }}
            >
              <X size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {selectedEvents.map(ev => {
              const c = eventColor(ev)
              return (
                <div
                  key={ev.id}
                  className="rounded-xl px-4 py-3"
                  style={{
                    background: `${c}0d`,
                    borderLeft: `3px solid ${c}`,
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {ev.title}
                  </p>

                  {!ev.allDay && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={11} style={{ color: c }} />
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {format(new Date(ev.start), 'HH:mm')} – {format(new Date(ev.end), 'HH:mm')}
                      </span>
                    </div>
                  )}
                  {ev.allDay && (
                    <span
                      className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${c}1a`, color: c }}
                    >
                      Todo el día
                    </span>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={11} style={{ color: 'var(--muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {ev.location}
                      </span>
                    </div>
                  )}
                  {ev.description && (
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {ev.description.slice(0, 200)}
                      {ev.description.length > 200 ? '…' : ''}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedDate && selectedEvents.length === 0 && (
        <div
          className="mt-4 rounded-2xl px-5 py-4 text-center"
          style={{ background: 'white', border: '1px solid var(--border-light)' }}
        >
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Sin eventos para el{' '}
            {format(selectedDate, "d 'de' MMMM", { locale: es })}
          </p>
        </div>
      )}
    </div>
  )
}
