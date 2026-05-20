'use client'
import { ChevronRight, Heart, Briefcase, Coins, TrendingUp, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'

interface BalanceItem {
  label: string
  valor: number
  icon: React.ElementType
}

const balanceDemo: BalanceItem[] = [
  { label: 'Salud',       valor: 8, icon: Heart     },
  { label: 'Trabajo',     valor: 8, icon: Briefcase  },
  { label: 'Finanzas',    valor: 7, icon: Coins      },
  { label: 'Crecimiento', valor: 9, icon: TrendingUp  },
  { label: 'Relaciones',  valor: 8, icon: Users       },
  { label: 'Diversión',   valor: 8, icon: Sparkles    },
]

function equilibrio(items: BalanceItem[]) {
  return (items.reduce((s, i) => s + i.valor, 0) / items.length).toFixed(1)
}

// Simple donut via SVG
function DonutChart({ score }: { score: number }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const filled = (score / 10) * circ
  return (
    <svg width={90} height={90} viewBox="0 0 90 90">
      <circle cx={45} cy={45} r={r} fill="none" stroke="#ede5d8" strokeWidth={10} />
      <circle
        cx={45} cy={45} r={r}
        fill="none"
        stroke="#c9a96e"
        strokeWidth={10}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
      />
      <text x={45} y={48} textAnchor="middle" fontSize={16} fontWeight={600} fill="#2d2520">{score}</text>
      <text x={45} y={62} textAnchor="middle" fontSize={8} fill="#8c7b6b">Equilibrio</text>
    </svg>
  )
}

export default function BalanceDeVida({ balance = balanceDemo }: { balance?: BalanceItem[] }) {
  const avg = parseFloat(equilibrio(balance))

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold font-serif" style={{ color: 'var(--text)' }}>
          Balance de vida
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <DonutChart score={avg} />
        <div className="flex-1 space-y-2">
          {balance.map(({ label, valor, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={12} style={{ color: 'var(--muted)' }} strokeWidth={1.5} />
              <span className="text-xs w-20" style={{ color: 'var(--muted)' }}>{label}</span>
              <div className="flex-1 h-1.5 rounded-full" style={{ background: '#ede5d8' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${valor * 10}%`, background: '#c9a96e' }}
                />
              </div>
              <span className="text-xs font-medium w-8 text-right" style={{ color: 'var(--text)' }}>
                {valor}/10
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/objetivos"
        className="flex items-center justify-between pt-3 mt-2 border-t text-xs font-medium transition-smooth hover:opacity-70"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        Ver detalles
        <ChevronRight size={14} />
      </Link>
    </Card>
  )
}
