'use client'
import { TrendingUp, TrendingDown, ArrowUpRight, MoreVertical, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const chartData = [
  { dia: '1',  ingresos: 1200, gastos: 800  },
  { dia: '5',  ingresos: 2100, gastos: 1100 },
  { dia: '10', ingresos: 2800, gastos: 1500 },
  { dia: '15', ingresos: 3500, gastos: 1900 },
  { dia: '20', ingresos: 4200, gastos: 2300 },
  { dia: '25', ingresos: 5000, gastos: 2700 },
  { dia: '30', ingresos: 5850, gastos: 2950 },
]

export default function ResumenFinanciero({
  ingresos = 5850,
  gastos = 2950,
  ahorros = 2900,
}: { ingresos?: number; gastos?: number; ahorros?: number }) {
  const mesActual = format(new Date(), 'MMMM yyyy', { locale: es })
  const mesLabel = mesActual.charAt(0).toUpperCase() + mesActual.slice(1)

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold font-serif" style={{ color: 'var(--text)' }}>
            Resumen financiero
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{mesLabel}</p>
        </div>
        <button style={{ color: 'var(--muted)' }}><MoreVertical size={16} /></button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Ingresos', value: ingresos, icon: TrendingUp, color: '#8fad88' },
          { label: 'Gastos',   value: gastos,   icon: TrendingDown, color: '#d4a5a5' },
          { label: 'Ahorros',  value: ahorros,  icon: ArrowUpRight, color: '#7aa8c0' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label}>
            <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
            <div className="flex items-center gap-1">
              <span className="text-base font-bold" style={{ color: 'var(--text)' }}>
                {value.toLocaleString('es-ES')} €
              </span>
              <Icon size={14} style={{ color }} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-3">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Evolución del mes</span>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: '#c9a96e' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Ingresos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: '#8fad88' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Gastos</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#8c7b6b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#8c7b6b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #ede5d8', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`${v.toLocaleString('es-ES')} €`]}
            />
            <Line type="monotone" dataKey="ingresos" stroke="#c9a96e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="gastos"   stroke="#8fad88" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Link
        href="/finanzas"
        className="flex items-center justify-between pt-3 border-t text-xs font-medium transition-smooth hover:opacity-70"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        Ver informe completo
        <ChevronRight size={14} />
      </Link>
    </Card>
  )
}
