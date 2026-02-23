import { getUpcomingEvents } from "@/lib/events"
import EventList from "./EventList"

export const dynamic = "force-dynamic" // always fetch fresh from Supabase

export default async function EventsPage() {
  const events = await getUpcomingEvents()
  return <EventList events={events} />
}
