import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  navy:   '#0d2137',
  ocean:  '#2c6e8a',
  light:  '#4a9bb5',
  gold:   '#c4a661',
  red:    '#dc3545',
  green:  '#22c55e',
  amber:  '#e07b39',
  muted:  '#5a7490',
  border: '#d4dde8',
  bg:     '#eef2f6',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function estadoLabel(e: string) {
  const map: Record<string, string> = {
    sin_empezar:       '⏳ Sin empezar',
    pendiente_cliente: '👤 Pdte. cliente',
    pendiente_cia:     '🏢 Pdte. CIA',
    completada:        '✅ Completado',
  }
  return map[e] ?? e
}

function prioridadLabel(p: string) {
  return p === 'alta' ? '🔴 Alta' : p === 'media' ? '🟡 Media' : '🟢 Baja'
}

function dateLabel(dateStr: string | null): { text: string; color: string } {
  if (!dateStr) return { text: '—', color: C.muted }
  const today = new Date(new Date().toDateString())
  const d = new Date(dateStr)
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff < 0)  return { text: `Vencida hace ${Math.abs(diff)}d`, color: C.red }
  if (diff === 0) return { text: 'HOY',                             color: C.gold }
  if (diff === 1) return { text: 'Mañana',                         color: C.amber }
  return { text: `en ${diff}d`, color: C.muted }
}

function isoWeek(d: Date) {
  const dt = new Date(d); dt.setHours(0, 0, 0, 0)
  dt.setDate(dt.getDate() + 4 - (dt.getDay() || 7))
  const yearStart = new Date(dt.getFullYear(), 0, 1)
  return Math.ceil((((dt.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

interface Tarea {
  id: string; titulo: string; prioridad: string; estado: string
  fecha_vencimiento: string | null
  area?: { nombre: string; color: string } | null
  subarea?: { nombre: string } | null
  etiquetas: string[]
}

// ─── Row builder ──────────────────────────────────────────────────────────────
function tareaRow(t: Tarea, shade = false) {
  const dl = dateLabel(t.fecha_vencimiento)
  return `
  <tr style="background:${shade ? '#f5f8fb' : '#fff'};border-bottom:1px solid ${C.border};">
    <td style="padding:10px 14px;vertical-align:top;">
      <p style="margin:0;font-size:13px;color:${C.navy};font-weight:500;line-height:1.4;">${t.titulo}</p>
      <div style="margin-top:3px;display:flex;gap:6px;flex-wrap:wrap;">
        ${t.area ? `<span style="font-size:10px;color:${t.area.color};font-weight:600;">● ${t.area.nombre}${t.subarea ? ' › ' + t.subarea.nombre : ''}</span>` : ''}
        ${t.etiquetas?.length ? t.etiquetas.map(tag => `<span style="font-size:10px;color:${C.ocean};background:rgba(44,110,138,0.10);padding:1px 6px;border-radius:8px;">#${tag}</span>`).join('') : ''}
      </div>
    </td>
    <td style="padding:10px 8px;font-size:11px;color:${C.muted};white-space:nowrap;vertical-align:top;">${prioridadLabel(t.prioridad)}</td>
    <td style="padding:10px 8px;font-size:11px;color:${C.muted};white-space:nowrap;vertical-align:top;">${estadoLabel(t.estado)}</td>
    <td style="padding:10px 8px;font-size:11px;font-weight:700;color:${dl.color};white-space:nowrap;vertical-align:top;">${dl.text}</td>
  </tr>`
}

const TABLE_HEAD = `
  <tr style="background:${C.navy};">
    <th style="padding:9px 14px;text-align:left;font-size:10px;color:#a8d5e2;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Tarea</th>
    <th style="padding:9px 8px;text-align:left;font-size:10px;color:#a8d5e2;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Prioridad</th>
    <th style="padding:9px 8px;text-align:left;font-size:10px;color:#a8d5e2;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Estado</th>
    <th style="padding:9px 8px;text-align:left;font-size:10px;color:#a8d5e2;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Plazo</th>
  </tr>`

function section(title: string, emoji: string, accentColor: string, items: Tarea[]) {
  if (!items.length) return ''
  return `
    <div style="margin-top:28px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${accentColor};text-transform:uppercase;letter-spacing:.08em;">
        ${emoji} ${title} <span style="font-size:11px;font-weight:400;color:${C.muted};">(${items.length})</span>
      </p>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid ${C.border};">
        <thead>${TABLE_HEAD}</thead>
        <tbody>${items.map((t, i) => tareaRow(t, i % 2 === 1)).join('')}</tbody>
      </table>
    </div>`
}

// ─── HTML builder ─────────────────────────────────────────────────────────────
function buildHTML(tareas: Tarea[]) {
  const now   = new Date()
  const today = now.toISOString().split('T')[0]

  // Week boundaries
  const dow     = now.getDay() || 7                           // Mon=1 … Sun=7
  const monThis = new Date(now); monThis.setDate(now.getDate() - dow + 1); monThis.setHours(0,0,0,0)
  const sunThis = new Date(monThis); sunThis.setDate(monThis.getDate() + 6)
  const monNext = new Date(monThis); monNext.setDate(monThis.getDate() + 7)
  const sunNext = new Date(monNext); sunNext.setDate(monNext.getDate() + 6)

  const fmt = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  const weekLabel = `${fmt(monThis)} – ${fmt(sunThis)}`
  const nextLabel = `${fmt(monNext)} – ${fmt(sunNext)}`
  const dayLabel  = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const thisEnd = sunThis.toISOString().split('T')[0]
  const nextEnd = sunNext.toISOString().split('T')[0]

  const vencidas   = tareas.filter(t => t.fecha_vencimiento && t.fecha_vencimiento < today)
  const paraHoy    = tareas.filter(t => t.fecha_vencimiento === today)
  const estaSeq    = tareas.filter(t => t.fecha_vencimiento && t.fecha_vencimiento > today && t.fecha_vencimiento <= thisEnd)
  const proxSeq    = tareas.filter(t => t.fecha_vencimiento && t.fecha_vencimiento > thisEnd && t.fecha_vencimiento <= nextEnd)
  const sinFecha   = tareas.filter(t => !t.fecha_vencimiento)

  const totalAlert = vencidas.length + paraHoy.length

  // KPI tiles
  const kpis = [
    { label: 'Vencidas',   value: vencidas.length,   color: C.red   },
    { label: 'Hoy',        value: paraHoy.length,    color: C.gold  },
    { label: 'Esta semana',value: estaSeq.length,    color: C.ocean },
    { label: 'Próx. semana',value: proxSeq.length,   color: C.muted },
  ]

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Mi Mundo — Digest semanal</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:28px 12px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

  <!-- Header -->
  <tr><td>
    <div style="background:linear-gradient(135deg,#081524 0%,#0d2137 50%,#1a3a5c 100%);border-radius:16px;padding:28px 32px 24px;">
      <p style="margin:0 0 6px;font-size:10px;color:rgba(168,213,226,0.55);text-transform:uppercase;letter-spacing:.14em;">⚓ Mi Mundo · Digest diario</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:600;color:#fff;font-family:Georgia,serif;text-transform:capitalize;">${dayLabel}</h1>
      <p style="margin:0;font-size:12px;color:rgba(168,213,226,0.65);">
        Semana actual: <strong style="color:#c4a661;">${weekLabel}</strong> &nbsp;·&nbsp; Siguiente: ${nextLabel}
      </p>
      ${totalAlert > 0 ? `
      <div style="margin-top:14px;background:rgba(220,53,69,0.18);border:1px solid rgba(220,53,69,0.4);border-radius:8px;padding:8px 14px;">
        <p style="margin:0;font-size:12px;color:#ff6b7a;font-weight:600;">
          ⚠️ ${totalAlert} tarea${totalAlert !== 1 ? 's' : ''} requiere${totalAlert !== 1 ? 'n' : ''} atención inmediata
        </p>
      </div>` : `
      <div style="margin-top:14px;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:8px 14px;">
        <p style="margin:0;font-size:12px;color:#4ade80;font-weight:600;">✓ Todo al día — sin vencimientos urgentes</p>
      </div>`}
    </div>
  </td></tr>

  <!-- KPI row -->
  <tr><td style="padding:10px 0;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      ${kpis.map((k, i) => `
      <td style="padding:0 ${i < 3 ? '4px 0 0' : '0'};">
        <div style="background:#fff;border:1px solid ${C.border};border-radius:12px;padding:14px 10px;text-align:center;">
          <p style="margin:0;font-size:24px;font-weight:700;color:${k.color};line-height:1;">${k.value}</p>
          <p style="margin:4px 0 0;font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:${C.muted};">${k.label}</p>
        </div>
      </td>`).join('')}
    </tr></table>
  </td></tr>

  <!-- Main card -->
  <tr><td>
    <div style="background:#fff;border-radius:16px;padding:24px 28px;border:1px solid ${C.border};">

      ${section('🚨 Vencidas — atención urgente', '🚨', C.red, vencidas)}
      ${section('🎯 Para hoy', '📌', C.gold, paraHoy)}
      ${section(`📅 Esta semana (${weekLabel})`, '📅', C.ocean, estaSeq)}
      ${section(`🔭 Próxima semana (${nextLabel})`, '🔭', C.muted, proxSeq)}
      ${sinFecha.length > 0 ? section('📋 Sin fecha asignada', '📋', C.muted, sinFecha.slice(0, 15)) : ''}

      ${!vencidas.length && !paraHoy.length && !estaSeq.length && !proxSeq.length ? `
      <div style="text-align:center;padding:32px 0;">
        <p style="font-size:32px;margin:0;">🎉</p>
        <p style="margin:8px 0 0;font-size:15px;font-weight:600;color:${C.navy};">¡Agenda despejada!</p>
        <p style="margin:4px 0 0;font-size:13px;color:${C.muted};">No tienes tareas pendientes con fecha para las próximas dos semanas.</p>
      </div>` : ''}

      <!-- Quote -->
      <div style="margin-top:28px;padding:20px 24px;background:linear-gradient(135deg,#081524,#1a3a5c);border-radius:12px;text-align:center;">
        <p style="margin:0;font-size:13px;font-style:italic;color:#a8d5e2;line-height:1.6;">
          &ldquo;La disciplina es el puente entre las metas y los logros.&rdquo;
        </p>
        <p style="margin:8px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:${C.gold};">Jim Rohn</p>
      </div>

    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 0;text-align:center;">
    <p style="margin:0;font-size:11px;color:${C.muted};">⚓ Mi Mundo · Panel personal inteligente</p>
    <p style="margin:4px 0 0;font-size:10px;color:${C.muted};opacity:.6;">Enviado automáticamente cada mañana de lunes a viernes a las 7:00h</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Route ────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const RESEND_KEY  = process.env.RESEND_API_KEY   ?? ''
  const EMAIL_TO    = process.env.DIGEST_EMAIL_TO  ?? ''
  const EMAIL_FROM  = process.env.DIGEST_EMAIL_FROM ?? 'Mi Mundo <onboarding@resend.dev>'
  const CRON_SECRET = process.env.CRON_SECRET       ?? ''

  // ── Auth: accept Vercel's built-in cron header OR manual x-cron-secret ──
  const authHeader  = req.headers.get('authorization') ?? ''
  const xSecret     = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret') ?? ''
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? ''

  const validVercel = bypassSecret && authHeader === `Bearer ${bypassSecret}`
  const validManual = CRON_SECRET && xSecret === CRON_SECRET
  const noAuth      = !CRON_SECRET && !bypassSecret   // dev / open mode

  if (!validVercel && !validManual && !noAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Fetch tasks ────────────────────────────────────────────────────────────
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabaseClient
    .from('tareas')
    .select('id, titulo, prioridad, estado, fecha_vencimiento, etiquetas, area:areas(nombre, color), subarea:subareas(nombre)')
    .not('estado', 'eq', 'completada')
    .order('prioridad', { ascending: true })
    .order('fecha_vencimiento', { ascending: true, nullsFirst: false })

  const tareas = (data ?? []) as Tarea[]
  const html   = buildHTML(tareas)

  // ── Preview mode (no API key) ──────────────────────────────────────────────
  if (!RESEND_KEY) {
    return NextResponse.json({
      ok: true, preview: true,
      message: 'RESEND_API_KEY no configurada',
      tasks: tareas.length,
    })
  }

  // ── Send via Resend ────────────────────────────────────────────────────────
  const today   = new Date()
  const subject = `⚓ Mi Mundo · ${today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: [EMAIL_TO], subject, html }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[email-digest] Resend error:', err)
    return NextResponse.json({ error: err }, { status: 500 })
  }

  const sent = await res.json()
  console.log('[email-digest] Sent:', sent.id, '→', EMAIL_TO)
  return NextResponse.json({ ok: true, id: sent.id, tasks: tareas.length })
}
