export default function ContactPage() {
  return (
    <>
      {/* Hero with wave transition */}
      <section className="relative bg-ps-nav-bg pt-20 pb-36 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono uppercase tracking-widest text-xs text-ps-primary-hover mb-4">
            Get In Touch
          </p>
          <h1 className="font-serif text-white text-4xl sm:text-5xl leading-tight">
            Let's build San Diego's tech community —{" "}
            <em>together.</em>
          </h1>
          <p className="mt-5 text-ps-nav-text/70 text-xl font-light max-w-xl leading-relaxed">
            Whether you're organizing an event, want to partner, or just want to say hi — I'd love to hear from you.
          </p>
        </div>

        {/* Wave bottom transition */}
        <div className="absolute bottom-0 left-0 right-0 leading-none overflow-hidden">
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="w-full h-12 sm:h-16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
              fill="var(--bg)"
            />
          </svg>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-ps-bg px-6 py-16">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">

          {/* Email card */}
          <div className="bg-ps-surface border border-ps-border rounded-xl p-8">
            <div className="mb-4 text-ps-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h2 className="font-serif text-ps-heading text-xl font-semibold mb-2">
              Send an Email
            </h2>
            <p className="text-ps-muted text-sm leading-relaxed mb-6">
              Best for event submissions, partnerships, or general questions.
            </p>
            <a
              href="mailto:jake.shepherd100@gmail.com"
              className="inline-block border border-ps-primary text-ps-primary px-5 py-2 rounded-lg text-sm font-medium hover:bg-ps-primary hover:text-white transition-all"
            >
              jake.shepherd100@gmail.com
            </a>
          </div>

          {/* LinkedIn card */}
          <div className="bg-ps-surface border border-ps-border rounded-xl p-8">
            <div className="mb-4 text-ps-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </div>
            <h2 className="font-serif text-ps-heading text-xl font-semibold mb-2">
              Connect on LinkedIn
            </h2>
            <p className="text-ps-muted text-sm leading-relaxed mb-6">
              Follow along for updates on SD's AI and tech scene.
            </p>
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-ps-primary text-ps-primary px-5 py-2 rounded-lg text-sm font-medium hover:bg-ps-primary hover:text-white transition-all"
            >
              View LinkedIn Profile
            </a>
          </div>

        </div>
      </section>
    </>
  )
}
