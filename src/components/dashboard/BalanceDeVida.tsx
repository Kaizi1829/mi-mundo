'use client'
import { ChevronRight, Heart, Briefcase, Coins, TrendingUp, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'

interface BalanceItem { label: string; valor: number; icon: React.ElementType }

const balanceDemo: BalanceItem[] = [
  { label: 'Salud',       valor: 8, icon: Heart      },
  { label: 'Trabajo',     valor: 8, icon: Briefcase  },
  { label: 'Finanzas',    valor: 7, icon: Coins       },
  { label: 'Crecimiento', valor: 9, icon: TrendingUp  },
  { label: 'Relaciones',  valor: 8, icon: Users       },
  { label: 'Diversión',   valor: 8, icon: Sparkles    },
]

function avg(items: BalanceItem[]) {
  return (items.reduce((s, i) => s + i.valor, 0) / items.length).toFixed(1)
}

function DonutChart({ score }: { score: number }) {
  const r = 34
  const circ = 2 * Math.PI * r
  const filled = (score / 10) * circ
  return (
    <svg width={86} height={86} viewBox="0 0 86 86">
      <circle cx={43} cy={43} r={r} fill="none" stroke="#d4dde8" strokeWidth={9} />
      <circle
        cx={43} cy={43} r={r}
        fill="none"
        stroke="url(#oceanGrad)"
        strokeWidth={9}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 43 43)"
      />
      <defs>
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a3a5c" />
          <stop offset="100%" stopColor="#4a9bb5" />
        </linearGradient>
      </defs>
      <text x={43} y={47} textAnchor="middle" fontSize={17} fontWeight={700} fill="#0d2137">{score}</text>
      <text x={43} y={59} textAnchor="middle" fontSize={8} fill="#5a7490" letterSpacing="0.5">EQUILIBRIO</text>
    </svg>
  )
}

export default function BalanceDeVida({ balance = balanceDemo }: { balance?: BalanceItem[] }) {
  const score = parseFloat(avg(balance))
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #2c6e8a, #4a9bb5)' }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text)', letterSpacing: '0.05em' }}>
          Balance de vida
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <DonutChart score={score} />
        <div className="flex-1 space-y-1.5">
          {balance.map(({ label, valor, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={11} style={{ color: 'var(--muted)' }} strokeWidth={1.5} />
              <span className="text-xs w-20" style={{ color: 'var(--muted)' }}>{label}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${valor * 10}%`,
                    background: 'linear-gradient(90deg, #1a3a5c, #4a9bb5)',
                  }}
                />
              </div>
              <span className="text-xs font-semibold tabular-nums w-7 text-right" style={{ color: 'var(--text)' }}>
                {valor}/10
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/objetivos"
        className="flex items-center justify-between pt-3 mt-3 border-t text-xs font-medium transition-smooth hover:opacity-70"
        style={{ borderColor: 'var(--border-light)', color: 'var(--accent)' }}
      >
        Ver detalles
        <ChevronRight size={14} />
      </Link>
    </Card>
  )
}
