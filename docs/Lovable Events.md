# Lovable Events

An event discovery and filtering web app for finding local and online events (AI meetups, startup gatherings, etc.) in San Diego and beyond.

## Quick Links

- [[Architecture]]
- [[Data Model]]
- [[Routes]]
- [[Tech Stack]]
- [[Development]]

## What It Does

Users visit the `/events` page and can filter events by:
- **Location**: San Diego / Online
- **Topic**: AI / Startups

Events display as clickable cards showing title, date, time, location, organizer, and tags. Each card links out to the event's external URL.

## Project Layout

```
lovable-events/
├── apps/
│   └── web/          ← Next.js app (the only app right now)
├── docs/             ← You are here
├── scripts/          ← Empty, available for tooling
└── README.md
```
