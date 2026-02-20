import { upsertEvent } from "@/lib/events"
import type { EventInput } from "@/lib/events"

// ─── Eventbrite API types ─────────────────────────────────────────────────────

type EBEvent = {
  id: string
  name: { text: string }
  description: { text: string | null }
  start: { utc: string }
  end: { utc: string }
  url: string
  is_free: boolean
  logo?: { url: string } | null
  venue?: {
    address?: { localized_address_display?: string }
  } | null
  organizer?: { name?: string } | null
}

type EBResponse = {
  events: EBEvent[]
  pagination: { has_more_items: boolean }
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

function mapToEventInput(e: EBEvent): EventInput {
  const description = e.description?.text ?? null
  const title = e.name.text

  return {
    title,
    description: description ? description.slice(0, 500) : null,
    start_date: e.start.utc,
    end_date: e.end.utc,
    location: e.venue?.address?.localized_address_display ?? null,
    is_online: false,
    url: e.url,
    source: "eventbrite",
    source_id: e.id,
    category: categorize(title, description ?? ""),
    is_free: e.is_free,
    price_label: e.is_free ? "Free" : "Paid",
    organizer_name: e.organizer?.name ?? null,
    organizer_url: null,
    image_url: e.logo?.url ?? null,
    tags: null,
    is_approved: true,
  }
}

// ─── Main fetch function ──────────────────────────────────────────────────────

export async function fetchEventbriteEvents(): Promise<{ fetched: number; upserted: number }> {
  const apiKey = process.env.EVENTBRITE_API_KEY
  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("EVENTBRITE_API_KEY is not configured")
  }

  const params = new URLSearchParams({
    q: "tech AI machine learning startup",
    "location.address": "San Diego, CA",
    "location.within": "25mi",
    expand: "venue,organizer",
    "start_date.range_start": new Date().toISOString(),
    sort_by: "date",
    token: apiKey,
  })

  const res = await fetch(
    `https://www.eventbriteapi.com/v3/events/search/?${params}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Eventbrite API ${res.status}: ${body}`)
  }

  const data: EBResponse = await res.json()
  const events = data.events ?? []

  let upserted = 0
  for (const e of events) {
    try {
      const result = await upsertEvent(mapToEventInput(e))
      if (result) upserted++
    } catch (err) {
      console.error(`Failed to upsert event ${e.id}:`, err)
    }
  }

  return { fetched: events.length, upserted }
}
