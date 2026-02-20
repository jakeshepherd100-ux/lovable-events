export type Event = {
  id: string
  title: string
  date: string
  time: string
  city: string
  isOnline: boolean
  organizer: string
  tags: string[]
  url: string
}

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "AI Builders Meetup",
    date: "March 10, 2026",
    time: "6:00 PM",
    city: "San Diego",
    isOnline: false,
    organizer: "Startup San Diego",
    tags: ["AI", "Startups"],
    url: "https://example.com/event/1",
  },
  {
    id: "2",
    title: "Remote AI Demo Night",
    date: "March 12, 2026",
    time: "5:00 PM",
    city: "Online",
    isOnline: true,
    organizer: "Luma",
    tags: ["AI"],
    url: "https://example.com/event/2",
  },
  {
    id: "3",
    title: "Founder Happy Hour",
    date: "March 14, 2026",
    time: "7:00 PM",
    city: "San Diego",
    isOnline: false,
    organizer: "StartupSD",
    tags: ["Startups"],
    url: "https://example.com/event/3",
  },
  {
    id: "4",
    title: "AI + Startups Fireside Chat",
    date: "March 18, 2026",
    time: "12:00 PM",
    city: "Online",
    isOnline: true,
    organizer: "Eventbrite",
    tags: ["AI", "Startups"],
    url: "https://example.com/event/4",
  },
]
