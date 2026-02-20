# Routes

## `/` — Root

**File**: `apps/web/app/page.tsx`

The default Next.js starter page. Shows the Next.js logo and links to Vercel deploy + Next.js docs. Placeholder — not the real app UI.

---

## `/events` — Events Listing (main feature)

**File**: `apps/web/app/events/page.tsx`

The core of the app. Renders a filterable list of events.

**UI elements:**
- Page title ("Events") + count of visible results
- Filter toggle buttons: San Diego · Online · AI · Startups
- Event cards (title, date/time, location, organizer, tags) — each is a link to the external event URL

**State:** `"use client"` — uses `useState` for filter toggles and `useMemo` to derive filtered event list.

---

## `/homepage` — Alternate Landing

**File**: `apps/web/app/homepage/page.tsx`

An alternate homepage with navigation links. Not the primary entry point.
