import WelcomeHeader from '@/components/dashboard/WelcomeHeader'
import DailyVitals from '@/components/dashboard/DailyVitals'
import AgendaSemanal from '@/components/dashboard/AgendaSemanal'
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

      {/* Ocean hero banner */}
      <WelcomeHeader nombre="tú" temperatura={24} ciudad="España" clima="sol" />

      {/* Daily vitals */}
      <DailyVitals />

      {/* Weekly agenda — full width, mixing calendar + tasks */}
      <div className="mb-4">
        <AgendaSemanal />
      </div>

      {/* Main 3-column grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* Column 1 */}
        <div className="col-span-4 flex flex-col gap-4">
          <BalanceDeVida />
          <FocusDelDia />
        </div>

        {/* Column 2 */}
        <div className="col-span-4 flex flex-col gap-4">
          <QuoteWidget />
          <ObjetivosPrincipales />
        </div>

        {/* Column 3 */}
        <div className="col-span-4 flex flex-col gap-4">
          <ProximoViaje />
          <ResumenFinanciero />
          <WellnessWidget />
        </div>

      </div>

      {/* Footer */}
      <div className="text-center py-8 mt-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--accent))' }} />
          <span style={{ color: 'var(--accent)', fontSize: 16 }}>⚓</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
        </div>
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          Respira · Planifica · Actúa · Disfruta · Repite
        </p>
      </div>

    </div>
  )
}
