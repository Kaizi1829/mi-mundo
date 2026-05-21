'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Plus, CheckSquare, Anchor } from 'lucide-react'
import TaskStats from '@/components/tareas/TaskStats'
import TaskFilters from '@/components/tareas/TaskFilters'
import TaskRow from '@/components/tareas/TaskRow'
import TaskModal from '@/components/tareas/TaskModal'
import KanbanView from '@/components/tareas/KanbanView'
import QuickAdd from '@/components/tareas/QuickAdd'
import AlertaVencimientos from '@/components/tareas/AlertaVencimientos'
import type { Tarea, Area, TareaInput } from '@/lib/tareas'
import {
  getTareas, getAreas, crearTarea, actualizarTarea,
  completarTarea, eliminarTarea, toggleSubtarea,
} from '@/lib/tareas'

interface Filtros { busqueda: string; area_id: string; prioridad: string; estado: string }
const filtrosInit: Filtros = { busqueda: '', area_id: '', prioridad: '', estado: '' }

export default function TareasPage() {
  const [tareas, setTareas]   = useState<Tarea[]>([])
  const [areas, setAreas]     = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState<Filtros>(filtrosInit)
  const [vista, setVista]     = useState<'lista' | 'kanban'>('lista')
  const [modal, setModal]     = useState<{ open: boolean; tarea?: Tarea | null; prefill?: Partial<TareaInput> }>({ open: false })

  // Load data
  const load = useCallback(async () => {
    setLoading(true)
    const [t, a] = await Promise.all([getTareas(), getAreas()])
    setTareas(t)
    setAreas(a)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Filter
  const filtradas = useMemo(() => {
    return tareas.filter(t => {
      if (filtros.busqueda && !t.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false
      if (filtros.area_id   && t.area_id   !== filtros.area_id)   return false
      if (filtros.prioridad && t.prioridad  !== filtros.prioridad) return false
      if (filtros.estado    && t.estado     !== filtros.estado)    return false
      return true
    })
  }, [tareas, filtros])

  // Group by area for list view
  const porArea = useMemo(() => {
    const map: Record<string, { area: Area | null; items: Tarea[] }> = {}
    const sinArea: Tarea[] = []

    filtradas.forEach(t => {
      if (!t.area_id || !t.area) { sinArea.push(t); return }
      if (!map[t.area_id]) map[t.area_id] = { area: t.area, items: [] }
      map[t.area_id].items.push(t)
    })

    const groups = Object.values(map).sort((a, b) =>
      (a.area?.orden ?? 99) - (b.area?.orden ?? 99)
    )
    if (sinArea.length) groups.push({ area: null, items: sinArea })
    return groups
  }, [filtradas])

  // Handlers
  const handleComplete = async (id: string, completada: boolean) => {
    setTareas(ts => ts.map(t => t.id !== id ? t : {
      ...t,
      estado: completada ? 'completada' : 'sin_empezar',
      fecha_completada: completada ? new Date().toISOString() : null,
    }))
    await completarTarea(id, completada)
  }

  const handleSave = async (data: TareaInput, id?: string) => {
    try {
      if (id) {
        await actualizarTarea(id, data)
      } else {
        await crearTarea(data)
      }
      setModal({ open: false })
      await load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      alert(`No se pudo guardar la tarea: ${msg}`)
    }
  }

  const handleQuickAdd = (data: Partial<TareaInput>) => {
    setModal({ open: true, tarea: null, prefill: data })
  }

  const handleDelete = async (id: string) => {
    setTareas(ts => ts.filter(t => t.id !== id))
    await eliminarTarea(id)
  }

  const handleToggleSub = async (id: string, completada: boolean) => {
    setTareas(ts => ts.map(t => ({
      ...t,
      subtareas: t.subtareas?.map(s => s.id === id ? { ...s, completada } : s),
    })))
    await toggleSubtarea(id, completada)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div
        className="flex items-center justify-between mb-6 rounded-2xl px-6 py-4"
        style={{
          background: 'linear-gradient(135deg, #081524 0%, #0d2137 40%, #1a3a5c 100%)',
          border: '1px solid rgba(74,155,181,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(196,166,97,0.15)', border: '1px solid rgba(196,166,97,0.3)' }}
          >
            <Anchor size={18} style={{ color: '#c4a661' }} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold text-white">Panel de Tareas</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(168,213,226,0.65)' }}>
              Gestión profesional · {tareas.filter(t => t.estado !== 'completada').length} pendientes
            </p>
          </div>
        </div>

        <button
          onClick={() => setModal({ open: true, tarea: null })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-smooth hover:opacity-90"
          style={{ background: 'var(--gold)', color: '#0d2137' }}
        >
          <Plus size={16} strokeWidth={2} />
          Nueva tarea
        </button>
      </div>

      {/* Quick add */}
      {!loading && <QuickAdd areas={areas} onParsed={handleQuickAdd} />}

      {/* Alerta vencimientos */}
      {!loading && <AlertaVencimientos tareas={tareas} />}

      {/* Stats */}
      {!loading && <TaskStats tareas={tareas} />}

      {/* Filters */}
      <TaskFilters
        filtros={filtros}
        onChange={setFiltros}
        areas={areas}
        vista={vista}
        onVista={setVista}
        totalFiltradas={filtradas.length}
      />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Cargando tareas...</p>
          </div>
        </div>
      ) : filtradas.length === 0 ? (
        <div
          className="rounded-2xl py-20 text-center"
          style={{ background: '#fff', border: '1px solid var(--border-light)' }}
        >
          <CheckSquare size={40} style={{ color: 'var(--border)' }} className="mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>No hay tareas</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {Object.values(filtros).some(Boolean) ? 'Prueba a cambiar los filtros' : 'Crea tu primera tarea'}
          </p>
        </div>
      ) : vista === 'kanban' ? (
        <KanbanView
          tareas={filtradas}
          onComplete={handleComplete}
          onEdit={t => setModal({ open: true, tarea: t })}
        />
      ) : (
        /* Lista view — agrupada por área */
        <div className="space-y-5">
          {porArea.map(({ area, items }) => (
            <div key={area?.id ?? 'sin-area'}>
              {/* Area header */}
              <div className="flex items-center gap-3 mb-2 px-1">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: area ? `${area.color}18` : 'var(--bg)' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: area?.color ?? 'var(--muted)' }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: area?.color ?? 'var(--muted)' }}>
                  {area?.nombre ?? 'Sin área'}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  · {items.filter(t => t.estado !== 'completada').length} pendientes
                </span>
                <div className="flex-1 h-px" style={{ background: `${area?.color ?? 'var(--border)'}25` }} />
              </div>

              {/* Tasks */}
              <div className="space-y-1.5">
                {items.map(t => (
                  <TaskRow
                    key={t.id}
                    tarea={t}
                    onComplete={handleComplete}
                    onEdit={t => setModal({ open: true, tarea: t })}
                    onDelete={handleDelete}
                    onToggleSubtarea={handleToggleSub}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <TaskModal
          tarea={modal.tarea}
          areas={areas}
          prefill={modal.prefill}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}
