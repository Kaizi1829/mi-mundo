'use client'
import { Activity, Focus, Smile, Moon } from 'lucide-react'
import Card from '@/components/ui/Card'

interface DailyVitalsProps {
  energia?: string
  enfoque?: number
  estadoAnimo?: string
  suenoHoras?: number
  suenoMinutos?: number
}

export default function DailyVitals({
  energia = 'Alta',
  enfoque = 8,
  estadoAnimo = 'Tranquila',
  suenoHoras = 7,
  suenoMinutos = 30,
}: DailyVitalsProps) {
  const vitals = [
    { icon: Activity, label: 'Energía', value: energia, sub: null },
    { icon: Focus,    label: 'Enfoque', value: `${enfoque}/10`, sub: null },
    { icon: Smile,    label: 'Estado de ánimo', value: estadoAnimo, sub: null },
    { icon: Moon,     label: 'Sueño', value: `${suenoHoras}h ${suenoMinutos}m`, sub: null },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {vitals.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="flex items-center gap-3 py-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(201,169,110,0.12)' }}
          >
            <Icon size={16} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{label}</p>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
