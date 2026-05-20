'use client'
import Card from '@/components/ui/Card'
import { BookOpen, Plus, Search } from 'lucide-react'

const notas = [
  { titulo: 'Ideas campaña AXA Q3',        cat: 'Trabajo',    fecha: 'Hoy',       preview: 'Renovar enfoque digital, email marketing, LinkedIn...' },
  { titulo: 'Lista compras Bali',           cat: 'Viajes',     fecha: 'Ayer',      preview: 'Adaptador enchufes, protector solar, ropa ligera...' },
  { titulo: 'Recetas saludables semana',    cat: 'Wellness',   fecha: '18 may',    preview: 'Bowl de quinoa, ensalada mediterránea, pollo al limón...' },
  { titulo: 'Libros pendientes 2025',       cat: 'Personal',   fecha: '15 may',    preview: 'Atomic Habits, The 5AM Club, Ikigai, Sapiens...' },
  { titulo: 'Reflexión objetivos Q2',       cat: 'Crecimiento',fecha: '10 may',    preview: 'He avanzado en inglés pero necesito más constancia...' },
  { titulo: 'Proveedores nuevos OPAEX',     cat: 'Proyecto',   fecha: '5 may',     preview: 'Contactar con 3 proveedores alternativos esta semana...' },
]

const catColors: Record<string, string> = {
  Trabajo: '#c9a96e', Viajes: '#7aa8c0', Wellness: '#8fad88',
  Personal: '#d4a5a5', Crecimiento: '#b5a4d4', Proyecto: '#a0c4c0',
}

export default function NotasPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BookOpen size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Notas & Ideas</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={15} /> Nueva nota
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          placeholder="Buscar notas..."
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {notas.map(n => {
          const color = catColors[n.cat] || '#c9a96e'
          return (
            <Card key={n.titulo} hover className="cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${color}18`, color }}
                >
                  {n.cat}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{n.fecha}</span>
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{n.titulo}</h3>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>{n.preview}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
