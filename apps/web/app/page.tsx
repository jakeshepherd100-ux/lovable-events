import Link from "next/link"
import { events } from "@/data/events"

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

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-white leading-tight">
        San Diego Tech Scene
      </h1>
      <p className="mt-4 text-sky-100 text-xl leading-relaxed max-w-xl">
        The best AI, startup, and tech events — local to San Diego and worth watching globally.
      </p>

      <div className="mt-8">
        <Link
          href="/events"
          className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Browse {events.length} upcoming events →
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-semibold text-white mb-4">What you'll find here</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <div key={c.title} className="bg-sky-100 rounded-lg p-4">
              <div className="font-semibold text-amber-800">{c.title}</div>
              <div className="text-sm text-gray-600 mt-1">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
