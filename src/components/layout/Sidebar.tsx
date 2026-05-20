'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Calendar, CheckSquare, FolderKanban, Wallet,
  Plane, Target, Heart, BookOpen, BookMarked, Library, Settings, LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/',            icon: Home,          label: 'Inicio' },
  { href: '/agenda',      icon: Calendar,      label: 'Agenda' },
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
      className="w-56 flex-shrink-0 flex flex-col border-r"
      style={{ background: 'var(--sidebar)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex flex-col">
          <span
            className="text-xl font-serif font-semibold tracking-wide"
            style={{ color: 'var(--accent-dark)' }}
          >
            MI MUNDO
          </span>
          <span className="text-xs italic mt-0.5" style={{ color: 'var(--muted)' }}>
            tu vida, tu diseño
          </span>
        </div>
        {/* decorative line */}
        <div className="mt-3 h-px w-12" style={{ background: 'var(--accent)' }} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                isActive ? 'nav-active' : ''
              }`}
              style={{ color: isActive ? 'var(--accent-dark)' : 'var(--muted)' }}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Quote */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs leading-relaxed italic" style={{ color: 'var(--muted)' }}>
          &ldquo;Organizar tu vida no es quitarte libertad, es hacer espacio para lo que importa.&rdquo;
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          <span className="text-xs" style={{ color: 'var(--accent)' }}>✦</span>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-3 pb-4 space-y-0.5">
        <Link
          href="/configuracion"
          className="nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-smooth"
          style={{ color: 'var(--muted)' }}
        >
          <Settings size={15} strokeWidth={1.5} />
          Configuración
        </Link>
        <button
          className="nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-smooth"
          style={{ color: 'var(--muted)' }}
        >
          <LogOut size={15} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
