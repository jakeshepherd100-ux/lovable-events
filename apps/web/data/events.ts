// ─────────────────────────────────────────────────────────────────────────────
// events.ts — curated list of upcoming SD / online AI & startup events
//
// How to add an event:
//   1. Copy an existing entry below.
//   2. Give it a unique `id` (just increment the last one).
//   3. Fill in the fields — set `isOnline: true` and `city: "Online"` for
//      virtual events; use the real city name for in-person ones.
//   4. Add tags from the set ["AI", "Startups"] (used by the filter buttons).
//   5. Set `url` to the public event page (Luma, Eventbrite, Meetup, etc.).
// ─────────────────────────────────────────────────────────────────────────────

export type Event = {
  id: string
  title: string
  date: string      // human-readable, e.g. "March 10, 2026"
  time: string      // human-readable, e.g. "6:00 PM"
  city: string      // city name, or "Online"
  isOnline: boolean // true = virtual event
  organizer: string // who is running the event
  tags: string[]    // subset of ["AI", "Startups"]
  url: string       // external link to the event page
}

export const events: Event[] = [
  {
    id: "1",
    title: "San Diego AI Meetup: Agents & Automation",
    date: "March 5, 2026",
    time: "6:30 PM",
    city: "San Diego",
    isOnline: false,
    organizer: "San Diego AI Meetup",
    tags: ["AI"],
    url: "https://www.meetup.com/san-diego-artificial-intelligence/",
  },
  {
    id: "2",
    title: "Startup SD: Founder Demo Night",
    date: "March 11, 2026",
    time: "6:00 PM",
    city: "San Diego",
    isOnline: false,
    organizer: "Startup San Diego",
    tags: ["Startups"],
    url: "https://www.startupsd.org/",
  },
  {
    id: "3",
    title: "Build with AI — Live Workshop",
    date: "March 13, 2026",
    time: "12:00 PM",
    city: "Online",
    isOnline: true,
    organizer: "Google Developer Groups",
    tags: ["AI"],
    url: "https://developers.google.com/community/gdg",
  },
  {
    id: "4",
    title: "AI + Startups Fireside: Building Products with LLMs",
    date: "March 19, 2026",
    time: "5:00 PM",
    city: "Online",
    isOnline: true,
    organizer: "Y Combinator",
    tags: ["AI", "Startups"],
    url: "https://www.ycombinator.com/events",
  },
  {
    id: "5",
    title: "San Diego Startup Week — Opening Night",
    date: "March 24, 2026",
    time: "7:00 PM",
    city: "San Diego",
    isOnline: false,
    organizer: "Startup San Diego",
    tags: ["Startups"],
    url: "https://www.startupsd.org/sdstartupweek",
  },
  {
    id: "6",
    title: "Practical AI for Founders",
    date: "March 26, 2026",
    time: "10:00 AM",
    city: "San Diego",
    isOnline: false,
    organizer: "EvoNexus",
    tags: ["AI", "Startups"],
    url: "https://evonexus.org/",
  },
]
