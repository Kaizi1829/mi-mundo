'use client'
import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import type { Area, TareaInput } from '@/lib/tareas'

interface QuickAddProps {
  areas: Area[]
  onParsed: (data: Partial<TareaInput>) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISO(d: Date) { return d.toISOString().split('T')[0] }

// ─── Fecha ────────────────────────────────────────────────────────────────────
function detectarFecha(lower: string): string | null {
  const today = new Date()

  if (/pasado\s+mañana/.test(lower)) {
    const d = new Date(today); d.setDate(d.getDate() + 2); return toISO(d)
  }
  if (/mañana/.test(lower)) {
    const d = new Date(today); d.setDate(d.getDate() + 1); return toISO(d)
  }
  if (/\bhoy\b/.test(lower)) return toISO(today)
  if (/esta\s+semana/.test(lower)) {
    const d = new Date(today)
    const fri = 5 - d.getDay(); d.setDate(d.getDate() + (fri <= 0 ? fri + 7 : fri)); return toISO(d)
  }
  if (/próxima\s+semana|proxima\s+semana/.test(lower)) {
    const d = new Date(today); d.setDate(d.getDate() + (8 - d.getDay())); return toISO(d)
  }

  const dayMap: Record<string, number> = {
    lunes: 1, martes: 2, 'miércoles': 3, miercoles: 3,
    jueves: 4, viernes: 5, 'sábado': 6, sabado: 6, domingo: 0,
  }
  for (const [name, num] of Object.entries(dayMap)) {
    if (lower.includes(name)) {
      const d = new Date(today); let diff = num - d.getDay()
      if (diff <= 0) diff += 7; d.setDate(d.getDate() + diff); return toISO(d)
    }
  }

  const meses: Record<string, number> = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
  }
  const mFull = lower.match(
    /el\s+(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/
  )
  if (mFull) {
    const d = new Date(today.getFullYear(), meses[mFull[2]], parseInt(mFull[1]))
    if (d < today) d.setFullYear(d.getFullYear() + 1); return toISO(d)
  }

  const mDay = lower.match(/\bel\s+(\d{1,2})\b/)
  if (mDay) {
    const day = parseInt(mDay[1])
    if (day >= 1 && day <= 31) {
      const d = new Date(today.getFullYear(), today.getMonth(), day)
      if (d <= today) d.setMonth(d.getMonth() + 1); return toISO(d)
    }
  }
  return null
}

// ─── Área ─────────────────────────────────────────────────────────────────────
function detectarArea(lower: string, areas: Area[]): string | null {
  // 1. Nombre directo
  for (const a of areas) {
    if (lower.includes(a.nombre.toLowerCase())) return a.id
  }
  // 2. Keywords por área
  const kw: Record<string, string[]> = {
    axa:      ['seguro', 'póliza', 'poliza', 'siniestro', 'mediador', 'mútua', 'mutua', 'aseguradora', 'cliente axa'],
    opa:      ['oposici', 'concurso', 'badajoz', 'mérida', 'merida', 'extremadura', 'temario', 'tema ', 'examen'],
    neting:   ['neting', 'marketing', 'campaña', 'campaña', 'redes sociales', 'instagram', 'facebook', 'web '],
    personal: ['médico', 'medico', 'dentista', 'familia', 'colegio', 'cumpleaños', 'vacaciones', 'casa ', 'recado', 'compra'],
  }
  for (const [name, words] of Object.entries(kw)) {
    for (const w of words) {
      if (lower.includes(w)) {
        return areas.find(a => a.nombre.toLowerCase() === name)?.id ?? null
      }
    }
  }
  return null
}

// ─── Prioridad ────────────────────────────────────────────────────────────────
function detectarPrioridad(lower: string): 'alta' | 'media' | 'baja' {
  if (/urgente|crítico|critico|asap|inmediato|ya mismo/.test(lower)) return 'alta'
  if (/sin prisa|cuando pueda|baja prioridad|no\s+es\s+urgente/.test(lower)) return 'baja'
  return 'media'
}

// ─── Tags ─────────────────────────────────────────────────────────────────────
const TAG_SKIP = new Set(['axa', 'opa', 'neting', 'personal', 'la', 'el', 'los', 'las', 'un', 'una', 'de', 'del'])

function detectarTags(lower: string): string[] {
  const tags: string[] = []
  // "y es de un CONCEPTO", "es de tipo CONCEPTO", "es de CONCEPTO"
  const patterns = [
    /\bes\s+de\s+(?:un\s+|una\s+)?(\w+)/g,
    /\bde\s+tipo\s+(\w+)/g,
  ]
  for (const pat of patterns) {
    let m; pat.lastIndex = 0
    while ((m = pat.exec(lower)) !== null) {
      const t = m[1]
      if (t.length > 2 && !TAG_SKIP.has(t)) tags.push(t)
    }
  }
  return Array.from(new Set(tags))
}

// ─── Título limpio ────────────────────────────────────────────────────────────
const FILLER_START = /^(tengo\s+que|hay\s+que|necesito|necesitas|quiero|quieres|debo|voy\s+a|recuerda(?:me)?|añade|agrega|crea|nueva\s+tarea[:\s]*|por\s+favor\s+)/i

// Puntos de corte: en cuanto aparecen, el título termina ahí
const TITLE_CUTOFFS = [
  /,?\s+para\s+(mañana|pasado|el\s+\w+|este|esta|el\s+\d)/i,
  /,?\s+(?:y\s+)?es\s+de\b/i,
  /,?\s+(?:y\s+)?es\s+para\b/i,
  /,?\s+(?:y\s+)?de\s+(?:tipo|área|area)\b/i,
  /,?\s+(?:y\s+)?urgente\b/i,
  /,?\s+(?:y\s+)?para\s+axa\b/i,
  /,?\s+(?:y\s+)?para\s+opa\b/i,
  /,?\s+(?:y\s+)?para\s+neting\b/i,
  /,?\s+(?:y\s+)?para\s+personal\b/i,
  /,?\s+(el\s+\d{1,2}\s+de\s+\w+)/i,
  /,?\s+(el\s+lunes|el\s+martes|el\s+miércoles|el\s+jueves|el\s+viernes|el\s+sábado|el\s+domingo)/i,
  /,?\s+a\s+las\s+\d/i,
]

function extraerTitulo(text: string): string {
  let t = text.trim()

  // Eliminar filler del inicio
  t = t.replace(FILLER_START, '').trim()

  // Cortar en el primer punto de corte que encontremos
  let cutAt = t.length
  for (const re of TITLE_CUTOFFS) {
    re.lastIndex = 0
    const m = re.exec(t)
    if (m && m.index > 5 && m.index < cutAt) cutAt = m.index
  }
  t = t.substring(0, cutAt).replace(/,\s*$/, '').trim()

  // Capitalizar
  if (t) t = t.charAt(0).toUpperCase() + t.slice(1)
  // Truncar si es muy largo
  if (t.length > 72) t = t.substring(0, 69).trim() + '...'
  return t
}

// ─── Parser principal ─────────────────────────────────────────────────────────
function parsear(text: string, areas: Area[]): Partial<TareaInput> {
  const lower = text.toLowerCase()

  const titulo          = extraerTitulo(text) || text.trim()
  const descripcion     = text.trim()   // Texto completo como descripción
  const fecha_vencimiento = detectarFecha(lower)
  const prioridad       = detectarPrioridad(lower)
  const area_id         = detectarArea(lower, areas)
  const etiquetas       = detectarTags(lower)

  // Hora → notas
  const timeM = text.match(/a las\s+(\d{1,2}(?:[:\s]\d{2})?h?)/i)
  const notas = timeM ? `🕐 ${timeM[0].trim()}` : null

  return {
    titulo,
    descripcion,
    fecha_vencimiento,
    prioridad,
    area_id,
    etiquetas,
    notas,
    estado: 'pendiente',
    orden: 0,
    recurrente: false,
    recurrencia: null,
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function QuickAdd({ areas, onParsed }: QuickAddProps) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim()) return
    onParsed(parsear(text.trim(), areas))
    setText('')
  }

  return (
    <div
      className="mb-6 rounded-2xl px-5 pt-4 pb-3"
      style={{
        background: 'linear-gradient(135deg, #081524 0%, #0d2137 60%, #112a45 100%)',
        border: '1px solid rgba(74,155,181,0.18)',
        boxShadow: '0 4px 24px rgba(13,33,55,0.4)',
      }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: 'rgba(196,166,97,0.8)', letterSpacing: '0.12em' }}>
        ✦ Añadir tarea rápida
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Ej: Revisar póliza de Tamudo para el viernes, es de AXA..."
          className="flex-1 rounded-xl px-4 text-sm outline-none h-10"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(74,155,181,0.22)',
            color: '#f0f5fa',
          }}
        />

        {text && (
          <button onClick={() => setText('')}
            className="flex-none w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <X size={14} style={{ color: 'rgba(168,213,226,0.55)' }} />
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="flex-none flex items-center gap-1.5 px-4 h-10 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
          style={{ background: '#c4a661', color: '#0d2137' }}
        >
          <Sparkles size={14} strokeWidth={2} />
          Añadir
        </button>
      </div>

      <p className="text-xs mt-2.5" style={{ color: 'rgba(168,213,226,0.38)' }}>
        Detecta fecha · área (AXA · OPA · Neting · Personal) · urgente — o dímelo en el chat y lo añado yo
      </p>
    </div>
  )
}
