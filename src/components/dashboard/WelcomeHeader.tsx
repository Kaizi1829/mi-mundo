'use client'
import { Sun, Cloud, CloudRain, Waves } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface WelcomeHeaderProps {
  nombre?: string
  temperatura?: number
  ciudad?: string
  clima?: 'sol' | 'nublado' | 'lluvia'
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 14) return 'Buenos días'
  if (h < 21) return 'Buenas tardes'
  return 'Buenas noches'
}

const quotes = [
  '"La calma del mar no prueba nada. La tempestad tampoco."',
  '"Navega con el viento que tienes, no con el que deseas."',
  '"El océano es paciente. El éxito también lo es."',
  '"Sé el faro, no el barco perdido."',
]

export default function WelcomeHeader({
  nombre = 'tú',
  temperatura = 24,
  ciudad = 'España',
  clima = 'sol',
}: WelcomeHeaderProps) {
  const today = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })
  const todayLabel = today.charAt(0).toUpperCase() + today.slice(1)
  const quote = quotes[new Date().getDate() % quotes.length]
  const WeatherIcon = clima === 'sol' ? Sun : clima === 'nublado' ? Cloud : CloudRain

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-5"
      style={{
        background: 'linear-gradient(135deg, #081524 0%, #0d2137 25%, #1a3a5c 55%, #2c6e8a 85%, #4a9bb5 100%)',
        minHeight: 170,
      }}
    >
      {/* Decorative wave lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large subtle circle */}
        <div
          className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full"
          style={{ background: 'rgba(74,155,181,0.08)' }}
        />
        <div
          className="absolute -top-8 right-1/4 w-40 h-40 rounded-full"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        />
        {/* Wave decorations */}
        <div className="absolute bottom-5 left-0 right-0 flex items-center gap-1 px-6 opacity-10">
          <Waves size={300} color="#a8d5e2" strokeWidth={0.5} />
        </div>
        {/* Gold accent line top */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.5 }}
        />
      </div>

      <div className="relative p-6 flex items-start justify-between">
        <div className="flex-1">
          {/* Date — muted, uppercase */}
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'rgba(168,213,226,0.65)' }}>
            {todayLabel}
          </p>
          {/* Greeting */}
          <h1 className="text-3xl font-serif font-semibold text-white mb-2 leading-tight">
            {getGreeting()}, <span style={{ color: '#a8d5e2' }}>{nombre}</span>
          </h1>
          {/* Quote */}
          <p className="text-sm font-light italic" style={{ color: 'rgba(168,213,226,0.75)' }}>
            {quote}
          </p>
        </div>

        {/* Weather pill */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 ml-6 flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <WeatherIcon size={22} color="#a8d5e2" strokeWidth={1.5} />
          <div>
            <p className="text-xl font-bold text-white leading-none">{temperatura}°</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(168,213,226,0.7)' }}>{ciudad}</p>
          </div>
        </div>
      </div>

      {/* Bottom gold separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,166,97,0.4), transparent)' }}
      />
    </div>
  )
}
