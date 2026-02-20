// ─────────────────────────────────────────────────────────────────────────────
// POST /api/subscribe — persists subscriber emails to Supabase Postgres
//
// Requires this table in Supabase (run once in the SQL editor):
//
//   CREATE TABLE IF NOT EXISTS subscribers (
//     id         BIGSERIAL PRIMARY KEY,
//     email      TEXT UNIQUE NOT NULL,
//     subscribed_at TIMESTAMPTZ DEFAULT NOW()
//   );
//   ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
//   CREATE POLICY "public insert" ON subscribers FOR INSERT WITH CHECK (true);
//
// TODO: Wire up Resend/SendGrid for the actual weekly digest emails.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

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

  const { error } = await supabase.from("subscribers").insert({ email })

  if (error) {
    // Postgres unique violation
    if (error.code === "23505") {
      return NextResponse.json({ message: "already subscribed" }, { status: 200 })
    }
    console.error("Subscribe error:", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }

  return NextResponse.json({ message: "subscribed" }, { status: 201 })
}
