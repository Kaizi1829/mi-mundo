'use client'
import { useState } from 'react'
import {
  Check, ChevronDown, ChevronRight, Calendar,
  MoreHorizontal, Trash2, Edit3, RefreshCw, Tag,
} from 'lucide-react'
import type { Tarea } from '@/lib/tareas'
import { PRIORIDAD_CONFIG, ESTADO_CONFIG, alertColor, alertLabel, isVencida, isHoy } from '@/lib/tareas'

interface Props {
  tarea: Tarea
  onComplete: (id: string, completada: boolean) => void
  onEdit: (t: Tarea) => void
  onDelete: (id: string) => void
  onToggleSubtarea: (id: string, completada: boolean) => void
}

// ─── Tag color palette (consistent per tag name via hash) ─────────────────────
const TAG_PALETTE = [
  '#4a9bb5', '#9c5de8', '#e07b39', '#22c55e',
  '#c4a661', '#f06292', '#2c6e8a', '#dc3545',
  '#1a7a5e', '#5a7490',
]
function tagColor(tag: string): string {
  let h = 0
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) & 0xffff
  return TAG_PALETTE[h % TAG_PALETTE.length]
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TaskRow({ tarea, onComplete, onEdit, onDelete, onToggleSubtarea }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const p          = PRIORIDAD_CONFIG[tarea.prioridad]
  const e          = ESTADO_CONFIG[tarea.estado]
  const completada = tarea.estado === 'completada'
  const tieneSubt  = (tarea.subtareas?.length ?? 0) > 0
  const subtOk     = tarea.subtareas?.filter(s => s.completada).length ?? 0
  const subtTot    = tarea.subtareas?.length ?? 0
  const vencida    = isVencida(tarea)
  const hoy        = isHoy(tarea)
  const areaColor  = tarea.area?.color ?? 'var(--border)'
  const hasTags    = tarea.etiquetas.length > 0

  return (
    <div
      className={`group rounded-xl transition-all ${completada ? 'opacity-50' : ''}`}
      style={{
        background:  vencida && !completada ? 'rgba(220,53,69,0.02)' : hoy && !completada ? 'rgba(196,166,97,0.03)' : '#fff',
        border:      `1px solid ${vencida && !completada ? 'rgba(220,53,69,0.18)' : hoy && !completada ? 'rgba(196,166,97,0.25)' : 'var(--border-light)'}`,
        borderLeft:  `3px solid ${completada ? 'var(--border)' : areaColor}`,
        boxShadow:   '0 1px 3px rgba(13,33,55,0.04)',
      }}
    >
      {/* ── Main row ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-4 py-3">

        {/* Checkbox */}
        <button
          onClick={() => onComplete(tarea.id, !completada)}
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5"
          style={{
            background:   completada ? p.color : 'transparent',
            borderColor:  completada ? p.color : p.color + '80',
          }}
        >
          {completada && <Check size={9} color="white" strokeWidth={3} />}
        </button>

        {/* Content block */}
        <div className="flex-1 min-w-0">

          {/* Title row */}
          <div className="flex items-start gap-2">
            <p
              className={`text-sm font-semibold flex-1 min-w-0 ${completada ? 'line-through' : ''}`}
              style={{ color: completada ? 'var(--muted)' : 'var(--text)', lineHeight: 1.4 }}
            >
              {tarea.titulo}
            </p>

            {/* Priority badge */}
            <span
              className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-bold mt-0.5"
              style={{ background: p.bg, color: p.color, fontSize: 10, letterSpacing: '0.04em' }}
            >
              {p.dot} {p.label}
            </span>
          </div>

          {/* Tags row */}
          {hasTags && (
            <div className="flex flex-wrap items-center gap-1 mt-1.5">
              <Tag size={10} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              {tarea.etiquetas.map(tag => {
                const c = tagColor(tag)
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: `${c}18`,
                      color: c,
                      border: `1px solid ${c}35`,
                      fontSize: 11,
                    }}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          )}

          {/* Meta row: estado + fecha + subtareas */}
          <div className="flex items-center flex-wrap gap-2 mt-1.5">
            {/* Estado */}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: e.bg, color: e.color, fontSize: 10 }}
            >
              {e.label}
            </span>

            {/* Fecha vencimiento */}
            {tarea.fecha_vencimiento && (
              <div className="flex items-center gap-1">
                <Calendar size={11} style={{ color: alertColor(tarea) }} strokeWidth={2} />
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: alertColor(tarea) }}
                >
                  {alertLabel(tarea)}
                </span>
              </div>
            )}

            {/* Recurrente */}
            {tarea.recurrente && (
              <div className="flex items-center gap-1">
                <RefreshCw size={10} style={{ color: 'var(--muted)' }} strokeWidth={2} />
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {tarea.recurrencia}
                </span>
              </div>
            )}

            {/* Subtareas progress */}
            {tieneSubt && (
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${subtTot > 0 ? (subtOk / subtTot) * 100 : 0}%`,
                      background: subtOk === subtTot ? '#22c55e' : 'var(--accent)',
                    }}
                  />
                </div>
                <span className="text-xs tabular-nums" style={{ color: 'var(--muted)', fontSize: 10 }}>
                  {subtOk}/{subtTot}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          {tieneSubt && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-lg transition-smooth hover:bg-gray-50"
              style={{ color: 'var(--muted)' }}
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg transition-smooth opacity-0 group-hover:opacity-100"
              style={{ color: 'var(--muted)' }}
            >
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-20 rounded-xl shadow-lg py-1 min-w-[120px]"
                style={{ background: '#fff', border: '1px solid var(--border-light)' }}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-smooth hover:bg-gray-50"
                  style={{ color: 'var(--text)' }}
                  onClick={() => { onEdit(tarea); setMenuOpen(false) }}
                >
                  <Edit3 size={12} /> Editar
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-smooth hover:bg-red-50"
                  style={{ color: '#dc3545' }}
                  onClick={() => { onDelete(tarea.id); setMenuOpen(false) }}
                >
                  <Trash2 size={12} /> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Subtareas expandidas ───────────────────────────────────────────── */}
      {expanded && tieneSubt && (
        <div className="px-4 pb-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <div className="mt-2.5 space-y-1.5">
            {tarea.subtareas?.sort((a, b) => a.orden - b.orden).map(s => (
              <div key={s.id} className="flex items-center gap-2.5 pl-8">
                <button
                  onClick={() => onToggleSubtarea(s.id, !s.completada)}
                  className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-smooth"
                  style={{
                    background:  s.completada ? 'var(--accent)' : 'transparent',
                    borderColor: s.completada ? 'var(--accent)' : 'var(--border)',
                  }}
                >
                  {s.completada && <Check size={8} color="white" strokeWidth={3} />}
                </button>
                <span
                  className={`text-xs ${s.completada ? 'line-through opacity-40' : ''}`}
                  style={{ color: 'var(--text)' }}
                >
                  {s.titulo}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
