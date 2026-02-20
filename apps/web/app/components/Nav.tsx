import Link from "next/link"

export default function Nav() {
  return (
    <nav className="bg-ps-nav-bg sticky top-0 z-50 h-16 px-6 flex items-center justify-between">
      <Link href="/" className="font-serif text-lg font-bold text-ps-nav-text tracking-tight">
        SD Tech Scene
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/" className="text-ps-nav-text/75 hover:text-ps-nav-text transition-colors">Home</Link>
        <Link href="/events" className="text-ps-nav-text/75 hover:text-ps-nav-text transition-colors">Events</Link>
        <Link href="/about" className="text-ps-nav-text/75 hover:text-ps-nav-text transition-colors">About</Link>
        <Link href="/contact" className="text-ps-nav-text/75 hover:text-ps-nav-text transition-colors">Contact</Link>
        <Link
          href="/events"
          className="bg-ps-accent text-white px-4 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Browse Events
        </Link>
      </div>
    </nav>
  )
}
