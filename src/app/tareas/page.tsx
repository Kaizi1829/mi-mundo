'use client'
import { useState } from 'react'
import Card from '@/components/ui/Card'
import { CheckSquare, Plus, Check } from 'lucide-react'

const tareasIniciales = [
  { id: 1, titulo: 'Preparar renovación campañas AXA', cat: 'Trabajo',    completada: true,  prioridad: 1 },
  { id: 2, titulo: 'Seguimiento OPAEX',                cat: 'Proyecto',   completada: true,  prioridad: 1 },
  { id: 3, titulo: 'Plan de contenidos junio',          cat: 'Marketing',  completada: false, prioridad: 2 },
  { id: 4, titulo: 'Revisar pólizas pendientes',        cat: 'Trabajo',    completada: false, prioridad: 1 },
  { id: 5, titulo: 'Llamar a mamá',                     cat: 'Personal',   completada: false, prioridad: 3 },
  { id: 6, titulo: 'Comprar vuelos Bali',               cat: 'Viajes',     completada: false, prioridad: 2 },
]

const catColors: Record<string, string> = {
  Trabajo: '#c9a96e', Proyecto: '#7aa8c0', Marketing: '#8fad88',
  Personal: '#d4a5a5', Viajes: '#b5a4d4',
}

export default function TareasPage() {
  const [tareas, setTareas] = useState(tareasIniciales)
  const toggle = (id: number) =>
    setTareas(t => t.map(x => x.id === id ? { ...x, completada: !x.completada } : x))
  const pendientes = tareas.filter(t => !t.completada)
  const completadas = tareas.filter(t => t.completada)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckSquare size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Tareas</h1>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={15} /> Nueva tarea
        </button>
      </div>

      <Card className="mb-4">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
          Pendientes ({pendientes.length})
        </h2>
        <div className="space-y-3">
          {pendientes.map(t => (
            <div key={t.id} className="flex items-center gap-3">
              <button
                onClick={() => toggle(t.id)}
                className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-smooth"
                style={{ borderColor: 'var(--border)' }}
              />
              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--text)' }}>{t.titulo}</p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: `${catColors[t.cat] || '#c9a96e'}18`, color: catColors[t.cat] || '#c9a96e' }}
              >
                {t.cat}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold mb-3 opacity-60" style={{ color: 'var(--text)' }}>
          Completadas ({completadas.length})
        </h2>
        <div className="space-y-3">
          {completadas.map(t => (
            <div key={t.id} className="flex items-center gap-3 opacity-50">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              >
                <Check size={11} color="white" strokeWidth={2.5} />
              </div>
              <p className="text-sm line-through" style={{ color: 'var(--text)' }}>{t.titulo}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
