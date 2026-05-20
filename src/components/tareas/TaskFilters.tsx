'use client'
import { Search, SlidersHorizontal, LayoutList, Columns, X } from 'lucide-react'
import type { Area } from '@/lib/tareas'
import { PRIORIDAD_CONFIG, ESTADO_CONFIG } from '@/lib/tareas'

interface Filtros {
  busqueda: string
  area_id: string
  prioridad: string
  estado: string
}

interface Props {
  filtros: Filtros
  onChange: (f: Filtros) => void
  areas: Area[]
  vista: 'lista' | 'kanban'
  onVista: (v: 'lista' | 'kanban') => void
  totalFiltradas: number
}

export default function TaskFilters({ filtros, onChange, areas, vista, onVista, totalFiltradas }: Props) {
  const set = (key: keyof Filtros, value: string) => onChange({ ...filtros, [key]: value })
  const hasFilters = filtros.area_id || filtros.prioridad || filtros.estado || filtros.busqueda

  return (
    <div
      className="rounded-2xl p-4 mb-4 flex flex-col gap-3"
      style={{ background: '#fff', border: '1px solid var(--border-light)' }}
    >
      {/* Row 1: search + view toggle */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-smooth"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
            placeholder="Buscar tareas..."
            value={filtros.busqueda}
            onChange={e => set('busqueda', e.target.value)}
          />
          {filtros.busqueda && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => set('busqueda', '')}>
              <X size={13} style={{ color: 'var(--muted)' }} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg)' }}>
          {[
            { v: 'lista', Icon: LayoutList, label: 'Lista' },
            { v: 'kanban', Icon: Columns, label: 'Kanban' },
          ].map(({ v, Icon, label }) => (
            <button
              key={v}
              onClick={() => onVista(v as 'lista' | 'kanban')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth"
              style={vista === v
                ? { background: 'var(--accent)', color: '#fff' }
                : { color: 'var(--muted)' }
              }
            >
              <Icon size={13} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={13} style={{ color: 'var(--muted)' }} strokeWidth={1.5} />
        <span className="text-xs font-medium uppercase tracking-wide mr-1" style={{ color: 'var(--muted)' }}>Filtrar:</span>

        {/* Área */}
        <select
          className="text-xs rounded-lg px-2.5 py-1.5 border outline-none transition-smooth"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: filtros.area_id ? 'var(--text)' : 'var(--muted)' }}
          value={filtros.area_id}
          onChange={e => set('area_id', e.target.value)}
        >
          <option value="">Todas las áreas</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>

        {/* Prioridad */}
        <select
          className="text-xs rounded-lg px-2.5 py-1.5 border outline-none transition-smooth"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: filtros.prioridad ? 'var(--text)' : 'var(--muted)' }}
          value={filtros.prioridad}
          onChange={e => set('prioridad', e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          {Object.entries(PRIORIDAD_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        {/* Estado */}
        <select
          className="text-xs rounded-lg px-2.5 py-1.5 border outline-none transition-smooth"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: filtros.estado ? 'var(--text)' : 'var(--muted)' }}
          value={filtros.estado}
          onChange={e => set('estado', e.target.value)}
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADO_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => onChange({ busqueda: '', area_id: '', prioridad: '', estado: '' })}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-smooth hover:opacity-80"
            style={{ background: 'rgba(220,53,69,0.08)', color: '#dc3545' }}
          >
            <X size={11} /> Limpiar filtros
          </button>
        )}

        {/* Count */}
        <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>
          {totalFiltradas} resultado{totalFiltradas !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
