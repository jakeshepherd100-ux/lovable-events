import { supabase } from "./supabase"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SupabaseEvent = {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  location: string | null
  is_online: boolean
  url: string
  source: string
  source_id: string | null
  category: string | null
  is_free: boolean | null
  price_label: string | null
  organizer_name: string | null
  organizer_url: string | null
  image_url: string | null
  tags: string[] | null
  is_approved: boolean
  created_at: string
  updated_at: string
}

export type EventInput = Omit<SupabaseEvent, "id" | "created_at" | "updated_at">

export type EventFilters = {
  category?: string
  dateRange?: string
  search?: string
}

// ─── Query functions ──────────────────────────────────────────────────────────

export async function getUpcomingEvents(filters?: EventFilters): Promise<SupabaseEvent[]> {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  let startBound = now.toISOString()
  let endBound: string | null = null

  const dateRange = filters?.dateRange ?? "All Dates"
  if (dateRange === "This Week") {
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    startBound = start.toISOString()
    endBound = end.toISOString()
  } else if (dateRange === "This Month") {
    startBound = new Date(y, m, 1).toISOString()
    endBound = new Date(y, m + 1, 0, 23, 59, 59, 999).toISOString()
  } else if (dateRange === "Next Month") {
    startBound = new Date(y, m + 1, 1).toISOString()
    endBound = new Date(y, m + 2, 0, 23, 59, 59, 999).toISOString()
  }

  let query = supabase
    .from("events")
    .select("*")
    .eq("is_approved", true)
    .gte("start_date", startBound)
    .order("start_date", { ascending: true })

  if (endBound) query = query.lte("start_date", endBound)
  if (filters?.category && filters.category !== "All") query = query.eq("category", filters.category)
  if (filters?.search) query = query.ilike("title", `%${filters.search}%`)

  const { data, error } = await query
  if (error) {
    console.error("getUpcomingEvents error:", error)
    return []
  }
  return data ?? []
}

export async function getEventById(id: string): Promise<SupabaseEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getEventById error:", error)
    return null
  }
  return data
}

export async function getUpcomingEventCount(): Promise<number> {
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true)
    .gte("start_date", new Date().toISOString())

  if (error) return 0
  return count ?? 0
}

export async function upsertEvent(event: EventInput): Promise<SupabaseEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .upsert({ ...event, updated_at: new Date().toISOString() }, { onConflict: "source,source_id" })
    .select()
    .single()

  if (error) {
    console.error("upsertEvent error:", error)
    return null
  }
  return data
}
