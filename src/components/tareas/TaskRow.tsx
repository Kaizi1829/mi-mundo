'use client'
import { useState } from 'react'
import { Check, ChevronDown, ChevronRight, Calendar, MoreHorizontal, Trash2, Edit3, RefreshCw } from 'lucide-react'
import type { Tarea } from '@/lib/tareas'
import { PRIORIDAD_CONFIG, ESTADO_CONFIG, alertColor, alertLabel, isVencida, isHoy } from '@/lib/tareas'

interface Props {
  tarea: Tarea
  onComplete: (id: string, completada: boolean) => void
  onEdit: (t: Tarea) => void
  onDelete: (id: string) => void
  onToggleSubtarea: (id: string, completada: boolean) => void
}

export default function TaskRow({ tarea, onComplete, onEdit, onDelete, onToggleSubtarea }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const p = PRIORIDAD_CONFIG[tarea.prioridad]
  const e = ESTADO_CONFIG[tarea.estado]
  const completada = tarea.estado === 'completada'
  const tieneSubtareas = (tarea.subtareas?.length ?? 0) > 0
  const subtareasOk = tarea.subtareas?.filter(s => s.completada).length ?? 0
  const subtareasTot = tarea.subtareas?.length ?? 0
  const vencida = isVencida(tarea)
  const hoy = isHoy(tarea)

  return (
    <div
      className={`group rounded-xl border transition-smooth ${completada ? 'opacity-55' : ''} ${
        vencida && !completada ? 'border-red-200' : 'border-transparent'
      }`}
      style={{
        background: vencida && !completada ? 'rgba(220,53,69,0.03)' : hoy && !completada ? 'rgba(196,166,97,0.04)' : '#fff',
        border: `1px solid ${vencida && !completada ? 'rgba(220,53,69,0.20)' : 'var(--border-light)'}`,
      }}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">

        {/* Checkbox */}
        <button
          onClick={() => onComplete(tarea.id, !completada)}
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-smooth"
          style={{
            background: completada ? 'var(--accent)' : 'transparent',
            borderColor: completada ? 'var(--accent)' : p.color,
          }}
        >
          {completada && <Check size={10} color="white" strokeWidth={3} />}
        </button>

        {/* Priority dot */}
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} title={p.label} />

        {/* Title + tags */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${completada ? 'line-through' : ''}`}
            style={{ color: 'var(--text)' }}
          >
            {tarea.titulo}
          </p>
          {tarea.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tarea.etiquetas.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-px rounded"
                  style={{ background: 'rgba(44,110,138,0.08)', color: 'var(--accent)', fontSize: 10 }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subtareas progress */}
        {tieneSubtareas && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${subtareasTot > 0 ? (subtareasOk / subtareasTot) * 100 : 0}%`,
                  background: 'var(--accent)',
                }}
              />
            </div>
            <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>{subtareasOk}/{subtareasTot}</span>
          </div>
        )}

        {/* Estado badge */}
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 hidden md:inline-flex"
          style={{ background: e.bg, color: e.color }}
        >
          {e.label}
        </span>

        {/* Recurrente */}
        {tarea.recurrente && (
          <RefreshCw size={12} style={{ color: 'var(--muted)' }} strokeWidth={1.5} className="flex-shrink-0" />
        )}

        {/* Fecha vencimiento */}
        {tarea.fecha_vencimiento && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar size={12} style={{ color: alertColor(tarea) }} strokeWidth={1.5} />
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: alertColor(tarea) }}
            >
              {alertLabel(tarea)}
            </span>
          </div>
        )}

        {/* Expand subtareas */}
        {tieneSubtareas && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg transition-smooth hover:bg-gray-50 flex-shrink-0"
            style={{ color: 'var(--muted)' }}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

        {/* Actions menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg transition-smooth opacity-0 group-hover:opacity-100"
            style={{ color: 'var(--muted)' }}
          >
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-7 z-10 rounded-xl shadow-lg py-1 min-w-32"
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

      {/* Subtareas expandidas */}
      {expanded && tieneSubtareas && (
        <div className="px-4 pb-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <div className="mt-2 space-y-1.5">
            {tarea.subtareas?.sort((a, b) => a.orden - b.orden).map(s => (
              <div key={s.id} className="flex items-center gap-2 pl-8">
                <button
                  onClick={() => onToggleSubtarea(s.id, !s.completada)}
                  className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-smooth"
                  style={{
                    background: s.completada ? 'var(--accent)' : 'transparent',
                    borderColor: s.completada ? 'var(--accent)' : 'var(--border)',
                  }}
                >
                  {s.completada && <Check size={8} color="white" strokeWidth={3} />}
                </button>
                <span
                  className={`text-xs ${s.completada ? 'line-through opacity-50' : ''}`}
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
