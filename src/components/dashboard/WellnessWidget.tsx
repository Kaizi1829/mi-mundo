'use client'
import { Footprints, Droplets, Brain, Moon, ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'

interface WellnessProps {
  pasos?: number; objetivo_pasos?: number
  hidratacion?: number; objetivo_hidratacion?: number
  meditacion?: number; ciclo_dia?: number; ciclo_fase?: string
}

export default function WellnessWidget({
  pasos = 8432, objetivo_pasos = 10000,
  hidratacion = 1.8, objetivo_hidratacion = 2.5,
  meditacion = 10, ciclo_dia = 12, ciclo_fase = 'Fase folicular',
}: WellnessProps) {
  const items = [
    { icon: Footprints, label: 'Pasos hoy',      value: pasos.toLocaleString('es-ES'), sub: `/${objetivo_pasos.toLocaleString()}`, pct: Math.min(100,(pasos/objetivo_pasos)*100), color: '#2c6e8a' },
    { icon: Droplets,   label: 'Hidratación',    value: `${hidratacion} L`,            sub: `/${objetivo_hidratacion} L`,          pct: Math.min(100,(hidratacion/objetivo_hidratacion)*100), color: '#4a9bb5' },
    { icon: Brain,      label: 'Meditación',     value: `${meditacion} min`,           sub: 'hoy',                                 pct: Math.min(100,(meditacion/20)*100), color: '#1a3a5c' },
    { icon: Moon,       label: 'Ciclo menstrual',value: `Día ${ciclo_dia}`,            sub: ciclo_fase,                            pct: Math.min(100,(ciclo_dia/28)*100), color: '#c4a661' },
  ]

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-2">
          <Heart size={15} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
          <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text)', letterSpacing: '0.05em' }}>
            Wellness
          </h2>
        </div>
        <Link href="/wellness" className="text-xs transition-smooth hover:opacity-70" style={{ color: 'var(--accent)' }}>
          Ver más <ChevronRight size={12} className="inline" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label, value, sub, pct, color }) => (
          <div
            key={label}
            className="rounded-xl p-3"
            style={{
              background: `${color}08`,
              border: `1px solid ${color}18`,
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</p>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{sub}</p>
              </div>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon size={14} style={{ color }} strokeWidth={1.5} />
              </div>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
