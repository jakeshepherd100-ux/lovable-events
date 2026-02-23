import { NextRequest, NextResponse } from "next/server"
import { fetchSerpApiEvents } from "@/lib/sources/serpapi"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sync-secret")
  if (!secret || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { fetched, upserted } = await fetchSerpApiEvents()
    console.log(`[serpapi sync] fetched=${fetched} upserted=${upserted}`)
    return NextResponse.json({ success: true, count: upserted, fetched })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[serpapi sync] error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
