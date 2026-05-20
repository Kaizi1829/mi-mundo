'use client'
import { useState, useEffect } from 'react'
import { X, Plus, Trash2, RefreshCw } from 'lucide-react'
import type { Tarea, Area, TareaInput } from '@/lib/tareas'
import { PRIORIDAD_CONFIG, ESTADO_CONFIG } from '@/lib/tareas'

interface Props {
  tarea?: Tarea | null
  areas: Area[]
  prefill?: Partial<TareaInput>
  onSave: (data: TareaInput, id?: string) => void
  onClose: () => void
}

const empty: TareaInput = {
  titulo: '', descripcion: null, area_id: null,
  estado: 'pendiente', prioridad: 'media',
  fecha_vencimiento: null, fecha_completada: null,
  etiquetas: [], notas: null,
  recurrente: false, recurrencia: null, orden: 0,
}

export default function TaskModal({ tarea, areas, prefill, onSave, onClose }: Props) {
  const [form, setForm] = useState<TareaInput>(tarea ? {
    titulo: tarea.titulo, descripcion: tarea.descripcion, area_id: tarea.area_id,
    estado: tarea.estado, prioridad: tarea.prioridad,
    fecha_vencimiento: tarea.fecha_vencimiento, fecha_completada: tarea.fecha_completada,
    etiquetas: tarea.etiquetas, notas: tarea.notas,
    recurrente: tarea.recurrente, recurrencia: tarea.recurrencia, orden: tarea.orden,
  } : { ...empty, ...prefill })
  const [tagInput, setTagInput] = useState('')

  const set = <K extends keyof TareaInput>(k: K, v: TareaInput[K]) => setForm(f => ({ ...f, [k]: v }))

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.etiquetas.includes(t)) {
      set('etiquetas', [...form.etiquetas, t])
    }
    setTagInput('')
  }
  const removeTag = (t: string) => set('etiquetas', form.etiquetas.filter(e => e !== t))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    onSave(form, tarea?.id)
  }

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid var(--border-light)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-light)', background: 'linear-gradient(135deg, #0d2137, #1a3a5c)' }}
        >
          <div>
            <h2 className="text-base font-serif font-semibold text-white">
              {tarea ? 'Editar tarea' : 'Nueva tarea'}
            </h2>
            {!tarea && prefill?.titulo && (
              <p className="text-xs mt-0.5" style={{ color: 'rgba(196,166,97,0.75)' }}>
                ✦ Detectado automáticamente — revisa y confirma
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-smooth">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
              Título *
            </label>
            <input
              autoFocus
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-smooth"
              style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
              placeholder="¿Qué tienes que hacer?"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
            />
          </div>

          {/* Área + Prioridad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                Área
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
                value={form.area_id ?? ''}
                onChange={e => set('area_id', e.target.value || null)}
              >
                <option value="">Sin área</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                Prioridad
              </label>
              <div className="flex gap-2">
                {(Object.entries(PRIORIDAD_CONFIG) as [string, typeof PRIORIDAD_CONFIG['alta']][]).map(([k, v]) => (
                  <button
                    key={k} type="button"
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-smooth border"
                    style={form.prioridad === k
                      ? { background: v.color, color: '#fff', borderColor: v.color }
                      : { background: v.bg, color: v.color, borderColor: 'transparent' }
                    }
                    onClick={() => set('prioridad', k as TareaInput['prioridad'])}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estado + Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                Estado
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
                value={form.estado}
                onChange={e => set('estado', e.target.value as TareaInput['estado'])}
              >
                {Object.entries(ESTADO_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                Fecha límite
              </label>
              <input
                type="date"
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
                value={form.fecha_vencimiento ?? ''}
                onChange={e => set('fecha_vencimiento', e.target.value || null)}
              />
            </div>
          </div>

          {/* Recurrencia */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl transition-smooth border"
              style={form.recurrente
                ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }
                : { background: 'var(--bg)', color: 'var(--muted)', borderColor: 'var(--border)' }
              }
              onClick={() => set('recurrente', !form.recurrente)}
            >
              <RefreshCw size={12} /> Recurrente
            </button>
            {form.recurrente && (
              <select
                className="flex-1 px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
                value={form.recurrencia ?? ''}
                onChange={e => set('recurrencia', e.target.value as TareaInput['recurrencia'] || null)}
              >
                <option value="">Seleccionar frecuencia</option>
                <option value="diaria">Diaria</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="anual">Anual</option>
              </select>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
              Descripción
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
              style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
              placeholder="Contexto, detalles, referencias..."
              value={form.descripcion ?? ''}
              onChange={e => set('descripcion', e.target.value || null)}
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
              Notas privadas
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
              style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
              placeholder="Solo para ti..."
              value={form.notas ?? ''}
              onChange={e => set('notas', e.target.value || null)}
            />
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.etiquetas.map(t => (
                <span
                  key={t}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(44,110,138,0.10)', color: 'var(--accent)' }}
                >
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:opacity-60">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
                placeholder="añadir etiqueta..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-smooth"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-smooth hover:opacity-70"
              style={{ background: 'var(--bg)', color: 'var(--muted)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-smooth hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1a3a5c, #2c6e8a)' }}
            >
              {tarea ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
