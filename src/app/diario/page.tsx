import Card from '@/components/ui/Card'
import { BookMarked, Plus } from 'lucide-react'

const entradas = [
  { fecha: 'Miércoles, 20 mayo 2026', animo: '😊', contenido: 'Hoy ha sido un día muy productivo. Terminé la renovación de campañas AXA y tuve una reunión increíble en Marbella. Me siento con mucha energía y motivación.', etiquetas: ['productividad', 'trabajo', 'gratitud'] },
  { fecha: 'Martes, 19 mayo 2026',    animo: '🌿', contenido: 'Día tranquilo. Me tomé tiempo para mí, leí un capítulo de Atomic Habits y salí a caminar 10.000 pasos. El entrenamiento fue genial.', etiquetas: ['wellness', 'lectura', 'ejercicio'] },
  { fecha: 'Lunes, 18 mayo 2026',     animo: '🤔', contenido: 'Semana nueva, nueva energía. Tengo que centrarme en el plan de contenidos de junio. También quiero avanzar con el fondo de emergencia este mes.', etiquetas: ['reflexión', 'finanzas', 'objetivos'] },
]

export default function DiarioPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookMarked size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Diario</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={15} /> Nueva entrada
        </button>
      </div>

      <div className="space-y-4">
        {entradas.map((e, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{e.fecha}</p>
              </div>
              <span className="text-2xl">{e.animo}</span>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>{e.contenido}</p>
            <div className="flex flex-wrap gap-2">
              {e.etiquetas.map(et => (
                <span
                  key={et}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(201,169,110,0.12)', color: 'var(--accent-dark)' }}
                >
                  #{et}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
