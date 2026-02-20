# Data Model

## Event Type

Defined in `apps/web/data/events.ts`.

```typescript
type Event = {
  id: string        // unique identifier
  title: string     // display name of the event
  date: string      // human-readable date, e.g. "March 10, 2026"
  time: string      // human-readable time, e.g. "6:00 PM"
  city: string      // city name, or "Online"
  isOnline: boolean // true = virtual event
  organizer: string // who is running the event
  tags: string[]    // e.g. ["AI", "Startups"]
  url: string       // external link to event page
}
```

## Current Events

| # | Title | Date | Format | Organizer | Tags |
|---|-------|------|--------|-----------|------|
| 1 | San Diego AI Meetup: Agents & Automation | March 5, 2026 · 6:30 PM | San Diego (in-person) | San Diego AI Meetup | AI |
| 2 | Startup SD: Founder Demo Night | March 11, 2026 · 6:00 PM | San Diego (in-person) | Startup San Diego | Startups |
| 3 | Build with AI — Live Workshop | March 13, 2026 · 12:00 PM | Online | Google Developer Groups | AI |
| 4 | AI + Startups Fireside: Building Products with LLMs | March 19, 2026 · 5:00 PM | Online | Y Combinator | AI, Startups |
| 5 | San Diego Startup Week — Opening Night | March 24, 2026 · 7:00 PM | San Diego (in-person) | Startup San Diego | Startups |
| 6 | Practical AI for Founders | March 26, 2026 · 10:00 AM | San Diego (in-person) | EvoNexus | AI, Startups |

## Notes

- There is no backend or database yet — edit `data/events.ts` directly to add or remove events
- Tags are free-form strings; the filter UI hardcodes `"AI"` and `"Startups"` as filter keys
- See the comment block at the top of `data/events.ts` for instructions on adding new events
