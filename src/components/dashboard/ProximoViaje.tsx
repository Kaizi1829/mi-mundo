'use client'
import { Plane, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { differenceInDays, parseISO } from 'date-fns'

interface ViajeProps {
  destino?: string
  fechaInicio?: string
  fechaFin?: string
  imagenUrl?: string
}

export default function ProximoViaje({
  destino = 'Bali, Indonesia',
  fechaInicio = '2025-09-12',
  fechaFin = '2025-09-28',
  imagenUrl = 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
}: ViajeProps) {
  const diasRestantes = differenceInDays(parseISO(fechaInicio), new Date())
  const ini = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  const label = `${ini.getDate()} – ${fin.getDate()} ${fin.toLocaleString('es-ES', { month: 'long' })} ${fin.getFullYear()}`

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-2">
          <Plane size={15} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
          <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text)', letterSpacing: '0.05em' }}>
            Próximo viaje
          </h2>
        </div>
        <Link href="/viajes" className="text-xs transition-smooth hover:opacity-70" style={{ color: 'var(--accent)' }}>
          Ver todos <ChevronRight size={12} className="inline" />
        </Link>
      </div>

      {/* Image */}
      <div className="relative h-44 mx-0">
        <img src={imagenUrl} alt={destino} className="w-full h-full object-cover" />
        {/* Navy overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(13,33,55,0.80) 0%, rgba(13,33,55,0.20) 50%, transparent 100%)' }}
        />
        {/* Destination */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={14} color="white" strokeWidth={1.5} />
            <span className="text-white font-semibold text-base font-serif drop-shadow">{destino}</span>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs">{label}</p>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block"
              style={{ background: 'var(--gold)', color: '#0d2137' }}
            >
              {diasRestantes} días
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
