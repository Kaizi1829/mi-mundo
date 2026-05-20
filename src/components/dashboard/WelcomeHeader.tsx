'use client'
import { Sun, Cloud, CloudRain } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface WelcomeHeaderProps {
  nombre?: string
  temperatura?: number
  ciudad?: string
  clima?: 'sol' | 'nublado' | 'lluvia'
}

const greetings = [
  'Buenos días',
  'Buenas tardes',
  'Buenas noches',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 14) return greetings[0]
  if (h < 21) return greetings[1]
  return greetings[2]
}

const quotes = [
  '"Hoy es un buen día para tener un gran día."',
  '"Cada día es una nueva oportunidad para crear tu mejor vida."',
  '"Lo que hagas hoy puede mejorar todos los mañanas."',
  '"El éxito es la suma de pequeños esfuerzos repetidos cada día."',
]

function getQuoteOfDay() {
  const idx = new Date().getDate() % quotes.length
  return quotes[idx]
}

export default function WelcomeHeader({
  nombre = 'tú',
  temperatura = 24,
  ciudad = 'España',
  clima = 'sol',
}: WelcomeHeaderProps) {
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es })
  const todayCap = today.charAt(0).toUpperCase() + today.slice(1)

  const WeatherIcon = clima === 'sol' ? Sun : clima === 'nublado' ? Cloud : CloudRain

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-4"
      style={{ minHeight: 180, background: 'linear-gradient(135deg, #e8d5b0 0%, #c9a96e 40%, #8fad88 100%)' }}
    >
      {/* Background decorative circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-10" style={{ background: '#fff' }} />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-10" style={{ background: '#fff' }} />
      </div>

      <div className="relative p-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif font-semibold text-white drop-shadow-sm">
              {getGreeting()}, {nombre}
            </h1>
            <span className="text-2xl">🤍</span>
          </div>
          <p className="mt-1.5 text-white/80 text-sm font-light italic">
            {getQuoteOfDay()}
          </p>
          <p className="mt-3 text-white/70 text-xs font-medium uppercase tracking-widest">
            {todayCap}
          </p>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-white">
          <WeatherIcon size={22} strokeWidth={1.5} />
          <div className="text-right">
            <div className="text-lg font-semibold leading-none">{temperatura}°</div>
            <div className="text-xs opacity-80 mt-0.5">{ciudad}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
