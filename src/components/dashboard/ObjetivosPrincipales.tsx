'use client'
import { ChevronRight, Briefcase, PiggyBank, Languages } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'

interface Objetivo {
  titulo: string
  meta: string
  progreso: number
  icono: React.ElementType
  color: string
}

const objetivosDemo: Objetivo[] = [
  { titulo: 'Viajar a Japón',       meta: '2025',           progreso: 60, icono: Briefcase,  color: '#c9a96e' },
  { titulo: 'Fondo de emergencia',  meta: 'Objetivo: 10.000€', progreso: 70, icono: PiggyBank,  color: '#8fad88' },
  { titulo: 'Mejorar inglés',       meta: 'Meta: Nivel avanzado', progreso: 40, icono: Languages, color: '#7aa8c0' },
]

export default function ObjetivosPrincipales({ objetivos = objetivosDemo }: { objetivos?: Objetivo[] }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold font-serif" style={{ color: 'var(--text)' }}>
          Objetivos principales
        </h2>
        <Link href="/objetivos" className="text-xs transition-smooth hover:opacity-70" style={{ color: 'var(--muted)' }}>
          Ver todos
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {objetivos.map(({ titulo, meta, progreso, icono: Icon, color }) => (
          <div key={titulo} className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}20` }}
            >
              <Icon size={15} style={{ color }} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{titulo}</p>
                <span className="text-xs font-semibold ml-2" style={{ color }}>{progreso}%</span>
              </div>
              <p className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>{meta}</p>
              <ProgressBar value={progreso} color={color} height={5} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
