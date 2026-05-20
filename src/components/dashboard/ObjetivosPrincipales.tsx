'use client'
import { ChevronRight, Briefcase, PiggyBank, Languages, Target } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'

interface Objetivo { titulo: string; meta: string; progreso: number; icono: React.ElementType; color: string }

const objetivosDemo: Objetivo[] = [
  { titulo: 'Viajar a Japón',       meta: '2025',              progreso: 60, icono: Briefcase, color: '#2c6e8a' },
  { titulo: 'Fondo de emergencia',  meta: 'Obj: 10.000 €',    progreso: 70, icono: PiggyBank, color: '#c4a661' },
  { titulo: 'Mejorar inglés',       meta: 'Nivel avanzado',   progreso: 40, icono: Languages, color: '#4a9bb5' },
]

export default function ObjetivosPrincipales({ objetivos = objetivosDemo }: { objetivos?: Objetivo[] }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-2">
          <Target size={15} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
          <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text)', letterSpacing: '0.05em' }}>
            Objetivos principales
          </h2>
        </div>
        <Link href="/objetivos" className="text-xs transition-smooth hover:opacity-70" style={{ color: 'var(--accent)' }}>
          Ver todos
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {objetivos.map(({ titulo, meta, progreso, icono: Icon, color }) => (
          <div key={titulo} className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}12`, border: `1px solid ${color}20` }}
            >
              <Icon size={15} style={{ color }} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{titulo}</p>
                <span className="text-xs font-bold ml-2 tabular-nums" style={{ color }}>{progreso}%</span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{meta}</p>
              <ProgressBar value={progreso} color={color} height={5} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
