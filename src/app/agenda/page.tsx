import Card from '@/components/ui/Card'
import { Calendar, Plus } from 'lucide-react'

export default function AgendaPage() {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7)
  const eventos = [
    { hora: 9, duracion: 1.5, titulo: 'Reunión equipo AXA', color: '#c9a96e', desc: 'Online' },
    { hora: 11.5, duracion: 1, titulo: 'Gestión de pólizas', color: '#7aa8c0', desc: 'AXA' },
    { hora: 14, duracion: 1, titulo: 'Comida', color: '#8fad88', desc: 'Tiempo personal' },
    { hora: 16, duracion: 1, titulo: 'Neting Marbella', color: '#c9a96e', desc: 'Reunión' },
    { hora: 18.5, duracion: 1, titulo: 'Entrenamiento', color: '#8fad88', desc: 'Gimnasio' },
    { hora: 20.5, duracion: 1, titulo: 'Cena con amigas', color: '#d4a5a5', desc: 'Personal' },
  ]
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Agenda</h1>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-smooth hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={15} /> Nuevo evento
        </button>
      </div>
      <Card>
        <div className="space-y-0">
          {hours.map(h => {
            const ev = eventos.find(e => Math.floor(e.hora) === h)
            return (
              <div key={h} className="flex items-start gap-4 border-b py-3" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs w-12 text-right pt-1" style={{ color: 'var(--muted)' }}>{h}:00</span>
                {ev ? (
                  <div
                    className="flex-1 rounded-xl px-3 py-2 text-sm"
                    style={{ background: `${ev.color}18`, borderLeft: `3px solid ${ev.color}` }}
                  >
                    <p className="font-medium" style={{ color: 'var(--text)' }}>{ev.titulo}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{ev.desc}</p>
                  </div>
                ) : (
                  <div className="flex-1 h-8" />
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
