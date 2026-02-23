import Link from "next/link"
import { getUpcomingEventCount } from "@/lib/events"
import SignupSection from "@/app/components/SignupSection"

export const revalidate = 300 // refresh count every 5 minutes

const categories = [
  {
    title: "AI & Machine Learning",
    desc: "Builder meetups, workshops, demo nights, and hands-on sessions",
  },
  {
    title: "Startups & Funding",
    desc: "Founder happy hours, pitch events, investor panels, and demo days",
  },
  {
    title: "San Diego & Remote",
    desc: "In-person local events plus the best online events worth showing up for",
  },
]

export default async function HomePage() {
  const eventCount = await getUpcomingEventCount()

  return (
    <>
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-ps-heading text-5xl leading-tight">
        San Diego <em>Tech Scene</em>
      </h1>
      <p className="mt-4 text-ps-body font-light text-xl leading-relaxed max-w-xl">
        The best AI, startup, and tech events — local to San Diego and worth watching globally.
      </p>

      <div className="mt-8">
        <Link
          href="/events"
          className="inline-block bg-ps-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-ps-primary-hover transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Browse {eventCount} upcoming event{eventCount !== 1 ? "s" : ""} →
        </Link>
      </div>

      <div className="mt-16">
        <p className="font-mono uppercase tracking-widest text-xs text-ps-primary mb-4">
          What you'll find here
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.title}
              className="bg-ps-surface border border-ps-border rounded-xl p-5 transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(26,47,58,0.12)]"
            >
              <div className="font-serif text-ps-heading font-semibold">{c.title}</div>
              <div className="text-sm text-ps-muted font-light mt-1">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
    <SignupSection />
    </>
  )
}
