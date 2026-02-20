"use client"

import { useMemo, useState } from "react"
import type { Event } from "@/data/events"

// ─── Types ────────────────────────────────────────────────────────────────────

type Filters = {
  sanDiego: boolean
  online: boolean
  ai: boolean
  startups: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "AI / ML", "Startup", "Web3", "Design", "Networking", "Workshops", "Developer Tools"]
const DATE_OPTIONS = ["All Dates", "This Week", "This Month", "Next Month"]

const SOURCE_NAMES: Record<string, string> = {
  "meetup.com": "Meetup",
  "eventbrite.com": "Eventbrite",
  "lu.ma": "Luma",
  "developers.google.com": "Google Developers",
  "ycombinator.com": "Y Combinator",
  "startupsd.org": "Startup SD",
  "evonexus.org": "EvoNexus",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "")
    return SOURCE_NAMES[hostname] ?? hostname
  } catch {
    return url
  }
}

function matchesCategory(e: Event, cat: string): boolean {
  switch (cat) {
    case "All":      return true
    case "AI / ML":  return e.tags.includes("AI")
    case "Startup":  return e.tags.includes("Startups")
    default:         return false
  }
}

function isInDateRange(dateStr: string, filter: string): boolean {
  if (filter === "All Dates") return true
  const event = new Date(dateStr)
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  if (filter === "This Week") {
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return event >= start && event <= end
  }
  if (filter === "This Month") {
    return event.getFullYear() === y && event.getMonth() === m
  }
  if (filter === "Next Month") {
    const next = new Date(y, m + 1, 1)
    return event.getFullYear() === next.getFullYear() && event.getMonth() === next.getMonth()
  }
  return true
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const cardBase =
  "block bg-ps-surface border border-ps-border rounded-xl p-4 transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(26,47,58,0.12)]"

const pillBase = "px-3 py-1 rounded-full border text-sm whitespace-nowrap transition-colors"
const pillActive = "bg-ps-primary text-white border-ps-primary"
const pillInactive = "bg-ps-surface text-ps-primary border-ps-border hover:border-ps-primary"

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${pillBase} ${active ? pillActive : pillInactive}`}>
      {label}
    </button>
  )
}

const toggleBase = "px-3 py-1 rounded border text-sm transition-colors"
const toggleActive = "bg-ps-primary text-white border-ps-primary"
const toggleInactive = "border-ps-border text-ps-body bg-ps-surface hover:border-ps-primary hover:text-ps-primary"

function ToggleButton({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${toggleBase} ${on ? toggleActive : toggleInactive}`}>
      {label}
    </button>
  )
}

function CardContent({ e }: { e: Event }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-serif text-ps-heading text-lg font-semibold">{e.title}</div>
          <div className="text-sm text-ps-muted mt-0.5">
            {e.date} · {e.time}
          </div>
          <div className="text-sm text-ps-muted">
            {e.isOnline ? "Online" : e.city} · {e.organizer}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 justify-end shrink-0">
          {e.tags.map((t) => (
            <span key={t} className="bg-ps-accent text-white text-xs font-medium rounded-full px-3 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-ps-border">
        {e.url ? (
          <span className="text-ps-muted text-xs">via {getSourceName(e.url)} ↗</span>
        ) : (
          <span className="text-ps-muted text-xs italic">Details coming soon</span>
        )}
      </div>
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EventList({ events }: { events: Event[] }) {
  // Existing location/tag toggles
  const [filters, setFilters] = useState<Filters>({
    sanDiego: false,
    online: false,
    ai: false,
    startups: false,
  })

  // New category + date filters
  const [category, setCategory] = useState("All")
  const [dateFilter, setDateFilter] = useState("All Dates")

  const toggle = (key: keyof Filters) =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))

  function resetAll() {
    setFilters({ sanDiego: false, online: false, ai: false, startups: false })
    setCategory("All")
    setDateFilter("All Dates")
  }

  const filtered = useMemo(() => {
    return events.filter((e) => {
      // Existing toggles
      if (filters.sanDiego && e.city !== "San Diego") return false
      if (filters.online && !e.isOnline) return false
      if (filters.ai && !e.tags.includes("AI")) return false
      if (filters.startups && !e.tags.includes("Startups")) return false
      // New filters
      if (!matchesCategory(e, category)) return false
      if (!isInDateRange(e.date, dateFilter)) return false
      return true
    })
  }, [events, filters, category, dateFilter])

  return (
    <>
      {/* ── Sticky filter bar ────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 border-b border-ps-border"
           style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center gap-4">

          {/* Category pills — horizontally scrollable */}
          <div className="flex gap-2 overflow-x-auto flex-1 pb-0.5"
               style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={category === cat}
                onClick={() => setCategory(cat)}
              />
            ))}
          </div>

          {/* Date dropdown */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="shrink-0 px-3 py-1 rounded border text-sm border-ps-border bg-ps-surface text-ps-body focus:outline-none focus:border-ps-primary cursor-pointer"
          >
            {DATE_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Events grid ──────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto p-6">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h1 className="font-serif text-ps-heading text-3xl">Events</h1>
          <div className="text-sm text-ps-muted">{filtered.length} shown</div>
        </div>

        {/* Existing location/tag toggles */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <ToggleButton label="San Diego" on={filters.sanDiego} onClick={() => toggle("sanDiego")} />
          <ToggleButton label="Online"    on={filters.online}   onClick={() => toggle("online")} />
          <ToggleButton label="AI"        on={filters.ai}       onClick={() => toggle("ai")} />
          <ToggleButton label="Startups"  on={filters.startups} onClick={() => toggle("startups")} />
        </div>

        {/* Event cards or empty state */}
        {filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="font-serif italic text-ps-heading text-xl">
              No events found. Try a different filter.
            </p>
            <button
              onClick={resetAll}
              className="mt-3 text-sm text-ps-primary underline hover:opacity-75 transition-opacity"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((e) =>
              e.url ? (
                <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer"
                   className={`${cardBase} cursor-pointer`}>
                  <CardContent e={e} />
                </a>
              ) : (
                <div key={e.id} className={cardBase}>
                  <CardContent e={e} />
                </div>
              )
            )}
          </div>
        )}
      </main>
    </>
  )
}
