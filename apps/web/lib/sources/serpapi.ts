import { upsertEvent } from "@/lib/events"
import type { EventInput } from "@/lib/events"

// ─── SerpAPI response types ───────────────────────────────────────────────────

type SerpEvent = {
  title: string
  date: { start_date?: string; when?: string }
  address?: string[]
  link: string
  description?: string
  ticket_info?: Array<{ source?: string; link?: string; price?: string }>
  venue?: { name?: string }
  thumbnail?: string
}

type SerpResponse = {
  events_results?: SerpEvent[]
  error?: string
}

// ─── Date parsing ─────────────────────────────────────────────────────────────

// Month name → 0-indexed month number
const MONTH_MAP: Record<string, number> = {
  Jan: 0, January: 0,
  Feb: 1, February: 1,
  Mar: 2, March: 2,
  Apr: 3, April: 3,
  May: 4,
  Jun: 5, June: 5,
  Jul: 6, July: 6,
  Aug: 7, August: 7,
  Sep: 8, September: 8,
  Oct: 9, October: 9,
  Nov: 10, November: 10,
  Dec: 11, December: 11,
}

/**
 * Convert a 12-hour time string like "6:30 PM" to { hour, minute } in 24h.
 */
function parseTime(timeStr: string): { hour: number; minute: number } {
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return { hour: 18, minute: 0 } // default 6 PM
  let hour = parseInt(m[1])
  const minute = parseInt(m[2])
  const ampm = m[3].toUpperCase()
  if (ampm === "PM" && hour !== 12) hour += 12
  if (ampm === "AM" && hour === 12) hour = 0
  return { hour, minute }
}

/**
 * Parse a SerpAPI `when` string (e.g. "Mar 5, 6:30 PM – Mar 5, 8:30 PM",
 * "Fri, Feb 28, 6:30 PM – 8:30 PM", "Tomorrow, 6:30 PM") into a UTC ISO string.
 * Events are assumed to be in Pacific Time (UTC-8).
 */
function parseSerpDate(when: string, fallbackStartDate?: string): string {
  const now = new Date()
  const PST_OFFSET_MS = 8 * 60 * 60 * 1000 // UTC-8

  // "Tomorrow, 6:30 PM"
  if (/^tomorrow/i.test(when)) {
    const d = new Date(now)
    d.setDate(d.getDate() + 1)
    const timeMatch = when.match(/(\d+:\d+\s*(?:AM|PM))/i)
    const { hour, minute } = timeMatch ? parseTime(timeMatch[1]) : { hour: 18, minute: 0 }
    d.setHours(hour, minute, 0, 0)
    return new Date(d.getTime() + PST_OFFSET_MS).toISOString()
  }

  // Strip leading "Mon, " / "Fri, " day-of-week prefix
  const stripped = when.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s*/i, "")

  // "Mar 5, 6:30 PM – ..." or "March 5, 6:30 PM"
  const match = stripped.match(/^([A-Za-z]+)\s+(\d+)(?:,\s*(\d+:\d+\s*(?:AM|PM)))?/i)
  if (match) {
    const monthName = match[1]
    const day = parseInt(match[2])
    const monthIdx = MONTH_MAP[monthName]
    if (monthIdx !== undefined) {
      let year = now.getFullYear()
      // Roll over to next year if the month/day is already in the past
      if (
        monthIdx < now.getMonth() ||
        (monthIdx === now.getMonth() && day < now.getDate())
      ) {
        year++
      }
      const d = new Date(year, monthIdx, day)
      const { hour, minute } = match[3] ? parseTime(match[3]) : { hour: 18, minute: 0 }
      d.setHours(hour, minute, 0, 0)
      return new Date(d.getTime() + PST_OFFSET_MS).toISOString()
    }
  }

  // Fallback: "March 5" from start_date field
  if (fallbackStartDate) {
    const m = fallbackStartDate.match(/^([A-Za-z]+)\s+(\d+)/)
    if (m) {
      const monthIdx = MONTH_MAP[m[1]]
      const day = parseInt(m[2])
      if (monthIdx !== undefined) {
        let year = now.getFullYear()
        if (
          monthIdx < now.getMonth() ||
          (monthIdx === now.getMonth() && day < now.getDate())
        ) {
          year++
        }
        const d = new Date(year, monthIdx, day, 18, 0, 0, 0)
        return new Date(d.getTime() + PST_OFFSET_MS).toISOString()
      }
    }
  }

  return now.toISOString()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function categorize(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()
  if (/\b(ai\b|ml\b|machine learning|artificial intelligence|llm|gpt|deep learning)/.test(text))
    return "AI / ML"
  if (/\b(startup|founder|venture|vc\b|fundrais|pitch|demo day)/.test(text))
    return "Startup"
  if (/\b(web3|crypto|blockchain|nft\b|defi|token)/.test(text))
    return "Web3"
  if (/\b(design|ux\b|ui\b|user experience|figma|product design)/.test(text))
    return "Design"
  if (/\b(network|mixer|happy hour|connect|social|community)/.test(text))
    return "Networking"
  if (/\b(workshop|bootcamp|training|course|learn|hands.on|tutorial)/.test(text))
    return "Workshops"
  return "Developer Tools"
}

function mapToEventInput(e: SerpEvent): EventInput {
  const description = e.description ?? null
  const location = e.address ? e.address.join(", ") : null
  const startDate = parseSerpDate(e.date.when ?? "", e.date.start_date)
  const ticketInfo = e.ticket_info?.[0]
  const priceStr = ticketInfo?.price ?? null
  const isFree = priceStr ? /free/i.test(priceStr) : null

  return {
    title: e.title,
    description: description?.slice(0, 500) ?? null,
    start_date: startDate,
    end_date: null,
    location,
    is_online: /online|virtual|zoom|remote/i.test(location ?? ""),
    url: e.link,
    source: "serpapi",
    source_id: e.link,
    category: categorize(e.title, description ?? ""),
    is_free: isFree,
    price_label: priceStr,
    organizer_name: e.venue?.name ?? null,
    organizer_url: null,
    image_url: e.thumbnail ?? null,
    tags: null,
    is_approved: true,
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const QUERIES = [
  "AI machine learning tech events San Diego",
  "startup founder tech events San Diego",
  "developer software tech events San Diego",
]

async function fetchQuery(q: string, apiKey: string): Promise<SerpEvent[]> {
  const params = new URLSearchParams({
    engine: "google_events",
    q,
    location: "San Diego, California, United States",
    htichips: "date:month",
    api_key: apiKey,
  })

  const res = await fetch(`https://serpapi.com/search.json?${params}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`SerpAPI ${res.status}: ${body.slice(0, 200)}`)
  }

  const data: SerpResponse = await res.json()
  if (data.error) throw new Error(`SerpAPI error: ${data.error}`)
  return data.events_results ?? []
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchSerpApiEvents(): Promise<{ fetched: number; upserted: number }> {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey || apiKey === "your_serpapi_key_here") {
    throw new Error("SERPAPI_KEY is not configured")
  }

  // Fetch all queries in parallel
  const settled = await Promise.allSettled(QUERIES.map((q) => fetchQuery(q, apiKey)))

  // Deduplicate by URL across all query results
  const seen = new Set<string>()
  const allEvents: SerpEvent[] = []
  for (const result of settled) {
    if (result.status === "fulfilled") {
      for (const e of result.value) {
        if (!seen.has(e.link)) {
          seen.add(e.link)
          allEvents.push(e)
        }
      }
    } else {
      console.error("[serpapi] query failed:", result.reason)
    }
  }

  let upserted = 0
  for (const e of allEvents) {
    try {
      const result = await upsertEvent(mapToEventInput(e))
      if (result) upserted++
    } catch (err) {
      console.error(`[serpapi] Failed to upsert "${e.title}":`, err)
    }
  }

  return { fetched: allEvents.length, upserted }
}
