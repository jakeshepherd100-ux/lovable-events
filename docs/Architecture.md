# Architecture

## Overview

Single Next.js app inside a monorepo shell. The repo is structured to support multiple apps or packages in the future but currently only has `apps/web`.

## Directory Structure

```
apps/web/
├── app/
│   ├── layout.tsx          ← Root layout (wraps all routes)
│   ├── page.tsx            ← / route (default Next.js starter page)
│   ├── globals.css         ← Global styles (Tailwind base)
│   ├── events/
│   │   ├── page.tsx        ← /events route — server component, loads data
│   │   └── EventList.tsx   ← client component — filtering UI + event cards
│   └── homepage/
│       └── page.tsx        ← /homepage route — alternate landing
├── data/
│   └── events.ts           ← Event type definition + curated event list
└── public/
    ├── next.svg
    └── vercel.svg
```

## Key Patterns

- **App Router** — uses Next.js `app/` directory (not `pages/`)
- **Server/client split** — `app/events/page.tsx` is a server component that reads data and passes it as props to `EventList.tsx`, which is `"use client"` and handles interactive filtering
- **Path alias** — `@/` maps to the project root (`apps/web/`), so imports look like `@/data/events`
- **Curated data** — no backend or database yet; all events are maintained in `data/events.ts`

## Filtering Logic

`EventList` holds a `Filters` state object with four boolean keys. On each render, `useMemo` filters the full event list — each active filter narrows results (AND logic, not OR).

```
filters.sanDiego  → keep only city === "San Diego"
filters.online    → keep only isOnline === true
filters.ai        → keep only tags includes "AI"
filters.startups  → keep only tags includes "Startups"
```
