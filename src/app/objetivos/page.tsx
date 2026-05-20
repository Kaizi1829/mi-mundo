import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { Target, Plus, Plane, PiggyBank, Languages, Dumbbell, BookOpen } from 'lucide-react'

const objetivos = [
  { titulo: 'Viajar a Japón',           meta: '2025',                  progreso: 60, icono: Plane,      color: '#c9a96e', desc: 'Ahorrar 3.000€ para el viaje de mis sueños' },
  { titulo: 'Fondo de emergencia',      meta: 'Objetivo: 10.000€',     progreso: 70, icono: PiggyBank,  color: '#8fad88', desc: 'Construir un colchón financiero sólido' },
  { titulo: 'Mejorar inglés',           meta: 'Nivel avanzado C1',     progreso: 40, icono: Languages,  color: '#7aa8c0', desc: 'Clases semanales + práctica diaria' },
  { titulo: 'Correr 10K',               meta: 'Diciembre 2025',        progreso: 55, icono: Dumbbell,   color: '#d4a5a5', desc: 'Entrenar 3 veces por semana' },
  { titulo: 'Leer 24 libros',           meta: '24 libros / año',       progreso: 50, icono: BookOpen,   color: '#b5a4d4', desc: 'Un libro cada dos semanas' },
]

export default function ObjetivosPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Objetivos</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={15} /> Nuevo objetivo
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {objetivos.map(({ titulo, meta, progreso, icono: Icon, color, desc }) => (
          <Card key={titulo} hover>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{titulo}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{meta}</p>
              </div>
              <span className="text-sm font-bold" style={{ color }}>{progreso}%</span>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>{desc}</p>
            <ProgressBar value={progreso} color={color} height={6} />
          </Card>
        ))}
      </div>
    </div>
  )
}
