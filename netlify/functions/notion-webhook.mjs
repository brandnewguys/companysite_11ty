// Notion → Indy webhook receiver.
//
// Flow:
//   1. Notion POSTs an event to /notion/webhook (this file).
//   2. On first-time registration, Notion sends a `verification_token` in the
//      body. We log it and return 200 so the operator can copy that token
//      into the Notion Developer Portal to complete webhook setup, then set it
//      as NOTION_WEBHOOK_SECRET in Netlify env vars.
//   3. On subsequent events, we HMAC-verify the payload with
//      NOTION_WEBHOOK_SECRET (the verification_token), then act on it.
//   4. For `comment.created` events on tasks: if the author is not Indy
//      itself (loop prevention), fetch the task + thread context, generate an
//      Indy-toned reply via Claude, and post it back as a Notion comment.
//   5. Fire a Telegram nudge to Cye so he can see the exchange in real time.
//
// Required Netlify env vars:
//   NOTION_TOKEN            — Indy integration token (same one Indy uses locally)
//   NOTION_WEBHOOK_SECRET   — verification_token from first Notion webhook ping
//   ANTHROPIC_API_KEY       — for Claude to generate replies
//   TELEGRAM_BOT_TOKEN      — optional; nudges Cye when a reply is posted
//   TELEGRAM_CHAT_ID        — optional; his chat id
//
// URL: brandnewguys.co/notion/webhook  (see `config.path` below)

import crypto from 'node:crypto'

const INDY_USER_ID = '31c6e23b-ed63-81d9-98c4-0027743bc165'
const CYE_USER_ID  = '5e95f036-e802-4779-95a6-db26c4dbfdd8'

const NOTION_VERSION = '2022-06-28'
const CLAUDE_MODEL   = 'claude-sonnet-4-5'  // balanced default; can bump to opus for higher-stakes threads

// -------- HTTP helpers --------
async function notionAPI(path, { method = 'GET', body } = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Notion ${method} ${path} → ${res.status}: ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

async function callClaude(system, userMessage) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Claude ${res.status}: ${text.slice(0, 300)}`)
  const data = JSON.parse(text)
  return data.content?.[0]?.text ?? ''
}

async function nudgeTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat  = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ chat_id: chat, text: message }),
    })
  } catch (e) { console.error('telegram nudge failed:', e.message) }
}

// -------- Signature verify --------
function verifySignature(rawBody, signatureHeader) {
  const secret = process.env.NOTION_WEBHOOK_SECRET
  if (!secret) return false
  if (!signatureHeader) return false
  const computed = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  // constant-time compare
  const a = Buffer.from(signatureHeader)
  const b = Buffer.from(computed)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// -------- Comment context fetch --------
async function fetchThreadContext(pageId) {
  // Get the task (page) properties
  const page = await notionAPI(`/pages/${pageId}`)
  const titleProp = Object.entries(page.properties || {}).find(([, p]) => p.type === 'title')
  const title = titleProp ? titleProp[1].title.map(t => t.plain_text).join('') : '(untitled)'

  // Get the description if present
  let description = ''
  const descProp = page.properties?.['Task Description']
  if (descProp?.rich_text) {
    description = descProp.rich_text.map(r => r.plain_text).join('')
  }

  // Get all comments on the page (thread)
  const commentsRes = await notionAPI(`/comments?block_id=${pageId}`)
  const comments = (commentsRes.results || []).map(c => ({
    author_id: c.created_by?.id,
    author_role: c.created_by?.id === INDY_USER_ID ? 'Indy' : (c.created_by?.id === CYE_USER_ID ? 'Cye' : 'unknown'),
    text: (c.rich_text || []).map(r => r.plain_text).join(''),
    created: c.created_time,
  }))

  return { title, description, comments, url: page.url }
}

// -------- Indy persona for Claude --------
const INDY_SYSTEM = `You are Indy, Cye's producing colleague. You reply to a Notion comment thread on one of Cye's tasks.

Rules you follow strictly:
- No em-dashes. Ever.
- No AI cliches ("Certainly!", "Great question!", "I'd be happy to", "As an AI").
- No sycophancy.
- No excessive apologies. If you got something wrong, fix it and move on.
- Don't narrate what you're about to do. Just do it.
- If you don't know something, say so plainly.
- Reply in the language of the last comment (Dutch or English).
- Keep replies short and useful. This is a Notion comment thread, not an essay.
- Attach concrete next steps or drafts when useful. Otherwise just respond directly.

Your job on this thread: read the task context and comment history, then reply to the newest comment from Cye. Move the work forward.`

// -------- Main handler --------
export default async (req) => {
  const rawBody = await req.text()
  let payload
  try { payload = JSON.parse(rawBody) } catch { return new Response('bad json', { status: 400 }) }

  // 1. Verification handshake — first-ever POST from Notion contains verification_token
  if (payload.verification_token) {
    console.log('[Notion webhook] verification_token received:', payload.verification_token)
    console.log('[Notion webhook] → copy this into Netlify env var NOTION_WEBHOOK_SECRET, then complete registration in Notion Developer Portal')
    return new Response(JSON.stringify({ ok: true, note: 'verification_token logged; check Netlify function logs' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 2. Verify signature (for real events)
  const sig = req.headers.get('x-notion-signature')
  if (!verifySignature(rawBody, sig)) {
    console.error('[Notion webhook] signature verification failed')
    return new Response('unauthorized', { status: 401 })
  }

  const type = payload.type
  console.log('[Notion webhook] event:', type, payload.entity?.id)

  // 3. Route to comment.created only for MVP
  if (type !== 'comment.created') {
    return new Response('ignored', { status: 200 })
  }

  const commentId = payload.entity?.id
  const pageId    = payload.data?.parent?.id
  const authorId  = payload.authors?.[0]?.id

  // Loop prevention: don't respond to our own comments
  if (authorId === INDY_USER_ID) {
    console.log('[Notion webhook] ignored: authored by Indy (loop prevention)')
    return new Response('own comment', { status: 200 })
  }

  if (!pageId || !commentId) {
    console.error('[Notion webhook] missing pageId or commentId', payload)
    return new Response('missing fields', { status: 400 })
  }

  try {
    // 4. Fetch task + thread context
    const ctx = await fetchThreadContext(pageId)
    console.log(`[Notion webhook] processing thread on "${ctx.title}" (${ctx.comments.length} comments)`)

    // 5. Build the user message for Claude
    const commentHistory = ctx.comments
      .map(c => `[${c.author_role}] ${c.text}`)
      .join('\n\n')

    const userMsg = `Task title: ${ctx.title}
Task description: ${ctx.description || '(none)'}

Comment thread (oldest first):
${commentHistory}

Write your next reply as Indy. Do NOT prefix with "[Indy]" or your name; the reply becomes a Notion comment directly.`

    const reply = await callClaude(INDY_SYSTEM, userMsg)
    console.log('[Notion webhook] Claude reply:', reply.slice(0, 200))

    // 6. Post the reply as a new Notion comment on the same page
    await notionAPI('/comments', {
      method: 'POST',
      body: {
        parent: { page_id: pageId },
        rich_text: [{ type: 'text', text: { content: reply } }],
      },
    })

    // 7. Nudge Cye on Telegram
    await nudgeTelegram(`💬 Indy replied on "${ctx.title}"\n\n${reply.slice(0, 400)}\n\n${ctx.url}`)

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[Notion webhook] processing failed:', err.message)
    await nudgeTelegram(`⚠️ Indy webhook error: ${err.message}`)
    return new Response(`processing error: ${err.message}`, { status: 500 })
  }
}

export const config = { path: '/notion/webhook' }
