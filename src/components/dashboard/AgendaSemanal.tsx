'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Circle } from 'lucide-react'
import {
  format, startOfWeek, endOfWeek, eachDayOfInterval,
  addWeeks, subWeeks, isToday,
} from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import type { CalEvent } from '@/lib/calendar'
import { eventsForDay, eventColor } from '@/lib/calendar'
import type { Tarea } from '@/lib/tareas'
import { getTareas } from '@/lib/tareas'
import { PRIORIDAD_CONFIG } from '@/lib/tareas'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function weekRange(ref: Date) {
  const start = startOfWeek(ref, { weekStartsOn: 1 })
  const end   = endOfWeek(ref,   { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

function tasksForDay(tasks: Tarea[], day: Date): Tarea[] {
  const s = format(day, 'yyyy-MM-dd')
  return tasks.filter(t => t.fecha_vencimiento === s && t.estado !== 'completada')
}

// Short day labels in Spanish
const DOW_SHORT: Record<number, string> = {
  1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 0: 'Dom',
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AgendaSemanal() {
  const [anchor, setAnchor] = useState(new Date())   // reference date for current week
  const [events, setEvents] = useState<CalEvent[]>([])
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)

  const days = weekRange(anchor)

  useEffect(() => {
    Promise.all([
      fetch('/api/calendar/events')
        .then(r => r.json())
        .then(d => d.events ?? [])
        .catch(() => []),
      getTareas().catch(() => []),
    ]).then(([evs, ts]) => {
      setEvents(evs)
      setTareas(ts)
      setLoading(false)
    })
  }, [])

  const weekStart = days[0]
  const weekEnd   = days[6]
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth()
  const weekLabel = sameMonth
    ? `${format(weekStart, 'd')} – ${format(weekEnd, 'd')} de ${format(weekEnd, 'MMMM', { locale: es })}`
    : `${format(weekStart, 'd MMM', { locale: es })} – ${format(weekEnd, 'd MMM', { locale: es })}`

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        border: '1px solid var(--border-light)',
        boxShadow: '0 1px 8px rgba(13,33,55,0.05)',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--border-light)', background: '#f4f8fc' }}
      >
        <div className="flex items-center gap-2">
          <Calendar size={14} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text)', letterSpacing: '0.08em' }}>
            Agenda semanal
          </h2>
          <span className="text-xs ml-1" style={{ color: 'var(--muted)' }}>{weekLabel}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Back to current week */}
          <button
            onClick={() => setAnchor(new Date())}
            className="px-2.5 h-7 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(44,110,138,0.1)', color: 'var(--accent)' }}
          >
            Hoy
          </button>
          <button
            onClick={() => setAnchor(d => subWeeks(d, 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.04)' }}
          >
            <ChevronLeft size={13} style={{ color: 'var(--muted)' }} />
          </button>
          <button
            onClick={() => setAnchor(d => addWeeks(d, 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.04)' }}
          >
            <ChevronRight size={13} style={{ color: 'var(--muted)' }} />
          </button>
          <Link
            href="/calendario"
            className="px-2.5 h-7 rounded-lg text-xs font-medium flex items-center"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            Ver mes
          </Link>
        </div>
      </div>

      {/* ── Day columns ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-7 divide-x divide-slate-100">
          {days.map(day => {
            const isTd    = isToday(day)
            const dayEvs  = eventsForDay(events, day)
            const dayTasks = tasksForDay(tareas, day)
            const isEmpty = dayEvs.length === 0 && dayTasks.length === 0
            const dow     = day.getDay()

            return (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className="flex flex-col"
                style={{
                  background: isTd ? 'rgba(196,166,97,0.04)' : undefined,
                  borderRight: '1px solid var(--border-light)',
                }}
              >
                {/* Day header */}
                <div
                  className="px-2 pt-2.5 pb-2 border-b text-center"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: isTd ? 'var(--accent)' : 'var(--muted)', letterSpacing: '0.06em' }}>
                    {DOW_SHORT[dow]}
                  </p>
                  <p
                    className="text-lg font-bold mt-0.5 w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                    style={{
                      color:      isTd ? '#0d2137' : 'var(--text)',
                      background: isTd ? '#c4a661' : 'transparent',
                      lineHeight: 1,
                    }}
                  >
                    {format(day, 'd')}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 px-1.5 py-1.5 space-y-1 min-h-[120px]">
                  {/* Calendar events */}
                  {dayEvs.slice(0, 4).map(ev => {
                    const c = eventColor(ev)
                    return (
                      <div
                        key={ev.id}
                        className="rounded px-1.5 py-1 text-xs leading-snug"
                        style={{ background: `${c}15`, borderLeft: `2px solid ${c}` }}
                        title={ev.title}
                      >
                        {!ev.allDay && (
                          <span
                            className="font-bold block"
                            style={{ color: c, fontSize: 11, lineHeight: 1.2 }}
                          >
                            {format(new Date(ev.start), 'HH:mm')}
                          </span>
                        )}
                        <span
                          className="truncate block"
                          style={{ color: '#1a2e44', fontSize: 11, lineHeight: 1.3 }}
                        >
                          {ev.title}
                        </span>
                      </div>
                    )
                  })}
                  {dayEvs.length > 4 && (
                    <p className="text-xs px-1.5" style={{ color: 'var(--muted)' }}>
                      +{dayEvs.length - 4} más
                    </p>
                  )}

                  {/* Separator if both events and tasks */}
                  {dayEvs.length > 0 && dayTasks.length > 0 && (
                    <div className="h-px mx-1" style={{ background: 'var(--border-light)' }} />
                  )}

                  {/* Tasks */}
                  {dayTasks.slice(0, 3).map(t => {
                    const pc = PRIORIDAD_CONFIG[t.prioridad]
                    return (
                      <div
                        key={t.id}
                        className="flex items-start gap-1 rounded px-1.5 py-0.5 text-xs leading-snug"
                        style={{ background: 'rgba(0,0,0,0.03)' }}
                        title={t.titulo}
                      >
                        <Circle
                          size={6}
                          fill={pc.color}
                          style={{ color: pc.color, flexShrink: 0, marginTop: 4 }}
                        />
                        <span className="truncate" style={{ color: '#1a2e44' }}>{t.titulo}</span>
                      </div>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <p className="text-xs px-1.5" style={{ color: 'var(--muted)' }}>
                      +{dayTasks.length - 3} tareas
                    </p>
                  )}

                  {/* Empty day */}
                  {isEmpty && (
                    <p className="text-xs text-center pt-4" style={{ color: 'var(--border)' }}>—</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
