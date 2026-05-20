'use client'
import { Plane, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { differenceInDays, parseISO } from 'date-fns'

interface ViajeProps {
  destino?: string
  pais?: string
  fechaInicio?: string
  fechaFin?: string
  imagenUrl?: string
}

export default function ProximoViaje({
  destino = 'Bali, Indonesia',
  pais = 'Indonesia',
  fechaInicio = '2025-09-12',
  fechaFin = '2025-09-28',
  imagenUrl = 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
}: ViajeProps) {
  const diasRestantes = differenceInDays(parseISO(fechaInicio), new Date())
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  const label = `${inicio.getDate()} – ${fin.getDate()} ${fin.toLocaleString('es-ES', { month: 'long' })} ${fin.getFullYear()}`

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-base font-semibold font-serif" style={{ color: 'var(--text)' }}>
          Próximo viaje
        </h2>
        <Link href="/viajes" className="text-xs transition-smooth hover:opacity-70" style={{ color: 'var(--muted)' }}>
          Ver todos
        </Link>
      </div>

      {/* Image */}
      <div className="relative h-44 mx-4 mb-4 rounded-xl overflow-hidden">
        <img
          src={imagenUrl}
          alt={destino}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Plane size={16} color="white" />
          <span className="text-white font-semibold text-base drop-shadow">{destino}</span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs text-white/80">{label}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(201,169,110,0.9)', color: '#fff' }}
          >
            Faltan {diasRestantes} días
          </span>
        </div>
      </div>
    </Card>
  )
}
