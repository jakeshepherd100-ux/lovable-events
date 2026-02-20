// ─────────────────────────────────────────────────────────────────────────────
// POST /api/subscribe — captures subscriber emails to data/subscribers.json
//
// ⚠️  VERCEL NOTE: The filesystem is read-only in Vercel serverless functions,
// so writes to data/subscribers.json will NOT persist between deployments or
// invocations. Before shipping the digest feature, replace this with a proper
// store — Vercel Postgres, Vercel KV, Supabase, or a service like Resend
// (which has a built-in audience/contact list).
//
// TODO: Wire up Resend / SendGrid / Loops for actual email sending.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join, dirname } from "path"

const DB_PATH = join(process.cwd(), "data", "subscribers.json")

type Subscriber = {
  email: string
  subscribed_at: string
}

function readSubscribers(): Subscriber[] {
  if (!existsSync(DB_PATH)) return []
  try {
    return JSON.parse(readFileSync(DB_PATH, "utf8"))
  } catch {
    return []
  }
}

function writeSubscribers(subscribers: Subscriber[]) {
  mkdirSync(dirname(DB_PATH), { recursive: true })
  writeFileSync(DB_PATH, JSON.stringify(subscribers, null, 2))
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const email = String(body.email ?? "").trim().toLowerCase()

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }

  const subscribers = readSubscribers()

  if (subscribers.some((s) => s.email === email)) {
    return NextResponse.json({ message: "already subscribed" }, { status: 200 })
  }

  subscribers.push({ email, subscribed_at: new Date().toISOString() })
  writeSubscribers(subscribers)

  return NextResponse.json({ message: "subscribed" }, { status: 201 })
}
