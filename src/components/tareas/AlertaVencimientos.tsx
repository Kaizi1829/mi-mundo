'use client'
import { useState } from 'react'
import { AlertTriangle, X, Clock, Calendar } from 'lucide-react'
import type { Tarea } from '@/lib/tareas'
import { isVencida, isHoy, isProxima } from '@/lib/tareas'

interface Props { tareas: Tarea[] }

export default function AlertaVencimientos({ tareas }: Props) {
  const [dismissed, setDismissed] = useState(false)

  const vencidas  = tareas.filter(t => isVencida(t))
  const hoy       = tareas.filter(t => isHoy(t) && !isVencida(t))
  const proximas  = tareas.filter(t => isProxima(t, 3) && !isHoy(t) && !isVencida(t))

  const total = vencidas.length + hoy.length + proximas.length
  if (total === 0 || dismissed) return null

  const tieneVencidas = vencidas.length > 0

  return (
    <div
      className="rounded-2xl mb-5 overflow-hidden"
      style={{
        border: `1px solid ${tieneVencidas ? 'rgba(220,53,69,0.30)' : 'rgba(196,166,97,0.35)'}`,
        background: tieneVencidas ? 'rgba(220,53,69,0.04)' : 'rgba(196,166,97,0.04)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: tieneVencidas
            ? 'linear-gradient(135deg, rgba(220,53,69,0.12), rgba(220,53,69,0.06))'
            : 'linear-gradient(135deg, rgba(196,166,97,0.12), rgba(196,166,97,0.06))',
          borderBottom: `1px solid ${tieneVencidas ? 'rgba(220,53,69,0.15)' : 'rgba(196,166,97,0.18)'}`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle
            size={15}
            style={{ color: tieneVencidas ? '#dc3545' : '#c4a661' }}
            strokeWidth={2}
          />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: tieneVencidas ? '#dc3545' : '#c4a661', letterSpacing: '0.08em' }}
          >
            {tieneVencidas
              ? `${vencidas.length} tarea${vencidas.length !== 1 ? 's' : ''} vencida${vencidas.length !== 1 ? 's' : ''}`
              : `${hoy.length + proximas.length} tarea${hoy.length + proximas.length !== 1 ? 's' : ''} urgente${hoy.length + proximas.length !== 1 ? 's' : ''}`
            }
          </span>
          {hoy.length > 0 && tieneVencidas && (
            <span className="text-xs" style={{ color: 'rgba(220,53,69,0.6)' }}>
              · {hoy.length} para hoy
            </span>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg transition-smooth hover:opacity-60"
          style={{ color: tieneVencidas ? '#dc3545' : '#c4a661' }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Task list */}
      <div className="px-4 py-2.5 space-y-1.5">
        {vencidas.slice(0, 5).map(t => (
          <AlertRow key={t.id} tarea={t} tipo="vencida" />
        ))}
        {hoy.slice(0, 3).map(t => (
          <AlertRow key={t.id} tarea={t} tipo="hoy" />
        ))}
        {proximas.slice(0, 3).map(t => (
          <AlertRow key={t.id} tarea={t} tipo="proxima" />
        ))}
        {total > 8 && (
          <p className="text-xs pt-1" style={{ color: 'var(--muted)' }}>
            + {total - 8} más…
          </p>
        )}
      </div>
    </div>
  )
}

function AlertRow({ tarea, tipo }: { tarea: Tarea; tipo: 'vencida' | 'hoy' | 'proxima' }) {
  const cfg = {
    vencida: { color: '#dc3545', Icon: AlertTriangle, label: `Vencida hace ${Math.round((Date.now() - new Date(tarea.fecha_vencimiento!).getTime()) / 86400000)}d` },
    hoy:     { color: '#c4a661', Icon: Calendar,       label: 'Hoy'     },
    proxima: { color: '#e07b39', Icon: Clock,          label: `en ${Math.round((new Date(tarea.fecha_vencimiento!).getTime() - Date.now()) / 86400000)}d` },
  }[tipo]

  return (
    <div className="flex items-center gap-2.5 py-0.5">
      <cfg.Icon size={11} style={{ color: cfg.color, flexShrink: 0 }} strokeWidth={2} />
      <span className="text-xs flex-1 truncate" style={{ color: 'var(--text)' }}>
        {tarea.titulo}
      </span>
      {tarea.area && (
        <span className="text-xs flex-shrink-0" style={{ color: tarea.area.color ?? 'var(--muted)' }}>
          {tarea.area.nombre}
        </span>
      )}
      <span
        className="text-xs flex-shrink-0 font-semibold px-1.5 py-0.5 rounded"
        style={{ background: `${cfg.color}15`, color: cfg.color, fontSize: 10 }}
      >
        {cfg.label}
      </span>
    </div>
  )
}
