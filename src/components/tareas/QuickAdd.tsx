'use client'
import { useState, useRef } from 'react'
import { Mic, MicOff, Sparkles, X } from 'lucide-react'
import type { Area, TareaInput } from '@/lib/tareas'

interface QuickAddProps {
  areas: Area[]
  onParsed: (data: Partial<TareaInput>) => void
}

// ─── Spanish NLP parser ────────────────────────────────────────────────────
function parseTaskText(text: string, areas: Area[]): Partial<TareaInput> {
  const lower = text.toLowerCase()
  const today = new Date()
  const toISO = (d: Date) => d.toISOString().split('T')[0]

  // ── Fecha ────────────────────────────────────────────────────────────────
  let fecha_vencimiento: string | null = null

  if (/pasado\s+mañana/.test(lower)) {
    const d = new Date(today); d.setDate(d.getDate() + 2); fecha_vencimiento = toISO(d)
  } else if (/mañana/.test(lower)) {
    const d = new Date(today); d.setDate(d.getDate() + 1); fecha_vencimiento = toISO(d)
  } else if (/\bhoy\b/.test(lower)) {
    fecha_vencimiento = toISO(today)
  } else if (/esta\s+semana/.test(lower)) {
    const d = new Date(today)
    const fri = 5 - d.getDay()
    d.setDate(d.getDate() + (fri <= 0 ? fri + 7 : fri))
    fecha_vencimiento = toISO(d)
  } else if (/próxima\s+semana|proxima\s+semana/.test(lower)) {
    const d = new Date(today)
    d.setDate(d.getDate() + (8 - d.getDay()))
    fecha_vencimiento = toISO(d)
  }

  // Día de la semana
  if (!fecha_vencimiento) {
    const dayMap: Record<string, number> = {
      lunes: 1, martes: 2, 'miércoles': 3, miercoles: 3,
      jueves: 4, viernes: 5, 'sábado': 6, sabado: 6, domingo: 0,
    }
    for (const [name, num] of Object.entries(dayMap)) {
      if (lower.includes(name)) {
        const d = new Date(today)
        let diff = num - d.getDay()
        if (diff <= 0) diff += 7
        d.setDate(d.getDate() + diff)
        fecha_vencimiento = toISO(d)
        break
      }
    }
  }

  // "el 15 de mayo/junio/..."
  if (!fecha_vencimiento) {
    const meses: Record<string, number> = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
    }
    const m = lower.match(
      /el\s+(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/
    )
    if (m) {
      const d = new Date(today.getFullYear(), meses[m[2]], parseInt(m[1]))
      if (d < today) d.setFullYear(d.getFullYear() + 1)
      fecha_vencimiento = toISO(d)
    }
  }

  // "el 15"
  if (!fecha_vencimiento) {
    const m = lower.match(/\bel\s+(\d{1,2})\b/)
    if (m) {
      const day = parseInt(m[1])
      if (day >= 1 && day <= 31) {
        const d = new Date(today.getFullYear(), today.getMonth(), day)
        if (d <= today) d.setMonth(d.getMonth() + 1)
        fecha_vencimiento = toISO(d)
      }
    }
  }

  // ── Prioridad ─────────────────────────────────────────────────────────────
  let prioridad: 'alta' | 'media' | 'baja' = 'media'
  if (/urgente|crítico|critico|asap|inmediato|ya mismo|\bya\b/.test(lower)) prioridad = 'alta'
  else if (/sin prisa|cuando pueda|baja prioridad|no\s+es\s+urgente/.test(lower)) prioridad = 'baja'

  // ── Área ──────────────────────────────────────────────────────────────────
  let area_id: string | null = null

  // Buscar nombre de área directamente en el texto
  for (const a of areas) {
    if (lower.includes(a.nombre.toLowerCase())) {
      area_id = a.id; break
    }
  }

  // Keywords si no se detectó por nombre
  if (!area_id) {
    const kwMap: Record<string, string[]> = {
      axa:     ['seguro', 'póliza', 'poliza', 'siniestro', 'mediador', 'mútua', 'mutua', 'aseguradora'],
      opa:     ['oposici', 'concurso', 'badajoz', 'mérida', 'merida', 'extremadura', 'temario'],
      neting:  ['neting', 'marketing', 'campaña', 'web', 'redes sociales', 'instagram', 'cliente neting'],
      personal: ['médico', 'medico', 'dentista', 'familia', 'colegio', 'cumpleaños', 'vacaciones', 'casa', 'recado'],
    }
    outer: for (const [areaName, words] of Object.entries(kwMap)) {
      for (const w of words) {
        if (lower.includes(w)) {
          area_id = areas.find(a => a.nombre.toLowerCase() === areaName)?.id ?? null
          if (area_id) break outer
        }
      }
    }
  }

  // ── Hora → notas ──────────────────────────────────────────────────────────
  const timeM = text.match(/a las\s+(\d{1,2}(?:[:\s]\d{2})?h?)/i)
  const notas = timeM ? `🕐 ${timeM[0].trim()}` : null

  // ── Limpiar título ────────────────────────────────────────────────────────
  let titulo = text
    .replace(/pasado\s+mañana/gi, '')
    .replace(/\bmañana\b|\bhoy\b|esta\s+semana|próxima\s+semana|proxima\s+semana/gi, '')
    .replace(/el\s+\d{1,2}\s+de\s+\w+/gi, '')
    .replace(/\bel\s+\d{1,2}\b/gi, '')
    .replace(/(el\s+)?(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)/gi, '')
    .replace(/a las\s+\d{1,2}(?:[:\s]\d{2})?h?/gi, '')
    .replace(/\burgente\b|\bcrítico\b|\bcritico\b|\basap\b|\binmediato\b/gi, '')
    .replace(/\bsin\s+prisa\b|\bcuando\s+pueda\b/gi, '')
    .replace(/para\s+(axa|opa|neting|personal)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  // Capitalizar primera letra
  if (titulo) titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1)

  return {
    titulo,
    fecha_vencimiento,
    prioridad,
    area_id,
    notas,
    etiquetas: [],
    estado: 'pendiente',
    orden: 0,
    recurrente: false,
    recurrencia: null,
    descripcion: null,
  }
}

// ─── Componente ────────────────────────────────────────────────────────────
export default function QuickAdd({ areas, onParsed }: QuickAddProps) {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const startVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.')
      return
    }
    const r = new SR()
    r.lang = 'es-ES'
    r.continuous = false
    r.interimResults = false
    r.onstart = () => setListening(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      setText(e.results[0][0].transcript)
      setListening(false)
    }
    r.onerror = () => setListening(false)
    r.onend   = () => setListening(false)
    r.start()
    recognitionRef.current = r
  }

  const stopVoice = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const handleSubmit = () => {
    if (!text.trim()) return
    const parsed = parseTaskText(text.trim(), areas)
    onParsed(parsed)
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
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(196,166,97,0.8)', letterSpacing: '0.12em' }}>
        ✦ Añadir tarea rápida
      </p>

      <div className="flex gap-2">
        {/* Mic */}
        <button
          onClick={listening ? stopVoice : startVoice}
          className="flex-none w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: listening ? 'rgba(220,53,69,0.18)' : 'rgba(196,166,97,0.12)',
            border: `1px solid ${listening ? 'rgba(220,53,69,0.45)' : 'rgba(196,166,97,0.28)'}`,
          }}
          title={listening ? 'Detener grabación' : 'Dictar por voz (Chrome)'}
        >
          {listening
            ? <MicOff size={16} style={{ color: '#dc3545' }} />
            : <Mic    size={16} style={{ color: '#c4a661' }} />}
        </button>

        {/* Input */}
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={
            listening
              ? '🎤 Escuchando...'
              : 'Ej: Llamar a Pepito el martes a las 10h urgente para AXA...'
          }
          className="flex-1 rounded-xl px-4 py-0 text-sm outline-none h-10"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${listening ? 'rgba(220,53,69,0.35)' : 'rgba(74,155,181,0.22)'}`,
            color: '#f0f5fa',
          }}
        />

        {/* Clear */}
        {text && (
          <button
            onClick={() => setText('')}
            className="flex-none w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <X size={14} style={{ color: 'rgba(168,213,226,0.55)' }} />
          </button>
        )}

        {/* Submit */}
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
        Detecta automáticamente: día · hora · urgente · área (AXA · OPA · Neting · Personal)
      </p>
    </div>
  )
}
