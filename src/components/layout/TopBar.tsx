'use client'
import { Bell, Coffee } from 'lucide-react'

export default function TopBar() {
  return (
    <header
      className="h-14 flex-shrink-0 flex items-center justify-end px-6 border-b"
      style={{ background: 'var(--sidebar)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-lg transition-smooth hover:bg-cream-100"
          style={{ color: 'var(--muted)' }}
          title="Notificaciones"
        >
          <Bell size={18} strokeWidth={1.5} />
        </button>
        <button
          className="p-2 rounded-lg transition-smooth hover:bg-cream-100"
          style={{ color: 'var(--muted)' }}
          title="Pausa"
        >
          <Coffee size={18} strokeWidth={1.5} />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border-2" style={{ borderColor: 'var(--accent)' }}>
          <div
            className="w-full h-full flex items-center justify-center text-sm font-medium"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            M
          </div>
        </div>
      </div>
    </header>
  )
}
