'use client'
import { Activity, Crosshair, Smile, Moon } from 'lucide-react'
import Card from '@/components/ui/Card'

interface DailyVitalsProps {
  energia?: string
  enfoque?: number
  estadoAnimo?: string
  suenoHoras?: number
  suenoMinutos?: number
}

const energyColor: Record<string, string> = { Alta: '#2c6e8a', Media: '#c4a661', Baja: '#8daec7' }

export default function DailyVitals({
  energia = 'Alta',
  enfoque = 8,
  estadoAnimo = 'Tranquila',
  suenoHoras = 7,
  suenoMinutos = 30,
}: DailyVitalsProps) {
  const vitals = [
    { icon: Activity,   label: 'Energía',        value: energia,                    color: energyColor[energia] || '#2c6e8a' },
    { icon: Crosshair,  label: 'Enfoque',         value: `${enfoque}/10`,            color: '#2c6e8a' },
    { icon: Smile,      label: 'Estado de ánimo', value: estadoAnimo,                color: '#4a9bb5' },
    { icon: Moon,       label: 'Sueño',           value: `${suenoHoras}h ${suenoMinutos}m`, color: '#1a3a5c' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {vitals.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="flex items-center gap-3 py-3 px-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}12`, border: `1px solid ${color}20` }}
          >
            <Icon size={16} style={{ color }} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>{label}</p>
            <p className="text-sm font-semibold truncate mt-0.5" style={{ color: 'var(--text)' }}>{value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
