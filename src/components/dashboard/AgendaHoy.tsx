'use client'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Evento {
  hora: string
  titulo: string
  descripcion: string
  color: string
}

const eventosDemo: Evento[] = [
  { hora: '09:00', titulo: 'Reunión equipo AXA',   descripcion: 'Online',          color: '#c9a96e' },
  { hora: '11:30', titulo: 'Gestión de pólizas',   descripcion: 'AXA',             color: '#7aa8c0' },
  { hora: '14:00', titulo: 'Comida',                descripcion: 'Tiempo personal', color: '#8fad88' },
  { hora: '16:00', titulo: 'Neting Marbella',       descripcion: 'Reunión',         color: '#c9a96e' },
  { hora: '18:30', titulo: 'Entrenamiento',         descripcion: 'Gimnasio',        color: '#8fad88' },
  { hora: '20:30', titulo: 'Cena con amigas',      descripcion: 'Tiempo personal', color: '#d4a5a5' },
]

export default function AgendaHoy({ eventos = eventosDemo }: { eventos?: Evento[] }) {
  const hoy = format(new Date(), "EEEE, d 'de' MMMM", { locale: es })
  const hoyLabel = hoy.charAt(0).toUpperCase() + hoy.slice(1)

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold font-serif" style={{ color: 'var(--text)' }}>
          Agenda de hoy
        </h2>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{hoyLabel}</span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {eventos.map((ev, i) => (
          <div key={i} className="flex items-start gap-3 group">
            {/* Timeline */}
            <div className="flex flex-col items-center flex-shrink-0 w-10">
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{ev.hora}</span>
              <div className="w-px flex-1 mt-1 min-h-4" style={{ background: 'var(--border)' }} />
            </div>
            {/* Dot + Content */}
            <div className="flex items-start gap-2 pb-3 flex-1">
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: ev.color }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{ev.titulo}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{ev.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/agenda"
        className="flex items-center justify-between pt-3 border-t text-xs font-medium transition-smooth hover:opacity-70"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        Ver calendario completo
        <ChevronRight size={14} />
      </Link>
    </Card>
  )
}
