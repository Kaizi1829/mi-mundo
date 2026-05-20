'use client'
import { Plus, Check, Crosshair } from 'lucide-react'
import Card from '@/components/ui/Card'

interface Tarea {
  titulo: string
  categoria: string
  completada: boolean
}

const tareasDemo: Tarea[] = [
  { titulo: 'Preparar renovación campañas AXA', categoria: 'Trabajo',   completada: true  },
  { titulo: 'Seguimiento OPAEX',               categoria: 'Proyecto',  completada: true  },
  { titulo: 'Plan de contenidos junio',         categoria: 'Marketing', completada: false },
]

const catColors: Record<string, string> = {
  Trabajo: '#2c6e8a', Proyecto: '#1a3a5c', Marketing: '#4a9bb5', Personal: '#c4a661',
}

export default function FocusDelDia({ tareas = tareasDemo }: { tareas?: Tarea[] }) {
  const pendientes = tareas.filter(t => !t.completada).length
  const completadas = tareas.filter(t => t.completada).length
  const pct = Math.round((completadas / tareas.length) * 100)

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-2">
          <Crosshair size={15} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
          <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text)', letterSpacing: '0.05em' }}>
            Focus del día
          </h2>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(44,110,138,0.10)', color: 'var(--accent)' }}
        >
          {pendientes} pendientes
        </span>
      </div>

      {/* Progress bar global */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Progreso del día</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1a3a5c, #2c6e8a, #4a9bb5)' }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 space-y-3">
        {tareas.map((t, i) => {
          const cat = catColors[t.categoria] || '#2c6e8a'
          return (
            <div key={i} className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-smooth`}
                style={{
                  background: t.completada ? 'var(--accent)' : 'transparent',
                  borderColor: t.completada ? 'var(--accent)' : 'var(--border)',
                }}
              >
                {t.completada && <Check size={10} color="white" strokeWidth={3} />}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${t.completada ? 'line-through opacity-40' : 'font-medium'}`}
                  style={{ color: 'var(--text)' }}
                >
                  {t.titulo}
                </p>
                <span
                  className="text-xs mt-0.5 inline-block px-1.5 py-px rounded"
                  style={{ background: `${cat}12`, color: cat }}
                >
                  {t.categoria}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        className="flex items-center gap-2 pt-3 mt-1 border-t text-xs font-medium transition-smooth hover:opacity-70"
        style={{ borderColor: 'var(--border-light)', color: 'var(--accent)' }}
      >
        <Plus size={13} />
        Añadir tarea
      </button>
    </Card>
  )
}
