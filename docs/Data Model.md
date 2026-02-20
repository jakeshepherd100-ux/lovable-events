# Data Model

## Event Type

Defined in `apps/web/data/mockEvents.ts`.

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

## Current Mock Events

| # | Title | Date | Format | Organizer | Tags |
|---|-------|------|--------|-----------|------|
| 1 | AI Builders Meetup | March 10, 2026 · 6:00 PM | San Diego (in-person) | Startup San Diego | AI, Startups |
| 2 | Remote AI Demo Night | March 12, 2026 · 5:00 PM | Online | Luma | AI |
| 3 | Founder Happy Hour | March 14, 2026 · 7:00 PM | San Diego (in-person) | StartupSD | Startups |
| 4 | AI + Startups Fireside Chat | March 18, 2026 · 12:00 PM | Online | Eventbrite | AI, Startups |

## Notes

- There is no backend or database yet — swap `mockEvents` in `data/mockEvents.ts` to connect a real data source
- Tags are free-form strings; the filter UI hardcodes `"AI"` and `"Startups"` as filter keys
