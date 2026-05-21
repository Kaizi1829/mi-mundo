'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, ExternalLink } from 'lucide-react'
import {
  format, startOfWeek, endOfWeek, eachDayOfInterval,
  addWeeks, subWeeks, isToday,
} from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import type { CalEvent } from '@/lib/calendar'
import { eventsForDay, eventColor } from '@/lib/calendar'
import type { Tarea } from '@/lib/tareas'
import { getTareas, PRIORIDAD_CONFIG } from '@/lib/tareas'

// ─── Constants ────────────────────────────────────────────────────────────────
const HOUR_H   = 52                              // px per hour
const DAY_S    = 7                               // 07:00
const DAY_E    = 22                              // 22:00
const HOURS    = Array.from({ length: DAY_E - DAY_S }, (_, i) => DAY_S + i)
const TOTAL_H  = HOURS.length * HOUR_H          // total grid height

const DOW: Record<number, string> = {
  1: 'LUN', 2: 'MAR', 3: 'MIÉ', 4: 'JUE', 5: 'VIE', 6: 'SÁB', 0: 'DOM',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function weekDays(anchor: Date) {
  return eachDayOfInterval({
    start: startOfWeek(anchor, { weekStartsOn: 1 }),
    end:   endOfWeek(anchor,   { weekStartsOn: 1 }),
  })
}

function tasksForDay(tasks: Tarea[], day: Date) {
  const s = format(day, 'yyyy-MM-dd')
  return tasks.filter(t => t.fecha_vencimiento === s && t.estado !== 'completada')
}

function evTop(iso: string) {
  const d = new Date(iso)
  return Math.max(0, ((d.getHours() - DAY_S) * 60 + d.getMinutes()) / 60 * HOUR_H)
}

function evH(startIso: string, endIso: string) {
  const mins = (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000
  return Math.max(HOUR_H * 0.45, (mins / 60) * HOUR_H)
}

function nowTop() {
  const n = new Date()
  return ((n.getHours() - DAY_S) * 60 + n.getMinutes()) / 60 * HOUR_H
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AgendaSemanal() {
  const [anchor,  setAnchor]  = useState(new Date())
  const [events,  setEvents]  = useState<CalEvent[]>([])
  const [tareas,  setTareas]  = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const days = weekDays(anchor)

  useEffect(() => {
    Promise.all([
      fetch('/api/calendar/events').then(r => r.json()).then(d => d.events ?? []).catch(() => []),
      getTareas().catch(() => []),
    ]).then(([evs, ts]) => {
      setEvents(evs)
      setTareas(ts)
      setLoading(false)
    })
  }, [])

  // Scroll to current time (minus 1 h buffer) on first load
  useEffect(() => {
    if (!loading && scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, nowTop() - HOUR_H)
    }
  }, [loading])

  const ws = days[0], we = days[6]
  const weekLabel =
    ws.getMonth() === we.getMonth()
      ? `${format(ws, 'd')} – ${format(we, 'd')} de ${format(we, 'MMMM', { locale: es })}`
      : `${format(ws, 'd MMM', { locale: es })} – ${format(we, 'd MMM', { locale: es })}`

  // Does any day have all-day events or tasks?
  const hasAllDay = days.some(d => {
    const ae = eventsForDay(events, d).filter(e => e.allDay)
    return ae.length > 0 || tasksForDay(tareas, d).length > 0
  })

  const currentNowTop = nowTop()

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        border: '1px solid var(--border-light)',
        boxShadow: '0 2px 16px rgba(13,33,55,0.08)',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: 'linear-gradient(135deg, #081524 0%, #0d2137 100%)' }}
      >
        <div className="flex items-center gap-2.5">
          <CalendarDays size={16} style={{ color: '#c4a661' }} strokeWidth={1.5} />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white" style={{ letterSpacing: '0.1em' }}>
            Agenda semanal
          </h2>
          <span className="text-xs" style={{ color: 'rgba(168,213,226,0.55)' }}>{weekLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAnchor(new Date())}
            className="px-3 h-7 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(196,166,97,0.18)', color: '#c4a661', border: '1px solid rgba(196,166,97,0.35)' }}
          >
            Hoy
          </button>
          <button
            onClick={() => setAnchor(d => subWeeks(d, 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <ChevronLeft size={13} color="white" />
          </button>
          <button
            onClick={() => setAnchor(d => addWeeks(d, 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <ChevronRight size={13} color="white" />
          </button>
          <Link
            href="/calendario"
            className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(74,155,181,0.25)', color: '#a8d5e2', border: '1px solid rgba(74,155,181,0.35)' }}
          >
            <ExternalLink size={11} />
            Mes completo
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
        </div>
      ) : (
        <>
          {/* ── Day-header row ──────────────────────────────────────────────── */}
          <div
            className="grid border-b"
            style={{ gridTemplateColumns: '48px repeat(7, 1fr)', borderColor: '#e4edf5' }}
          >
            {/* Gutter */}
            <div style={{ background: '#f6f9fc' }} />
            {days.map(day => {
              const isTd = isToday(day)
              return (
                <div
                  key={format(day, 'yyyyMMdd')}
                  className="py-2.5 text-center border-l"
                  style={{ borderColor: '#e4edf5', background: isTd ? 'rgba(196,166,97,0.06)' : '#f6f9fc' }}
                >
                  <p
                    className="text-xs font-extrabold uppercase"
                    style={{ color: isTd ? '#c4a661' : '#9ab0c4', letterSpacing: '0.1em' }}
                  >
                    {DOW[day.getDay()]}
                  </p>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mt-0.5 text-base font-bold"
                    style={{
                      background: isTd ? '#c4a661' : 'transparent',
                      color:      isTd ? '#0d2137' : '#1a2e44',
                    }}
                  >
                    {format(day, 'd')}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── All-day / Tasks row ─────────────────────────────────────────── */}
          {hasAllDay && (
            <div
              className="grid border-b"
              style={{ gridTemplateColumns: '48px repeat(7, 1fr)', borderColor: '#e4edf5' }}
            >
              <div
                className="flex items-center justify-end pr-2 border-r"
                style={{ borderColor: '#e4edf5', background: '#f6f9fc' }}
              >
                <span style={{ fontSize: 9, color: '#b0c4d4', letterSpacing: '0.05em', fontWeight: 700 }}>
                  TODO DÍA
                </span>
              </div>
              {days.map(day => {
                const isTd    = isToday(day)
                const allDayE = eventsForDay(events, day).filter(e => e.allDay)
                const tks     = tasksForDay(tareas, day)
                return (
                  <div
                    key={format(day, 'yyyyMMdd')}
                    className="py-1 px-1.5 space-y-0.5 border-l"
                    style={{ borderColor: '#e4edf5', minHeight: 34, background: isTd ? 'rgba(196,166,97,0.03)' : '#fafcff' }}
                  >
                    {allDayE.slice(0, 2).map(ev => {
                      const c = eventColor(ev)
                      return (
                        <div
                          key={ev.id}
                          className="rounded px-1.5 py-0.5 text-xs truncate font-semibold"
                          style={{ background: `${c}20`, color: c, fontSize: 10 }}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      )
                    })}
                    {tks.slice(0, 2).map(t => {
                      const pc = PRIORIDAD_CONFIG[t.prioridad]
                      return (
                        <div
                          key={t.id}
                          className="rounded px-1.5 py-0.5 text-xs truncate flex items-center gap-1"
                          style={{ background: `${pc.color}10`, fontSize: 10 }}
                          title={t.titulo}
                        >
                          <span style={{ color: pc.color, fontWeight: 900, fontSize: 8 }}>●</span>
                          <span style={{ color: '#1a2e44', fontWeight: 600 }} className="truncate">
                            {t.titulo}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Time grid ───────────────────────────────────────────────────── */}
          <div ref={scrollRef} style={{ overflowY: 'auto', maxHeight: 420 }}>
            <div
              className="grid"
              style={{ gridTemplateColumns: '48px repeat(7, 1fr)', height: TOTAL_H }}
            >
              {/* Time labels column */}
              <div
                style={{
                  position: 'relative',
                  background: '#f6f9fc',
                  borderRight: '1px solid #e4edf5',
                }}
              >
                {HOURS.map(h => (
                  <div
                    key={h}
                    style={{
                      position: 'absolute',
                      top: (h - DAY_S) * HOUR_H - 7,
                      right: 6,
                      fontSize: 10,
                      color: '#a4b8c8',
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight: 500,
                    }}
                  >
                    {h < 10 ? `0${h}` : h}:00
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map(day => {
                const isTd     = isToday(day)
                const timedEvs = eventsForDay(events, day).filter(e => !e.allDay)
                const showNow  = isTd && currentNowTop >= 0 && currentNowTop <= TOTAL_H

                return (
                  <div
                    key={format(day, 'yyyyMMdd')}
                    style={{
                      position: 'relative',
                      borderLeft: '1px solid #e4edf5',
                      background: isTd ? 'rgba(196,166,97,0.02)' : undefined,
                    }}
                  >
                    {/* Hour grid lines */}
                    {HOURS.map(h => (
                      <div
                        key={h}
                        style={{
                          position: 'absolute',
                          top: (h - DAY_S) * HOUR_H,
                          left: 0, right: 0, height: 1,
                          background: h % 2 === 0 ? '#e4edf5' : '#eef3f8',
                        }}
                      />
                    ))}

                    {/* Current time line */}
                    {showNow && (
                      <div
                        style={{
                          position: 'absolute',
                          top: currentNowTop,
                          left: 0, right: 0,
                          zIndex: 10,
                          pointerEvents: 'none',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute', left: -5, top: -5,
                            width: 10, height: 10, borderRadius: '50%',
                            background: '#dc3545',
                          }}
                        />
                        <div style={{ height: 2, background: '#dc3545', marginLeft: 5 }} />
                      </div>
                    )}

                    {/* Timed events */}
                    {timedEvs.map(ev => {
                      const top    = evTop(ev.start)
                      const height = evH(ev.start, ev.end)
                      const c      = eventColor(ev)
                      const short  = height < HOUR_H * 0.6

                      return (
                        <div
                          key={ev.id}
                          title={`${format(new Date(ev.start), 'HH:mm')}–${format(new Date(ev.end), 'HH:mm')}  ${ev.title}`}
                          style={{
                            position: 'absolute',
                            top: top + 1,
                            height: height - 2,
                            left: 3, right: 3,
                            background: `${c}1a`,
                            borderLeft: `3px solid ${c}`,
                            borderRadius: 5,
                            padding: short ? '1px 4px' : '3px 5px',
                            overflow: 'hidden',
                            cursor: 'default',
                            zIndex: 5,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 10, fontWeight: 800,
                              color: c, lineHeight: 1.3,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {format(new Date(ev.start), 'HH:mm')}
                            {!short && (
                              <span style={{ fontWeight: 400, opacity: 0.7 }}>
                                {' '}–{' '}{format(new Date(ev.end), 'HH:mm')}
                              </span>
                            )}
                          </p>
                          {!short && (
                            <p
                              style={{
                                fontSize: 11, color: '#1a2e44', lineHeight: 1.35,
                                fontWeight: 500, overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              } as React.CSSProperties}
                            >
                              {ev.title}
                            </p>
                          )}
                          {short && (
                            <p
                              style={{
                                fontSize: 10, color: '#1a2e44', lineHeight: 1.2,
                                fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {ev.title}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
