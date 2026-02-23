import { upsertEvent } from "@/lib/events"
import type { EventInput } from "@/lib/events"

// ─── JSON-LD types (Schema.org Event from The Events Calendar plugin) ─────────

type JsonLdEvent = {
  "@type": string
  name?: string
  startDate?: string
  endDate?: string
  description?: string
  url?: string
  eventAttendanceMode?: string
  eventStatus?: string
  location?: {
    "@type"?: string
    name?: string
    address?: {
      streetAddress?: string
      addressLocality?: string
      addressRegion?: string
      postalCode?: string
    } | string
  }
  offers?: { price?: string | number } | Array<{ price?: string | number }>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Decode common HTML entities (JSON-LD from WP often contains these) */
function decodeEntities(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(parseInt(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
}

/** Strip HTML tags from a string that may contain entity-encoded HTML */
function stripHtml(str: string): string {
  return decodeEntities(str)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function extractJsonLdEvents(html: string): JsonLdEvent[] {
  const events: JsonLdEvent[] = []
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = re.exec(html)) !== null) {
    try {
      const parsed: unknown = JSON.parse(match[1])
      // May be a single object or an array; also unwrap @graph if present
      const candidates: unknown[] = []
      if (Array.isArray(parsed)) {
        candidates.push(...parsed)
      } else if (parsed !== null && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>
        if (Array.isArray(obj["@graph"])) {
          candidates.push(...(obj["@graph"] as unknown[]))
        } else {
          candidates.push(parsed)
        }
      }
      for (const item of candidates) {
        if (
          item !== null &&
          typeof item === "object" &&
          (item as Record<string, unknown>)["@type"] === "Event"
        ) {
          events.push(item as JsonLdEvent)
        }
      }
    } catch {
      // Skip malformed JSON-LD
    }
  }
  return events
}

function getLocation(e: JsonLdEvent): string | null {
  if (!e.location) return null
  const loc = e.location
  const parts: string[] = []
  if (loc.name) parts.push(decodeEntities(loc.name))
  if (loc.address) {
    if (typeof loc.address === "string") {
      parts.push(decodeEntities(loc.address))
    } else {
      if (loc.address.streetAddress) parts.push(decodeEntities(loc.address.streetAddress))
      if (loc.address.addressLocality) parts.push(decodeEntities(loc.address.addressLocality))
      if (loc.address.addressRegion) parts.push(loc.address.addressRegion)
    }
  }
  return parts.join(", ") || null
}

function getPriceInfo(e: JsonLdEvent): { isFree: boolean | null; priceLabel: string | null } {
  if (!e.offers) return { isFree: null, priceLabel: null }
  const offer = Array.isArray(e.offers) ? e.offers[0] : e.offers
  const price = offer?.price
  if (price === 0 || price === "0" || String(price).toLowerCase() === "free") {
    return { isFree: true, priceLabel: "Free" }
  }
  if (price != null && price !== "") {
    return { isFree: false, priceLabel: `$${price}` }
  }
  return { isFree: null, priceLabel: null }
}

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

function mapToEventInput(e: JsonLdEvent): EventInput | null {
  if (!e.name || !e.startDate || !e.url) return null
  // Skip cancelled events
  if (e.eventStatus?.includes("Cancelled")) return null

  const title = decodeEntities(e.name)
  const description = e.description ? stripHtml(e.description) : null
  const location = getLocation(e)
  const { isFree, priceLabel } = getPriceInfo(e)
  const isOnline =
    (e.eventAttendanceMode?.includes("OnlineEvent") ?? false) ||
    /online|virtual|zoom|remote/i.test(location ?? "")

  return {
    title,
    description: description?.slice(0, 500) ?? null,
    start_date: e.startDate, // already ISO 8601 with timezone offset
    end_date: e.endDate ?? null,
    location,
    is_online: isOnline,
    url: e.url,
    source: "sdtechscene",
    source_id: e.url,
    category: categorize(title, description ?? ""),
    is_free: isFree,
    price_label: priceLabel,
    organizer_name: null,
    organizer_url: null,
    image_url: null,
    tags: null,
    is_approved: true,
  }
}

// ─── Fetching ─────────────────────────────────────────────────────────────────

const BASE_URL = "https://sdtechscene.org/events/"
const MAX_PAGES = 5

async function fetchPage(page: number): Promise<JsonLdEvent[]> {
  const url = page === 1 ? BASE_URL : `${BASE_URL}?paged=${page}`
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })

  if (!res.ok) {
    if (res.status === 404) return [] // No more pages
    throw new Error(`sdtechscene.org HTTP ${res.status} on page ${page}`)
  }

  const html = await res.text()
  return extractJsonLdEvents(html)
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchSdTechSceneEvents(): Promise<{ fetched: number; upserted: number }> {
  const allEvents: JsonLdEvent[] = []

  for (let page = 1; page <= MAX_PAGES; page++) {
    const events = await fetchPage(page)
    if (events.length === 0) break
    allEvents.push(...events)
    console.log(`[sdtechscene] page ${page}: ${events.length} events`)
  }

  let upserted = 0
  for (const e of allEvents) {
    const input = mapToEventInput(e)
    if (!input) continue
    try {
      const result = await upsertEvent(input)
      if (result) upserted++
    } catch (err) {
      console.error(`[sdtechscene] Failed to upsert "${e.name}":`, err)
    }
  }

  return { fetched: allEvents.length, upserted }
}
