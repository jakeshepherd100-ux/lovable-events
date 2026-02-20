import { events } from "@/data/events"
import EventList from "./EventList"

export default function EventsPage() {
  return <EventList events={events} />
}
