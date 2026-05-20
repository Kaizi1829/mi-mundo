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
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #2c6e8a, #4a9bb5)' }} />
            <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text)', letterSpacing: '0.05em' }}>
              Resumen financiero
            </h2>
          </div>
          <p className="text-xs mt-0.5 pl-3" style={{ color: 'var(--muted)' }}>{mesLabel}</p>
        </div>
        <button style={{ color: 'var(--muted)' }}><MoreVertical size={15} /></button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Ingresos', value: ingresos, icon: TrendingUp,   color: '#2c6e8a',  bg: 'rgba(44,110,138,0.08)' },
          { label: 'Gastos',   value: gastos,   icon: TrendingDown, color: '#c4a661',  bg: 'rgba(196,166,97,0.10)' },
          { label: 'Ahorros',  value: ahorros,  icon: ArrowUpRight, color: '#4a9bb5',  bg: 'rgba(74,155,181,0.08)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl p-3" style={{ background: bg }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</span>
              <Icon size={13} style={{ color }} strokeWidth={1.5} />
            </div>
            <p className="text-base font-bold" style={{ color: 'var(--text)' }}>
              {value.toLocaleString('es-ES')} €
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-3">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Evolución</span>
          <div className="flex items-center gap-3 ml-auto">
            {[{ label: 'Ingresos', color: '#2c6e8a' }, { label: 'Gastos', color: '#c4a661' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={90}>
          <LineChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <XAxis dataKey="dia" tick={{ fontSize: 9, fill: '#5a7490' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#5a7490' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0d2137', border: '1px solid rgba(74,155,181,0.3)', borderRadius: 8, fontSize: 11, color: '#a8d5e2' }}
              formatter={(v: number) => [`${v.toLocaleString('es-ES')} €`]}
            />
            <Line type="monotone" dataKey="ingresos" stroke="#2c6e8a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="gastos"   stroke="#c4a661" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Link
        href="/finanzas"
        className="flex items-center justify-between pt-3 border-t text-xs font-medium transition-smooth hover:opacity-70"
        style={{ borderColor: 'var(--border-light)', color: 'var(--accent)' }}
      >
        Ver informe completo
        <ChevronRight size={14} />
      </Link>
    </Card>
  )
}
