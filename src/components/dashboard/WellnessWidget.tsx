'use client'
import { Footprints, Droplets, Brain, Moon, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'

interface WellnessProps {
  pasos?: number
  objetivo_pasos?: number
  hidratacion?: number
  objetivo_hidratacion?: number
  meditacion?: number
  ciclo_dia?: number
  ciclo_fase?: string
}

export default function WellnessWidget({
  pasos = 8432,
  objetivo_pasos = 10000,
  hidratacion = 1.8,
  objetivo_hidratacion = 2.5,
  meditacion = 10,
  ciclo_dia = 12,
  ciclo_fase = 'Fase folicular',
}: WellnessProps) {
  const items = [
    {
      icon: Footprints,
      label: 'Pasos hoy',
      value: pasos.toLocaleString('es-ES'),
      sub: `Objetivo: ${objetivo_pasos.toLocaleString('es-ES')}`,
      progress: Math.min(100, (pasos / objetivo_pasos) * 100),
      color: '#c9a96e',
    },
    {
      icon: Droplets,
      label: 'Hidratación',
      value: `${hidratacion} L`,
      sub: `Objetivo: ${objetivo_hidratacion} L`,
      progress: Math.min(100, (hidratacion / objetivo_hidratacion) * 100),
      color: '#7aa8c0',
    },
    {
      icon: Brain,
      label: 'Meditación',
      value: `${meditacion} min`,
      sub: 'Hoy',
      progress: Math.min(100, (meditacion / 20) * 100),
      color: '#8fad88',
    },
    {
      icon: Moon,
      label: 'Ciclo menstrual',
      value: `Día ${ciclo_dia}`,
      sub: ciclo_fase,
      progress: Math.min(100, (ciclo_dia / 28) * 100),
      color: '#d4a5a5',
    },
  ]

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold font-serif" style={{ color: 'var(--text)' }}>
          Wellness
        </h2>
        <Link href="/wellness" className="text-xs transition-smooth hover:opacity-70" style={{ color: 'var(--muted)' }}>
          Ver más
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label, value, sub, progress, color }) => (
          <div
            key={label}
            className="rounded-xl p-3"
            style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{sub}</p>
              </div>
              <Icon size={16} style={{ color }} strokeWidth={1.5} />
            </div>
            <div className="h-1 rounded-full" style={{ background: '#ede5d8' }}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
