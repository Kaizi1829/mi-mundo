'use client'
import { Plus, Check } from 'lucide-react'
import Card from '@/components/ui/Card'

interface Tarea {
  titulo: string
  categoria: string
  completada: boolean
}

const tareasDemo: Tarea[] = [
  { titulo: 'Preparar renovación campañas AXA', categoria: 'Trabajo',    completada: true  },
  { titulo: 'Seguimiento OPAEX',                categoria: 'Proyecto',   completada: true  },
  { titulo: 'Plan de contenidos junio',          categoria: 'Marketing',  completada: false },
]

export default function FocusDelDia({ tareas = tareasDemo }: { tareas?: Tarea[] }) {
  const pendientes = tareas.filter(t => !t.completada).length

  return (
    <Card className="flex flex-col h-full relative overflow-hidden">
      {/* Decorative leaf */}
      <div className="absolute right-2 top-8 opacity-8 pointer-events-none select-none text-6xl">
        🌿
      </div>

      <div className="flex items-center justify-between mb-4 relative">
        <h2 className="text-base font-semibold font-serif" style={{ color: 'var(--text)' }}>
          Focus del día
        </h2>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(201,169,110,0.15)', color: 'var(--accent-dark)' }}
        >
          {pendientes}
        </span>
      </div>

      <div className="flex-1 space-y-3 relative">
        {tareas.map((t, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-smooth ${
                t.completada ? 'border-transparent' : ''
              }`}
              style={{
                background: t.completada ? 'var(--accent)' : 'transparent',
                borderColor: t.completada ? 'var(--accent)' : 'var(--border)',
              }}
            >
              {t.completada && <Check size={11} color="white" strokeWidth={2.5} />}
            </div>
            <div>
              <p
                className={`text-sm font-medium ${t.completada ? 'line-through opacity-50' : ''}`}
                style={{ color: 'var(--text)' }}
              >
                {t.titulo}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{t.categoria}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="flex items-center gap-2 pt-3 border-t text-xs font-medium transition-smooth hover:opacity-70"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        <Plus size={14} />
        Añadir tarea
      </button>
    </Card>
  )
}
