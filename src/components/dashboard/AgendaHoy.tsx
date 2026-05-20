'use client'
import { ChevronRight, Clock } from 'lucide-react'
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
  { hora: '09:00', titulo: 'Reunión equipo AXA',   descripcion: 'Online',          color: '#2c6e8a' },
  { hora: '11:30', titulo: 'Gestión de pólizas',   descripcion: 'AXA',             color: '#4a9bb5' },
  { hora: '14:00', titulo: 'Comida',               descripcion: 'Tiempo personal', color: '#c4a661' },
  { hora: '16:00', titulo: 'Neting Marbella',      descripcion: 'Reunión',         color: '#1a3a5c' },
  { hora: '18:30', titulo: 'Entrenamiento',        descripcion: 'Gimnasio',        color: '#2c6e8a' },
  { hora: '20:30', titulo: 'Cena con amigas',     descripcion: 'Tiempo personal', color: '#c4a661' },
]

export default function AgendaHoy({ eventos = eventosDemo }: { eventos?: Evento[] }) {
  const hoy = format(new Date(), "EEEE, d 'de' MMMM", { locale: es })
  const hoyLabel = hoy.charAt(0).toUpperCase() + hoy.slice(1)

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-2">
          <Clock size={15} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
          <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text)', letterSpacing: '0.05em' }}>
            Agenda de hoy
          </h2>
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{hoyLabel}</span>
      </div>

      {/* Timeline */}
      <div className="flex-1 space-y-0 overflow-y-auto">
        {eventos.map((ev, i) => (
          <div key={i} className="flex items-stretch gap-3 group">
            {/* Time column */}
            <div className="flex flex-col items-end w-12 flex-shrink-0 pt-2">
              <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--muted)' }}>{ev.hora}</span>
            </div>
            {/* Line + dot */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ring-2 ring-white"
                style={{ background: ev.color }}
              />
              {i < eventos.length - 1 && (
                <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)' }} />
              )}
            </div>
            {/* Content */}
            <div
              className="flex-1 pb-3 pl-1 group-hover:opacity-90 transition-smooth"
            >
              <div
                className="rounded-lg px-3 py-2 mb-0.5"
                style={{
                  background: `${ev.color}0a`,
                  borderLeft: `2px solid ${ev.color}`,
                }}
              >
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{ev.titulo}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{ev.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/agenda"
        className="flex items-center justify-between pt-3 mt-1 border-t text-xs font-medium transition-smooth hover:opacity-70"
        style={{ borderColor: 'var(--border-light)', color: 'var(--accent)' }}
      >
        Ver calendario completo
        <ChevronRight size={14} />
      </Link>
    </Card>
  )
}
