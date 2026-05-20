'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Calendar, CheckSquare, FolderKanban, Wallet,
  Plane, Target, Heart, BookOpen, BookMarked, Library, Settings, LogOut, Anchor,
} from 'lucide-react'

const navItems = [
  { href: '/',            icon: Home,          label: 'Inicio' },
  { href: '/calendario',  icon: Calendar,      label: 'Calendario' },
  { href: '/tareas',      icon: CheckSquare,   label: 'Tareas' },
  { href: '/proyectos',   icon: FolderKanban,  label: 'Proyectos' },
  { href: '/finanzas',    icon: Wallet,        label: 'Finanzas' },
  { href: '/viajes',      icon: Plane,         label: 'Viajes' },
  { href: '/objetivos',   icon: Target,        label: 'Objetivos' },
  { href: '/wellness',    icon: Heart,         label: 'Wellness' },
  { href: '/notas',       icon: BookOpen,      label: 'Notas & Ideas' },
  { href: '/diario',      icon: BookMarked,    label: 'Diario' },
  { href: '/recursos',    icon: Library,       label: 'Recursos' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col border-r border-white/5"
      style={{ background: 'var(--sidebar)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--gold)' }}
          >
            <Anchor size={14} color="#0d2137" strokeWidth={2} />
          </div>
          <span
            className="text-lg font-serif font-semibold tracking-wide"
            style={{ color: '#f0f5fa' }}
          >
            MI MUNDO
          </span>
        </div>
        <p className="text-xs italic pl-9" style={{ color: 'var(--muted-inv)' }}>
          tu vida, tu diseño
        </p>
        {/* Separador dorado */}
        <div className="mt-4 h-px w-full" style={{ background: 'linear-gradient(90deg, var(--gold) 0%, transparent 100%)', opacity: 0.35 }} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? 'nav-active' : ''
              }`}
              style={{
                color: isActive ? '#a8d5e2' : 'var(--muted-inv)',
              }}
            >
              <Icon
                size={15}
                strokeWidth={isActive ? 2 : 1.5}
                style={{ color: isActive ? '#4a9bb5' : 'var(--muted-inv)' }}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Quote */}
      <div
        className="mx-3 mb-3 rounded-xl px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-inv)', opacity: 0.7 }}>
          &ldquo;El mar no te pregunta si estás listo.&rdquo;
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-px flex-1" style={{ background: 'rgba(196,166,97,0.3)' }} />
          <span style={{ color: 'var(--gold)', fontSize: 10 }}>⚓</span>
          <div className="h-px flex-1" style={{ background: 'rgba(196,166,97,0.3)' }} />
        </div>
      </div>

      {/* Bottom */}
      <div
        className="px-3 pb-4 pt-2 space-y-0.5 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <Link
          href="/configuracion"
          className="nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
          style={{ color: 'var(--muted-inv)' }}
        >
          <Settings size={14} strokeWidth={1.5} />
          Configuración
        </Link>
        <button
          className="nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
          style={{ color: 'var(--muted-inv)' }}
        >
          <LogOut size={14} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
