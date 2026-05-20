'use client'
import { Bell, Coffee } from 'lucide-react'

export default function TopBar() {
  return (
    <header
      className="h-14 flex-shrink-0 flex items-center justify-end px-6 border-b"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 3px rgba(13,33,55,0.05)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-lg transition-smooth hover:bg-navy-50"
          style={{ color: 'var(--muted)' }}
          title="Notificaciones"
        >
          <Bell size={17} strokeWidth={1.5} />
        </button>
        <button
          className="p-2 rounded-lg transition-smooth hover:bg-navy-50"
          style={{ color: 'var(--muted)' }}
          title="Pausa"
        >
          <Coffee size={17} strokeWidth={1.5} />
        </button>
        {/* Divisor vertical */}
        <div className="w-px h-5" style={{ background: 'var(--border)' }} />
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          M
        </div>
      </div>
    </header>
  )
}
