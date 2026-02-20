import { NextRequest, NextResponse } from "next/server"
import { fetchEventbriteEvents } from "@/lib/sources/eventbrite"

export async function POST(req: NextRequest) {
  // Verify sync secret
  const secret = req.headers.get("x-sync-secret")
  if (!secret || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { fetched, upserted } = await fetchEventbriteEvents()
    console.log(`[eventbrite sync] fetched=${fetched} upserted=${upserted}`)
    return NextResponse.json({ success: true, count: upserted, fetched })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[eventbrite sync] error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
