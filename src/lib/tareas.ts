import { supabase } from './supabase'

export interface Subarea {
  id: string
  area_id: string
  nombre: string
  color: string
  orden: number
}

export interface Area {
  id: string
  nombre: string
  icono: string
  color: string
  orden: number
  subareas?: Subarea[]
}

export interface Subtarea {
  id: string
  tarea_id: string
  titulo: string
  completada: boolean
  orden: number
}

export interface Tarea {
  id: string
  titulo: string
  descripcion: string | null
  area_id: string | null
  area?: Area
  subarea_id: string | null
  subarea?: Subarea
  estado: 'sin_empezar' | 'pendiente_cliente' | 'pendiente_cia' | 'completada'
  prioridad: 'alta' | 'media' | 'baja'
  fecha_vencimiento: string | null
  fecha_completada: string | null
  etiquetas: string[]
  notas: string | null
  recurrente: boolean
  recurrencia: 'diaria' | 'semanal' | 'mensual' | 'anual' | null
  orden: number
  subtareas?: Subtarea[]
  created_at: string
  updated_at: string
}

export type TareaInput = Omit<Tarea, 'id' | 'created_at' | 'updated_at' | 'area' | 'subarea' | 'subtareas'>

// ─── Utilities ────────────────────────────────────────────────────────────────
export function isVencida(t: Tarea) {
  if (!t.fecha_vencimiento || t.estado === 'completada') return false
  return new Date(t.fecha_vencimiento) < new Date(new Date().toDateString())
}
export function isHoy(t: Tarea) {
  if (!t.fecha_vencimiento) return false
  return t.fecha_vencimiento === new Date().toISOString().split('T')[0]
}
export function isProxima(t: Tarea, dias = 3) {
  if (!t.fecha_vencimiento || t.estado === 'completada') return false
  const diff = (new Date(t.fecha_vencimiento).getTime() - Date.now()) / 86400000
  return diff > 0 && diff <= dias
}

export function alertColor(t: Tarea): string {
  if (isVencida(t))  return '#dc3545'
  if (isHoy(t))      return '#c4a661'
  if (isProxima(t))  return '#e07b39'
  return '#5a7490'
}

export function alertLabel(t: Tarea): string {
  if (!t.fecha_vencimiento) return ''
  const d = new Date(t.fecha_vencimiento)
  const today = new Date(new Date().toDateString())
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return `Vencida hace ${Math.abs(diff)}d`
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Mañana'
  return `en ${diff} días`
}

export const PRIORIDAD_CONFIG = {
  alta:  { label: 'Alta',  color: '#dc3545', bg: 'rgba(220,53,69,0.10)',  dot: '●' },
  media: { label: 'Media', color: '#c4a661', bg: 'rgba(196,166,97,0.12)', dot: '●' },
  baja:  { label: 'Baja',  color: '#4a9bb5', bg: 'rgba(74,155,181,0.10)', dot: '●' },
}

export const ESTADO_CONFIG = {
  sin_empezar:       { label: 'Sin empezar',         color: '#5a7490', bg: 'rgba(90,116,144,0.10)'  },
  pendiente_cliente: { label: 'Pendiente de cliente', color: '#c4a661', bg: 'rgba(196,166,97,0.12)'  },
  pendiente_cia:     { label: 'Pendiente de CIA',     color: '#e07b39', bg: 'rgba(224,123,57,0.12)'  },
  completada:        { label: 'Completado',           color: '#22c55e', bg: 'rgba(34,197,94,0.10)'   },
}

// API helpers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

// ─── Areas & Subareas ─────────────────────────────────────────────────────────
export async function getAreas(): Promise<Area[]> {
  const { data, error } = await db
    .from('areas')
    .select('*, subareas(*)')
    .order('orden')
  if (error) console.error('[getAreas] error:', error)
  return (data ?? []) as Area[]
}

export async function crearSubarea(input: Omit<Subarea, 'id'>): Promise<Subarea | null> {
  const { data, error } = await db.from('subareas').insert(input).select().single()
  if (error) { console.error('[crearSubarea]', error); return null }
  return data as Subarea
}

export async function eliminarSubarea(id: string): Promise<void> {
  await db.from('subareas').delete().eq('id', id)
}

export async function actualizarSubarea(id: string, updates: Partial<Omit<Subarea, 'id'>>): Promise<void> {
  await db.from('subareas').update(updates).eq('id', id)
}

// ─── Tareas ───────────────────────────────────────────────────────────────────
export async function getTareas(filtros?: {
  area_id?: string; subarea_id?: string; estado?: string; prioridad?: string
}): Promise<Tarea[]> {
  let q = db
    .from('tareas')
    .select('*, area:areas(*), subarea:subareas(*), subtareas(*)')
    .order('prioridad', { ascending: true })
    .order('fecha_vencimiento', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (filtros?.area_id)    q = q.eq('area_id', filtros.area_id)
  if (filtros?.subarea_id) q = q.eq('subarea_id', filtros.subarea_id)
  if (filtros?.estado)     q = q.eq('estado', filtros.estado)
  if (filtros?.prioridad)  q = q.eq('prioridad', filtros.prioridad)

  const { data } = await q
  return (data ?? []) as Tarea[]
}

export async function crearTarea(input: TareaInput): Promise<Tarea | null> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fecha_completada, ...payload } = input
  const { data, error } = await db
    .from('tareas')
    .insert(payload)
    .select('*, area:areas(*), subarea:subareas(*), subtareas(*)')
    .single()
  if (error) {
    console.error('[crearTarea] Supabase error:', error)
    throw new Error(error.message ?? 'Error al crear la tarea')
  }
  return data as Tarea | null
}

export async function actualizarTarea(id: string, updates: Partial<TareaInput>): Promise<void> {
  await db.from('tareas').update(updates).eq('id', id)
}

export async function completarTarea(id: string, completada: boolean): Promise<void> {
  await db.from('tareas').update({
    estado: completada ? 'completada' : 'sin_empezar',
    fecha_completada: completada ? new Date().toISOString() : null,
  }).eq('id', id)
}

export async function eliminarTarea(id: string): Promise<void> {
  await db.from('tareas').delete().eq('id', id)
}

export async function toggleSubtarea(id: string, completada: boolean): Promise<void> {
  await db.from('subtareas').update({ completada }).eq('id', id)
}
