'use client'
import { useState, useEffect, useCallback } from 'react'
import { Settings, Plus, Trash2, Edit3, Check, X, ChevronDown, ChevronRight, Layers } from 'lucide-react'
import type { Area, Subarea } from '@/lib/tareas'
import { getAreas, crearSubarea, actualizarSubarea, eliminarSubarea } from '@/lib/tareas'

// ─── Color palette for subareas ───────────────────────────────────────────────
const SUBAREA_COLORS = [
  '#4a9bb5', '#2c6e8a', '#1a3a5c',
  '#c4a661', '#e07b39', '#dc3545',
  '#22c55e', '#1a7a5e', '#9c5de8',
  '#f06292', '#5a7490', '#0d2137',
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function ConfiguracionPage() {
  const [areas, setAreas]   = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getAreas()
    setAreas(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const toggleExpand = (id: string) =>
    setExpanded(e => ({ ...e, [id]: !e[id] }))

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div
        className="flex items-center gap-3 mb-6 rounded-2xl px-6 py-4"
        style={{
          background: 'linear-gradient(135deg, #081524 0%, #0d2137 40%, #1a3a5c 100%)',
          border: '1px solid rgba(74,155,181,0.15)',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(196,166,97,0.15)', border: '1px solid rgba(196,166,97,0.3)' }}
        >
          <Settings size={18} style={{ color: '#c4a661' }} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl font-serif font-semibold text-white">Configuración</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(168,213,226,0.65)' }}>
            Gestión de áreas y sub-áreas
          </p>
        </div>
      </div>

      {/* Areas section */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid var(--border-light)' }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-4 border-b"
          style={{ background: 'linear-gradient(135deg, #0d2137, #1a3a5c)', borderColor: 'rgba(74,155,181,0.2)' }}
        >
          <Layers size={15} style={{ color: '#a8d5e2' }} strokeWidth={1.5} />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white" style={{ letterSpacing: '0.1em' }}>
            Áreas y Sub-áreas
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
            {areas.map(area => (
              <AreaRow
                key={area.id}
                area={area}
                expanded={!!expanded[area.id]}
                onToggle={() => toggleExpand(area.id)}
                onRefresh={load}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── AreaRow ──────────────────────────────────────────────────────────────────
function AreaRow({
  area, expanded, onToggle, onRefresh,
}: {
  area: Area; expanded: boolean; onToggle: () => void; onRefresh: () => void
}) {
  const [newName, setNewName]   = useState('')
  const [newColor, setNewColor] = useState(area.color)
  const [saving, setSaving]     = useState(false)

  const subareas = area.subareas ?? []

  const handleAddSubarea = async () => {
    const nombre = newName.trim()
    if (!nombre) return
    setSaving(true)
    await crearSubarea({ area_id: area.id, nombre, color: newColor, orden: subareas.length })
    setNewName('')
    setNewColor(area.color)
    setSaving(false)
    onRefresh()
  }

  return (
    <div>
      {/* Area header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-smooth hover:bg-slate-50"
      >
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: area.color }} />
        <span className="text-sm font-semibold flex-1" style={{ color: 'var(--text)' }}>
          {area.icono} {area.nombre}
        </span>
        <span className="text-xs mr-2" style={{ color: 'var(--muted)' }}>
          {subareas.length} sub-área{subareas.length !== 1 ? 's' : ''}
        </span>
        {expanded ? (
          <ChevronDown size={14} style={{ color: 'var(--muted)' }} />
        ) : (
          <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
        )}
      </button>

      {/* Expanded subareas */}
      {expanded && (
        <div
          className="px-5 pb-4 pt-1"
          style={{ background: 'rgba(245,248,252,0.7)', borderTop: '1px solid var(--border-light)' }}
        >
          {/* Existing subareas */}
          <div className="space-y-1.5 mb-3">
            {subareas.length === 0 && (
              <p className="text-xs py-2" style={{ color: 'var(--muted)' }}>
                No hay sub-áreas todavía. Añade la primera abajo.
              </p>
            )}
            {subareas.map(s => (
              <SubareaRow key={s.id} subarea={s} areaColor={area.color} onRefresh={onRefresh} />
            ))}
          </div>

          {/* Add new */}
          <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <Plus size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            <input
              className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none"
              style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
              placeholder="Nombre de la sub-área..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddSubarea() }}
            />
            {/* Color picker */}
            <div className="flex items-center gap-1">
              {SUBAREA_COLORS.slice(0, 6).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: c,
                    outline: newColor === c ? `2px solid ${c}` : 'none',
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleAddSubarea}
              disabled={!newName.trim() || saving}
              className="px-3 py-2 rounded-lg text-xs font-semibold transition-smooth disabled:opacity-40"
              style={{ background: area.color, color: '#fff' }}
            >
              {saving ? '…' : 'Añadir'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SubareaRow ───────────────────────────────────────────────────────────────
function SubareaRow({ subarea, areaColor, onRefresh }: { subarea: Subarea; areaColor: string; onRefresh: () => void }) {
  const [editing, setEditing] = useState(false)
  const [nombre, setNombre]   = useState(subarea.nombre)
  const [color, setColor]     = useState(subarea.color)
  const [saving, setSaving]   = useState(false)

  const handleSave = async () => {
    if (!nombre.trim()) return
    setSaving(true)
    await actualizarSubarea(subarea.id, { nombre: nombre.trim(), color })
    setSaving(false)
    setEditing(false)
    onRefresh()
  }

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la sub-área "${subarea.nombre}"? Las tareas asociadas quedarán sin sub-área.`)) return
    await eliminarSubarea(subarea.id)
    onRefresh()
  }

  return (
    <div
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 group"
      style={{ background: '#fff', border: '1px solid var(--border-light)' }}
    >
      {editing ? (
        <>
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <input
            autoFocus
            className="flex-1 px-2 py-1 rounded text-xs border outline-none"
            style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
          />
          {/* Color dots */}
          <div className="flex items-center gap-1">
            {SUBAREA_COLORS.slice(0, 6).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-4 h-4 rounded-full"
                style={{ background: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: 1 }}
              />
            ))}
          </div>
          <button onClick={handleSave} disabled={saving} className="p-1 rounded transition-smooth hover:opacity-70">
            <Check size={13} style={{ color: areaColor }} />
          </button>
          <button onClick={() => setEditing(false)} className="p-1 rounded transition-smooth hover:opacity-70">
            <X size={13} style={{ color: 'var(--muted)' }} />
          </button>
        </>
      ) : (
        <>
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: subarea.color }} />
          <span className="flex-1 text-xs font-medium" style={{ color: 'var(--text)' }}>{subarea.nombre}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg transition-smooth hover:bg-blue-50"
              style={{ color: 'var(--accent)' }}
            >
              <Edit3 size={11} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg transition-smooth hover:bg-red-50"
              style={{ color: '#dc3545' }}
            >
              <Trash2 size={11} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
