# Development

## Getting Started

```bash
cd apps/web
npm install
npm run dev
```

App runs at `http://localhost:3000`. The main feature is at `/events`.

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Adding Events

Until there's a real backend, add events in `apps/web/data/mockEvents.ts`:

```typescript
{
  id: "5",
  title: "Your Event Title",
  date: "April 1, 2026",
  time: "6:00 PM",
  city: "San Diego",       // or "Online"
  isOnline: false,
  organizer: "Your Org",
  tags: ["AI"],            // "AI" and/or "Startups" are the filterable tags
  url: "https://yourlink.com",
}
```

## Adding a New Filter

1. Add a new boolean key to the `Filters` type in `apps/web/app/events/page.tsx`
2. Initialize it to `false` in the `useState` call
3. Add filter logic inside the `useMemo` callback
4. Add a `<FilterButton>` in the JSX

## Potential Next Steps

- Connect a real data source (database, CMS, or external API) to replace mock data
- Add event detail pages at `/events/[id]`
- Add search / text filtering
- Deploy to Vercel (`npm run build`)
