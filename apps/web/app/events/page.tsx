import { getUpcomingEvents } from "@/lib/events"
import EventList from "./EventList"

export const revalidate = 300 // re-fetch from Supabase every 5 minutes

export default async function EventsPage() {
  const events = await getUpcomingEvents()
  return <EventList events={events} />
}
