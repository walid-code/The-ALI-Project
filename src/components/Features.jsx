import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

const CAPABILITIES = [
  {
    title: 'Full-Stack Sovereign Developer',
    text: 'ALI scaffolds entire web applications — React, Tailwind, Python backends — and runs unit tests on its own suggestions before presenting them.',
    tag: 'dev',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: 'Private RAG Memory',
    text: 'Ingest PDF, DOCX, TXT, CSV into ChromaDB. Semantic search across your private knowledge base — grounded in your specific professional reality.',
    tag: 'memory',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    title: 'Self-Critique Engine',
    text: 'Dual-instance checks where a "Critic" audits logical outputs. ALI critiques, corrects, and debates — even its own creator.',
    tag: 'critique',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Truth-Centric Analysis',
    text: 'Trained on documented historical records and international human rights reports. Rejects the "Neutrality Trap" — provides analysis rooted in verified facts.',
    tag: 'truth',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: 'Zero-Knowledge Security',
    text: 'Every query stays in volatile RAM. Metadata scrubbed. No telemetry pings. AES-256 encryption at disk level. The Black Box Protocol.',
    tag: 'security',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'No Tokens. Ever.',
    text: 'No metering, no rate limits, no premium tier for truth. ALI performs thousands of document analyses for the cost of electricity alone.',
    tag: 'freedom',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
]

function StatsCounter({ target, suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(target * eased)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString('en-US')

  return (
    <span ref={ref} className="text-gradient text-4xl font-bold sm:text-5xl">
      {formatted}
      {suffix}
    </span>
  )
}

function Features() {
  return (
    <section id="capabilities" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-400">
              02 — Capabilities
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              A mind with <span className="text-gradient">many dimensions</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300/90">
              From full-stack development to truth-centric historical analysis — six core systems,
              one coherent intelligence. Each module is independently auditable.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.title} delay={(i % 3) * 120} from="scale">
              <div className="group glass relative h-full overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:border-fuchsia-400/30 hover:shadow-[0_20px_60px_-20px_rgba(168,85,247,0.6)]">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-500/0 blur-2xl transition-all duration-500 group-hover:bg-fuchsia-500/20" />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/15 to-fuchsia-500/15 text-cyan-300 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:text-fuchsia-300">
                      {cap.icon}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-500 transition-colors duration-300 group-hover:border-fuchsia-400/30 group-hover:text-fuchsia-300">
                      {cap.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{cap.text}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors duration-300 group-hover:text-cyan-300">
                    <span className="h-px w-8 bg-current" />
                    Learn module
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-20 grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
            {[
              { target: 1, suffix: '', label: 'Fully local system' },
              { target: 3, suffix: '', label: 'Core pillars' },
              { target: 0, suffix: '', label: 'Telemetry sent' },
              { target: 100, suffix: '%', label: 'Open source' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <StatsCounter {...stat} />
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Features
