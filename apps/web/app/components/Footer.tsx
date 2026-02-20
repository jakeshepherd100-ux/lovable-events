import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-ps-footer-bg mt-16">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row gap-10 justify-between">
          {/* Brand */}
          <div>
            <div className="font-serif text-lg font-bold text-ps-nav-text">SD Tech Scene</div>
            <p className="mt-2 text-ps-nav-text/60 text-sm max-w-xs leading-relaxed">
              The best AI, startup, and tech events — local to San Diego and worth watching globally.
            </p>
          </div>

          <div className="flex gap-12">
            {/* Explore column */}
            <div>
              <div className="font-mono uppercase tracking-widest text-xs text-ps-gold mb-3">
                Explore
              </div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-ps-nav-text/50 hover:text-ps-nav-text transition-colors">Home</Link></li>
                <li><Link href="/events" className="text-ps-nav-text/50 hover:text-ps-nav-text transition-colors">Events</Link></li>
                <li><Link href="/about" className="text-ps-nav-text/50 hover:text-ps-nav-text transition-colors">About</Link></li>
              </ul>
            </div>

            {/* About column */}
            <div>
              <div className="font-mono uppercase tracking-widest text-xs text-ps-gold mb-3">
                About
              </div>
              <p className="text-ps-nav-text/50 text-sm max-w-[180px] leading-relaxed">
                A curated list of SD tech events, made public by someone who got tired of finding out too late.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-ps-muted text-sm">
            © {new Date().getFullYear()} SD Tech Scene
          </p>
        </div>
      </div>
    </footer>
  )
}
