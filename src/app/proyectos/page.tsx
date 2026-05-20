import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { FolderKanban, Plus } from 'lucide-react'

const proyectos = [
  { nombre: 'OPAEX', desc: 'Optimización de procesos AXA externos', progreso: 65, tareas: 12, completadas: 8, color: '#c9a96e' },
  { nombre: 'Mi Mundo App', desc: 'Panel personal de gestión de vida', progreso: 80, tareas: 20, completadas: 16, color: '#7aa8c0' },
  { nombre: 'Blog Personal', desc: 'Creación de contenido sobre finanzas y bienestar', progreso: 30, tareas: 10, completadas: 3, color: '#8fad88' },
  { nombre: 'Renovación AXA Q3', desc: 'Campaña de renovación de pólizas tercer trimestre', progreso: 50, tareas: 8, completadas: 4, color: '#d4a5a5' },
]

export default function ProyectosPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderKanban size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Proyectos</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={15} /> Nuevo proyecto
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {proyectos.map(p => (
          <Card key={p.nombre} hover>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{p.nombre}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{p.desc}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: p.color }}>{p.progreso}%</span>
            </div>
            <ProgressBar value={p.progreso} color={p.color} height={6} />
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {p.completadas}/{p.tareas} tareas completadas
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
