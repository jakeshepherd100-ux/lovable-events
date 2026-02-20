"use client"

import { useMemo, useState } from "react"
import type { Event } from "@/data/events"

type Filters = {
  sanDiego: boolean
  online: boolean
  ai: boolean
  startups: boolean
}

const FilterButton = ({
  label,
  on,
  onClick,
}: {
  label: string
  on: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded border text-sm transition-colors ${
      on
        ? "bg-ps-primary text-white border-ps-primary"
        : "border-ps-border text-ps-body bg-ps-surface hover:border-ps-primary hover:text-ps-primary"
    }`}
  >
    {label}
  </button>
)

export default function EventList({ events }: { events: Event[] }) {
  const [filters, setFilters] = useState<Filters>({
    sanDiego: false,
    online: false,
    ai: false,
    startups: false,
  })

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (filters.sanDiego && e.city !== "San Diego") return false
      if (filters.online && !e.isOnline) return false
      if (filters.ai && !e.tags.includes("AI")) return false
      if (filters.startups && !e.tags.includes("Startups")) return false
      return true
    })
  }, [events, filters])

  const toggle = (key: keyof Filters) =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="font-serif text-ps-heading text-3xl">Events</h1>
        <div className="text-sm text-ps-muted">{filtered.length} shown</div>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        <FilterButton label="San Diego" on={filters.sanDiego} onClick={() => toggle("sanDiego")} />
        <FilterButton label="Online" on={filters.online} onClick={() => toggle("online")} />
        <FilterButton label="AI" on={filters.ai} onClick={() => toggle("ai")} />
        <FilterButton label="Startups" on={filters.startups} onClick={() => toggle("startups")} />
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((e) => (
          <a
            key={e.id}
            href={e.url}
            target="_blank"
            rel="noreferrer"
            className="block bg-ps-surface border border-ps-border rounded-xl p-4 transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(26,47,58,0.12)]"
          >
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
              <div className="flex flex-wrap gap-1 justify-end">
                {e.tags.map((t) => (
                  <span key={t} className="bg-ps-accent text-white text-xs font-medium rounded-full px-3 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
