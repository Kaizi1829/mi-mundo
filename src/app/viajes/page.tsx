import Card from '@/components/ui/Card'
import { Plane, Plus, MapPin, Calendar } from 'lucide-react'

const viajes = [
  {
    destino: 'Bali, Indonesia',
    fechas: '12 – 28 Sep 2025',
    estado: 'próximo',
    img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',
    notas: 'Vuelos reservados. Falta hotel y actividades.',
  },
  {
    destino: 'París, Francia',
    fechas: '3 – 7 Feb 2025',
    estado: 'pasado',
    img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    notas: 'Viaje romántico. Torre Eiffel, Louvre, gastronomía.',
  },
  {
    destino: 'Lisboa, Portugal',
    fechas: '10 – 14 Nov 2024',
    estado: 'pasado',
    img: 'https://images.unsplash.com/photo-1513735492246-483525079686?w=600&q=80',
    notas: 'Alfama, pastéis de nata, fado.',
  },
]

const estadoStyle: Record<string, { label: string; color: string }> = {
  próximo: { label: 'Próximo',  color: '#c9a96e' },
  pasado:  { label: 'Pasado',   color: '#8c7b6b' },
}

export default function ViajesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Plane size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Viajes</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={15} /> Añadir viaje
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {viajes.map(v => {
          const st = estadoStyle[v.estado]
          return (
            <Card key={v.destino} hover className="p-0 overflow-hidden">
              <div className="relative h-44">
                <img src={v.img} alt={v.destino} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }} />
                <span
                  className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: st.color, color: '#fff' }}
                >
                  {st.label}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin size={13} style={{ color: 'var(--accent)' }} />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{v.destino}</h3>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Calendar size={12} style={{ color: 'var(--muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{v.fechas}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{v.notas}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
