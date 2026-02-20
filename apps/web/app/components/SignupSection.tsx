"use client"

import { useState } from "react"

export default function SignupSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMsg(data.error ?? "Something went wrong.")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Something went wrong. Please try again.")
    }
  }

  return (
    <section
      className="relative py-20 px-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--primary) 0%, #0a5f7a 100%)" }}
    >
      {/* Coral glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 120%, rgba(244,123,94,0.2) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-xl mx-auto text-center">
        <p
          className="font-mono uppercase tracking-widest text-xs mb-3"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Stay in the loop
        </p>
        <h2 className="font-serif text-white text-3xl sm:text-4xl font-bold leading-tight">
          Never miss a San Diego tech event.
        </h2>
        <p className="mt-3 font-light text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
          Weekly digest, every Monday morning. No spam, ever.
        </p>

        {status === "success" ? (
          <p className="mt-10 font-serif text-white text-xl italic">
            You're in! See you Monday.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                style={{ backgroundColor: "white", color: "var(--heading)" }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 rounded text-white text-sm font-medium transition-colors disabled:opacity-60 hover:brightness-90"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </div>

            {errorMsg && (
              <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                {errorMsg}
              </p>
            )}

            <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Join 200+ SD tech enthusiasts
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
