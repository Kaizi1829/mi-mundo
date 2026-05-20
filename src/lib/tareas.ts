import { supabase } from './supabase'

export interface Area {
  id: string
  nombre: string
  icono: string
  color: string
  orden: number
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
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada'
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

export type TareaInput = Omit<Tarea, 'id' | 'created_at' | 'updated_at' | 'area' | 'subtareas'>

// Utilities
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
  pendiente:   { label: 'Pendiente',   color: '#5a7490',  bg: 'rgba(90,116,144,0.10)'  },
  en_progreso: { label: 'En progreso', color: '#2c6e8a',  bg: 'rgba(44,110,138,0.12)'  },
  completada:  { label: 'Completada',  color: '#28a745',  bg: 'rgba(40,167,69,0.10)'   },
  bloqueada:   { label: 'Bloqueada',   color: '#dc3545',  bg: 'rgba(220,53,69,0.10)'   },
}

// API helpers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

export async function getAreas(): Promise<Area[]> {
  const { data, error } = await db.from('areas').select('*').order('orden')
  if (error) console.error('[getAreas] error:', error)
  if (!data?.length) console.warn('[getAreas] returned empty:', { data, error })
  return (data ?? []) as Area[]
}

export async function getTareas(filtros?: {
  area_id?: string; estado?: string; prioridad?: string
}): Promise<Tarea[]> {
  let q = db
    .from('tareas')
    .select('*, area:areas(*), subtareas(*)')
    .order('prioridad', { ascending: true })
    .order('fecha_vencimiento', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (filtros?.area_id)   q = q.eq('area_id', filtros.area_id)
  if (filtros?.estado)    q = q.eq('estado', filtros.estado)
  if (filtros?.prioridad) q = q.eq('prioridad', filtros.prioridad)

  const { data } = await q
  return (data ?? []) as Tarea[]
}

export async function crearTarea(input: TareaInput): Promise<Tarea | null> {
  // Don't send fecha_completada on create — DB handles it as null by default
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fecha_completada, ...payload } = input
  const { data, error } = await db
    .from('tareas')
    .insert(payload)
    .select('*, area:areas(*), subtareas(*)')
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
    estado: completada ? 'completada' : 'pendiente',
    fecha_completada: completada ? new Date().toISOString() : null,
  }).eq('id', id)
}

export async function eliminarTarea(id: string): Promise<void> {
  await db.from('tareas').delete().eq('id', id)
}

export async function toggleSubtarea(id: string, completada: boolean): Promise<void> {
  await db.from('subtareas').update({ completada }).eq('id', id)
}
