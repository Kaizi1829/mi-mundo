'use client'
import { CheckCircle2, Clock, AlertTriangle, Flame } from 'lucide-react'
import type { Tarea } from '@/lib/tareas'
import { isVencida, isHoy } from '@/lib/tareas'

export default function TaskStats({ tareas }: { tareas: Tarea[] }) {
  const total      = tareas.length
  const pendientes = tareas.filter(t => t.estado !== 'completada').length
  const completadas = tareas.filter(t => t.estado === 'completada').length
  const vencidas   = tareas.filter(isVencida).length
  const paraHoy    = tareas.filter(t => isHoy(t) && t.estado !== 'completada').length
  const enProgreso = tareas.filter(t => t.estado === 'en_progreso').length

  const pct = total > 0 ? Math.round((completadas / total) * 100) : 0

  const stats = [
    { icon: Flame,         label: 'Para hoy',    value: paraHoy,   color: '#c4a661',  bg: 'rgba(196,166,97,0.10)'  },
    { icon: Clock,         label: 'En progreso', value: enProgreso, color: '#2c6e8a', bg: 'rgba(44,110,138,0.10)'  },
    { icon: AlertTriangle, label: 'Vencidas',    value: vencidas,  color: '#dc3545',  bg: 'rgba(220,53,69,0.08)'   },
    { icon: CheckCircle2,  label: 'Completadas', value: completadas,color: '#28a745', bg: 'rgba(40,167,69,0.08)'   },
  ]

  return (
    <div className="mb-5">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: '#fff', border: '1px solid var(--border-light)', boxShadow: '0 1px 4px rgba(13,33,55,0.06)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} style={{ color }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none" style={{ color: 'var(--text)' }}>{value}</p>
              <p className="text-xs mt-0.5 uppercase tracking-wide font-medium" style={{ color: 'var(--muted)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar global */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center gap-4"
        style={{ background: '#fff', border: '1px solid var(--border-light)' }}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Progreso general — {total} tareas totales
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{pct}% completado</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0d2137, #2c6e8a, #4a9bb5)' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-3xl font-bold font-serif" style={{ color: 'var(--text)' }}>{completadas}</span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>/{total}</span>
        </div>
      </div>
    </div>
  )
}
