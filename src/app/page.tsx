import WelcomeHeader from '@/components/dashboard/WelcomeHeader'
import DailyVitals from '@/components/dashboard/DailyVitals'
import AgendaHoy from '@/components/dashboard/AgendaHoy'
import FocusDelDia from '@/components/dashboard/FocusDelDia'
import BalanceDeVida from '@/components/dashboard/BalanceDeVida'
import QuoteWidget from '@/components/dashboard/QuoteWidget'
import ResumenFinanciero from '@/components/dashboard/ResumenFinanciero'
import ProximoViaje from '@/components/dashboard/ProximoViaje'
import ObjetivosPrincipales from '@/components/dashboard/ObjetivosPrincipales'
import WellnessWidget from '@/components/dashboard/WellnessWidget'

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero banner */}
      <WelcomeHeader nombre="tú" temperatura={24} ciudad="España" clima="sol" />

      {/* Daily vitals row */}
      <DailyVitals />

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* Left column — Agenda + Balance */}
        <div className="col-span-4 flex flex-col gap-4">
          <AgendaHoy />
          <BalanceDeVida />
        </div>

        {/* Center column — Focus + Quote + Objetivos */}
        <div className="col-span-4 flex flex-col gap-4">
          <FocusDelDia />
          <QuoteWidget />
          <ObjetivosPrincipales />
        </div>

        {/* Right column — Viaje + Finanzas + Wellness */}
        <div className="col-span-4 flex flex-col gap-4">
          <ProximoViaje />
          <ResumenFinanciero />
          <WellnessWidget />
        </div>

      </div>

      {/* Footer tagline */}
      <div className="text-center py-6 mt-2">
        <p className="text-xs italic" style={{ color: 'var(--muted)' }}>
          Respira. Planifica. Actúa. Disfruta. Repite.
        </p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="h-px w-16" style={{ background: 'var(--border)' }} />
          <span className="text-xs" style={{ color: 'var(--accent)' }}>✦</span>
          <div className="h-px w-16" style={{ background: 'var(--border)' }} />
        </div>
      </div>
    </div>
  )
}
