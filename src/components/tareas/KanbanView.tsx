'use client'
import { Check, Calendar, RefreshCw } from 'lucide-react'
import type { Tarea } from '@/lib/tareas'
import { PRIORIDAD_CONFIG, ESTADO_CONFIG, alertColor, alertLabel } from '@/lib/tareas'

const COLUMNS = [
  { key: 'pendiente',   label: 'Pendiente',   accent: '#5a7490' },
  { key: 'en_progreso', label: 'En progreso', accent: '#2c6e8a' },
  { key: 'bloqueada',   label: 'Bloqueada',   accent: '#dc3545' },
  { key: 'completada',  label: 'Completada',  accent: '#28a745' },
] as const

interface Props {
  tareas: Tarea[]
  onComplete: (id: string, completada: boolean) => void
  onEdit: (t: Tarea) => void
}

function KanbanCard({ tarea, onComplete, onEdit }: { tarea: Tarea; onComplete: Props['onComplete']; onEdit: Props['onEdit'] }) {
  const p = PRIORIDAD_CONFIG[tarea.prioridad]
  const completada = tarea.estado === 'completada'

  return (
    <div
      className="rounded-xl p-3 cursor-pointer transition-smooth hover:shadow-md group"
      style={{ background: '#fff', border: '1px solid var(--border-light)', boxShadow: '0 1px 3px rgba(13,33,55,0.06)' }}
      onClick={() => onEdit(tarea)}
    >
      {/* Priority + recurrente */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{ background: p.bg, color: p.color }}
        >
          {p.label}
        </span>
        <div className="flex items-center gap-1.5">
          {tarea.recurrente && <RefreshCw size={10} style={{ color: 'var(--muted)' }} />}
          <button
            onClick={e => { e.stopPropagation(); onComplete(tarea.id, !completada) }}
            className="w-4 h-4 rounded-full border flex items-center justify-center transition-smooth"
            style={{
              background: completada ? 'var(--accent)' : 'transparent',
              borderColor: completada ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {completada && <Check size={8} color="white" strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Title */}
      <p
        className={`text-sm font-medium mb-2 ${completada ? 'line-through opacity-50' : ''}`}
        style={{ color: 'var(--text)' }}
      >
        {tarea.titulo}
      </p>

      {/* Area badge */}
      {tarea.area && (
        <div className="flex items-center gap-1 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: tarea.area.color }} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{tarea.area.nombre}</span>
        </div>
      )}

      {/* Due date */}
      {tarea.fecha_vencimiento && (
        <div className="flex items-center gap-1">
          <Calendar size={10} style={{ color: alertColor(tarea) }} />
          <span className="text-xs font-medium" style={{ color: alertColor(tarea) }}>
            {alertLabel(tarea)}
          </span>
        </div>
      )}

      {/* Subtareas */}
      {(tarea.subtareas?.length ?? 0) > 0 && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(tarea.subtareas!.filter(s => s.completada).length / tarea.subtareas!.length) * 100}%`,
                background: 'var(--accent)',
              }}
            />
          </div>
          <span className="text-xs tabular-nums" style={{ color: 'var(--muted)', fontSize: 10 }}>
            {tarea.subtareas!.filter(s => s.completada).length}/{tarea.subtareas!.length}
          </span>
        </div>
      )}
    </div>
  )
}

export default function KanbanView({ tareas, onComplete, onEdit }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 items-start">
      {COLUMNS.map(col => {
        const items = tareas.filter(t => t.estado === col.key)
        const e = ESTADO_CONFIG[col.key]
        return (
          <div key={col.key} className="flex flex-col gap-3">
            {/* Column header */}
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: e.bg, border: `1px solid ${col.accent}20` }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: col.accent }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: col.accent }}>
                  {col.label}
                </span>
              </div>
              <span
                className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: col.accent, color: '#fff' }}
              >
                {items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {items.length === 0 ? (
                <div
                  className="rounded-xl px-4 py-6 text-center text-xs"
                  style={{ border: '1px dashed var(--border)', color: 'var(--muted)' }}
                >
                  Sin tareas
                </div>
              ) : (
                items.map(t => (
                  <KanbanCard key={t.id} tarea={t} onComplete={onComplete} onEdit={onEdit} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
