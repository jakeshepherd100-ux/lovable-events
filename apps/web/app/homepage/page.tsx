import Link from "next/link"

export default function HomePageAlias() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="font-serif text-ps-heading text-2xl font-bold">Homepage</h1>
      <p className="mt-2 text-ps-muted">This route exists because you visited /homepage.</p>
      <div className="mt-4 flex gap-3">
        <Link className="underline text-ps-primary" href="/">Go to /</Link>
        <Link className="underline text-ps-primary" href="/events">Go to /events</Link>
      </div>
    </main>
  )
}
