'use client'
import Card from '@/components/ui/Card'
import { Heart, Footprints, Droplets, Brain, Moon, Plus } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

const radarData = [
  { area: 'Sueño',      valor: 75 },
  { area: 'Ejercicio',  valor: 84 },
  { area: 'Nutrición',  valor: 70 },
  { area: 'Hidratación',valor: 72 },
  { area: 'Meditación', valor: 50 },
  { area: 'Bienestar',  valor: 88 },
]

const semana = ['L','M','X','J','V','S','D']
const pasosSemanales = [7200, 9100, 8432, 10234, 6800, 11000, 5400]

export default function WellnessPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Wellness</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={15} /> Registrar hoy
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { icon: Footprints, label: 'Pasos hoy',     value: '8.432', sub: '/10.000', color: '#c9a96e' },
          { icon: Droplets,   label: 'Hidratación',   value: '1,8 L', sub: '/2,5 L',  color: '#7aa8c0' },
          { icon: Brain,      label: 'Meditación',    value: '10 min',sub: 'hoy',     color: '#8fad88' },
          { icon: Moon,       label: 'Sueño',         value: '7h 30m',sub: 'anoche',  color: '#d4a5a5' },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <Card key={label} className="text-center py-4">
            <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} strokeWidth={1.5} />
            </div>
            <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{value}</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{label} <span style={{ color }}>{sub}</span></p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Radar de bienestar</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ede5d8" />
              <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: '#8c7b6b' }} />
              <Radar dataKey="valor" stroke="#c9a96e" fill="#c9a96e" fillOpacity={0.3} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #ede5d8', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Pasos esta semana</h2>
          <div className="flex items-end gap-2 h-40">
            {pasosSemanales.map((p, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg transition-smooth"
                  style={{
                    height: `${(p / 12000) * 100}%`,
                    background: p >= 10000 ? '#8fad88' : '#c9a96e',
                    minHeight: 8,
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{semana[i]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
