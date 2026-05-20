'use client'
import Card from '@/components/ui/Card'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'

const mensual = [
  { mes: 'Ene', ingresos: 5200, gastos: 2800 },
  { mes: 'Feb', ingresos: 5400, gastos: 2600 },
  { mes: 'Mar', ingresos: 5100, gastos: 3100 },
  { mes: 'Abr', ingresos: 5600, gastos: 2700 },
  { mes: 'May', ingresos: 5850, gastos: 2950 },
]

const gastosCat = [
  { cat: 'Hogar',       valor: 900  },
  { cat: 'Alimentación',valor: 450  },
  { cat: 'Transporte',  valor: 180  },
  { cat: 'Ocio',        valor: 320  },
  { cat: 'Salud',       valor: 150  },
  { cat: 'Ropa',        valor: 250  },
  { cat: 'Otros',       valor: 700  },
]

export default function FinanzasPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wallet size={22} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--text)' }}>Finanzas</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={15} /> Añadir movimiento
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Ingresos este mes', value: '5.850 €', icon: TrendingUp,   color: '#8fad88' },
          { label: 'Gastos este mes',   value: '2.950 €', icon: TrendingDown, color: '#d4a5a5' },
          { label: 'Ahorros acumulados',value: '2.900 €', icon: PiggyBank,    color: '#7aa8c0' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{label}</p>
                <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Evolución mensual</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mensual}>
              <CartesianGrid stroke="#ede5d8" strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#8c7b6b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8c7b6b' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #ede5d8', fontSize: 12 }} />
              <Line type="monotone" dataKey="ingresos" stroke="#c9a96e" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="gastos"   stroke="#8fad88" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Gastos por categoría</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gastosCat} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: '#8c7b6b' }} />
              <YAxis type="category" dataKey="cat" width={80} tick={{ fontSize: 11, fill: '#8c7b6b' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #ede5d8', fontSize: 12 }} />
              <Bar dataKey="valor" fill="#c9a96e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
