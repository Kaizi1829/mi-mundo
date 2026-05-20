import Card from '@/components/ui/Card'
import { Library, Plus, ExternalLink } from 'lucide-react'

const recursos = [
  { titulo: 'Atomic Habits', tipo: 'Libro', cat: 'Productividad', url: '#', desc: 'James Clear — Hábitos compuestos para el cambio.' },
  { titulo: 'Notion (plantillas)', tipo: 'Herramienta', cat: 'Organización', url: '#', desc: 'Plantillas personales para gestión de vida.' },
  { titulo: 'Podcast Diario de una CEO', tipo: 'Podcast', cat: 'Crecimiento', url: '#', desc: 'Episodios sobre liderazgo y emprendimiento.' },
  { titulo: 'Curso Inversión para principiantes', tipo: 'Curso', cat: 'Finanzas', url: '#', desc: 'Bases de inversión y fondos indexados.' },
  { titulo: 'App Headspace', tipo: 'App', cat: 'Wellness', url: '#', desc: 'Meditación guiada y mindfulness diario.' },
  { titulo: 'The 5AM Club', tipo: 'Libro', cat: 'Productividad', url: '#', desc: 'Robin Sharma — La rutina de la mañana perfecta.' },
]

const tipoColors: Record<string, string> = {
  Libro: '#c9a96e', Herramienta: '#7aa8c0', Podcast: '#8fad88',
  Curso: '#d4a5a5', App: '#b5a4d4',
}

export default function RecursosPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Library size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Recursos</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={15} /> Añadir recurso
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {recursos.map(r => {
          const color = tipoColors[r.tipo] || '#c9a96e'
          return (
            <Card key={r.titulo} hover>
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>
                  {r.tipo}
                </span>
                <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{r.titulo}</h3>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{r.desc}</p>
              <span className="inline-block mt-2 text-xs" style={{ color: 'var(--muted)' }}>{r.cat}</span>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
