import Link from "next/link"

export default function Nav() {
  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg tracking-tight hover:text-sky-300 transition-colors">
        SD Tech Scene
      </Link>
      <div className="flex gap-6 text-sm">
        <Link href="/" className="hover:text-sky-300 transition-colors">Home</Link>
        <Link href="/events" className="hover:text-sky-300 transition-colors">Events</Link>
        <Link href="/about" className="hover:text-sky-300 transition-colors">About</Link>
      </div>
    </nav>
  )
}
