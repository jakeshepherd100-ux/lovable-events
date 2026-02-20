import Link from "next/link"

export default function HomePageAlias() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Homepage</h1>
      <p className="mt-2 text-gray-600">This route exists because you visited /homepage.</p>
      <div className="mt-4 flex gap-3">
        <Link className="underline" href="/">Go to /</Link>
        <Link className="underline" href="/events">Go to /events</Link>
      </div>
    </main>
  )
}
