import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Colors
const C = {
  navy:   '#0d2137',
  ocean:  '#2c6e8a',
  light:  '#4a9bb5',
  gold:   '#c4a661',
  red:    '#dc3545',
  green:  '#28a745',
  amber:  '#e07b39',
  muted:  '#5a7490',
  border: '#d4dde8',
  bg:     '#eef2f6',
}

function prioridadLabel(p: string) {
  return p === 'alta' ? '🔴 Alta' : p === 'media' ? '🟡 Media' : '🟢 Baja'
}

function estadoLabel(e: string) {
  return e === 'en_progreso' ? '🔄 En progreso' : e === 'bloqueada' ? '🔒 Bloqueada' : '⏳ Pendiente'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function daysDiff(dateStr: string) {
  const today = new Date(new Date().toDateString())
  const d = new Date(dateStr)
  return Math.round((d.getTime() - today.getTime()) / 86400000)
}

interface Tarea {
  id: string; titulo: string; prioridad: string; estado: string
  fecha_vencimiento: string | null; area?: { nombre: string; color: string } | null
  etiquetas: string[]
}

function tareaRow(t: Tarea, highlight = false) {
  const diff = t.fecha_vencimiento ? daysDiff(t.fecha_vencimiento) : null
  const dateColor = diff !== null ? (diff < 0 ? C.red : diff === 0 ? C.gold : diff <= 3 ? C.amber : C.muted) : C.muted
  const dateText = diff !== null
    ? (diff < 0 ? `Vencida hace ${Math.abs(diff)}d` : diff === 0 ? 'HOY' : diff === 1 ? 'Mañana' : `en ${diff} días`)
    : '—'

  return `
  <tr style="background:${highlight ? '#f0f6fa' : '#fff'}; border-bottom:1px solid ${C.border};">
    <td style="padding:10px 12px; vertical-align:top;">
      <p style="margin:0;font-size:13px;color:${C.navy};font-weight:500;">${t.titulo}</p>
      ${t.area ? `<span style="font-size:11px;color:${t.area.color};margin-top:2px;display:inline-block;">● ${t.area.nombre}</span>` : ''}
    </td>
    <td style="padding:10px 8px;font-size:11px;color:${C.muted};white-space:nowrap;">${prioridadLabel(t.prioridad)}</td>
    <td style="padding:10px 8px;font-size:11px;color:${C.muted};white-space:nowrap;">${estadoLabel(t.estado)}</td>
    <td style="padding:10px 8px;font-size:11px;font-weight:600;color:${dateColor};white-space:nowrap;">${dateText}</td>
  </tr>`
}

function buildHTML(
  paraHoy: Tarea[], vencidas: Tarea[], proximas: Tarea[], pendientes: Tarea[]
): string {
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const hoyLabel = hoy.charAt(0).toUpperCase() + hoy.slice(1)

  const tableHeader = `
    <tr style="background:${C.navy};">
      <th style="padding:8px 12px;text-align:left;font-size:11px;color:#a8d5e2;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Tarea</th>
      <th style="padding:8px;font-size:11px;color:#a8d5e2;text-align:left;font-weight:600;text-transform:uppercase;">Prioridad</th>
      <th style="padding:8px;font-size:11px;color:#a8d5e2;text-align:left;font-weight:600;text-transform:uppercase;">Estado</th>
      <th style="padding:8px;font-size:11px;color:#a8d5e2;text-align:left;font-weight:600;text-transform:uppercase;">Plazo</th>
    </tr>`

  function section(title: string, emoji: string, accentColor: string, items: Tarea[], highlight = false) {
    if (!items.length) return ''
    return `
    <h3 style="margin:24px 0 8px;font-size:14px;font-weight:700;color:${accentColor};text-transform:uppercase;letter-spacing:0.08em;">
      ${emoji} ${title} <span style="font-size:12px;font-weight:400;color:${C.muted};">(${items.length})</span>
    </h3>
    <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid ${C.border};">
      <thead>${tableHeader}</thead>
      <tbody>${items.map(t => tareaRow(t, highlight)).join('')}</tbody>
    </table>`
  }

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Mi Mundo — Digest diario</title></head>
<body style="margin:0;padding:0;background:${C.bg};font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td>
    <div style="background:linear-gradient(135deg,#081524 0%,#0d2137 40%,#1a3a5c 100%);border-radius:16px;padding:28px 32px;margin-bottom:0;">
      <p style="margin:0 0 4px;font-size:11px;color:rgba(168,213,226,0.65);text-transform:uppercase;letter-spacing:0.12em;">Mi Mundo · Digest diario</p>
      <h1 style="margin:0 0 4px;font-size:24px;font-weight:600;color:#fff;font-family:Georgia,serif;">${hoyLabel}</h1>
      <p style="margin:0;font-size:13px;color:rgba(168,213,226,0.75);font-style:italic;">
        ${paraHoy.length} para hoy · ${vencidas.length} vencidas · ${proximas.length} próximas
      </p>
    </div>
  </td></tr>

  <!-- Stats row -->
  <tr><td>
    <table width="100%" style="margin:12px 0;border-collapse:collapse;">
    <tr>
      ${[
        { label: 'Para HOY', value: paraHoy.length, color: C.gold },
        { label: 'Vencidas', value: vencidas.length, color: C.red },
        { label: 'Esta semana', value: proximas.length, color: C.ocean },
        { label: 'Total pendientes', value: pendientes.length, color: C.muted },
      ].map((s, idx) => `
        <td style="padding:4px 4px 0 ${idx === 0 ? '0' : '4'}px;">
          <div style="background:#fff;border:1px solid ${C.border};border-radius:12px;padding:12px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;color:${s.color};">${s.value}</p>
            <p style="margin:2px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:${C.muted};">${s.label}</p>
          </div>
        </td>`).join('')}
    </tr>
    </table>
  </td></tr>

  <!-- Main content -->
  <tr><td style="background:#fff;border-radius:16px;padding:24px 28px;border:1px solid ${C.border};">

    ${section('⚡ Para hoy', '🎯', C.gold, paraHoy, true)}
    ${section('Vencidas — Atención urgente', '🚨', C.red, vencidas)}
    ${section('Próximos 7 días', '📅', C.ocean, proximas)}
    ${pendientes.length > 0 ? `
    <h3 style="margin:24px 0 8px;font-size:14px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">
      📋 Resto de pendientes <span style="font-size:12px;font-weight:400;">(${pendientes.length})</span>
    </h3>
    <table style="width:100%;border-collapse:collapse;border:1px solid ${C.border};border-radius:12px;overflow:hidden;">
      <thead>${tableHeader}</thead>
      <tbody>${pendientes.map(t => tareaRow(t)).join('')}</tbody>
    </table>` : ''}

    <!-- Motivational quote -->
    <div style="margin-top:24px;padding:20px;background:linear-gradient(135deg,#0d2137,#1a3a5c);border-radius:12px;text-align:center;">
      <p style="margin:0;font-size:13px;font-style:italic;color:#a8d5e2;">
        &ldquo;El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje para continuar.&rdquo;
      </p>
      <p style="margin:8px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:${C.gold};">Winston Churchill</p>
    </div>

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 0;text-align:center;">
    <p style="margin:0;font-size:11px;color:${C.muted};">
      ⚓ Mi Mundo · Tu panel personal inteligente
    </p>
    <p style="margin:4px 0 0;font-size:10px;color:${C.muted};opacity:0.6;">
      Este email se envía automáticamente cada mañana a las 7:00h
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  // Init at runtime (not module level) to avoid build errors
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const EMAIL_TO       = process.env.DIGEST_EMAIL_TO ?? ''
  const EMAIL_FROM     = process.env.DIGEST_EMAIL_FROM ?? 'Mi Mundo <onboarding@resend.dev>'
  const CRON_SECRET    = process.env.CRON_SECRET ?? ''

  // Security check
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch tasks
  const today = new Date().toISOString().split('T')[0]
  const week  = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

  const { data: allTareas } = await supabase
    .from('tareas')
    .select('*, area:areas(nombre, color)')
    .not('estado', 'eq', 'completada')
    .order('prioridad')
    .order('fecha_vencimiento', { ascending: true, nullsFirst: false })

  const tareas: Tarea[] = (allTareas ?? []) as Tarea[]

  const paraHoy  = tareas.filter(t => t.fecha_vencimiento === today)
  const vencidas = tareas.filter(t => t.fecha_vencimiento && t.fecha_vencimiento < today)
  const proximas = tareas.filter(t =>
    t.fecha_vencimiento &&
    t.fecha_vencimiento > today &&
    t.fecha_vencimiento <= week
  )
  const resto = tareas.filter(t =>
    !t.fecha_vencimiento ||
    (t.fecha_vencimiento > week)
  )

  const html = buildHTML(paraHoy, vencidas, proximas, resto)

  if (!RESEND_API_KEY) {
    return NextResponse.json({
      ok: true,
      preview: true,
      message: 'RESEND_API_KEY no configurada. Añádela en las variables de entorno de Vercel.',
      stats: { paraHoy: paraHoy.length, vencidas: vencidas.length, proximas: proximas.length, resto: resto.length }
    })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [EMAIL_TO],
      subject: `⚓ Mi Mundo · ${paraHoy.length} tareas para hoy — ${new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ ok: true, id: data.id, stats: { paraHoy: paraHoy.length, vencidas: vencidas.length, proximas: proximas.length } })
}
