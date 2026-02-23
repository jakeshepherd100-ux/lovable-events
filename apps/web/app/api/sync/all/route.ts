import { NextRequest, NextResponse } from "next/server"
import { fetchSerpApiEvents } from "@/lib/sources/serpapi"
import { fetchSdTechSceneEvents } from "@/lib/sources/sdtechscene"

type SourceResult = { fetched: number; upserted: number } | { error: string }

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sync-secret")
  if (!secret || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [serpResult, sdtResult] = await Promise.allSettled([
    fetchSerpApiEvents(),
    fetchSdTechSceneEvents(),
  ])

  const results: Record<string, SourceResult> = {}

  if (serpResult.status === "fulfilled") {
    results.serpapi = serpResult.value
    console.log(`[sync/all] serpapi fetched=${serpResult.value.fetched} upserted=${serpResult.value.upserted}`)
  } else {
    const msg = serpResult.reason instanceof Error ? serpResult.reason.message : "Unknown"
    console.error("[sync/all] serpapi error:", msg)
    results.serpapi = { error: msg }
  }

  if (sdtResult.status === "fulfilled") {
    results.sdtechscene = sdtResult.value
    console.log(`[sync/all] sdtechscene fetched=${sdtResult.value.fetched} upserted=${sdtResult.value.upserted}`)
  } else {
    const msg = sdtResult.reason instanceof Error ? sdtResult.reason.message : "Unknown"
    console.error("[sync/all] sdtechscene error:", msg)
    results.sdtechscene = { error: msg }
  }

  return NextResponse.json({ success: true, results })
}
