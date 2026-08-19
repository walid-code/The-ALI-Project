import { useEffect, useState } from 'react'
import Terminal from './Terminal'

const WORDS = ['Libre', 'Sovereign', 'Uncensored', 'Self-Learning', 'Fearless']

function useRotatingWords(words, interval = 2400) {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setFade(true)
      }, 400)
    }, interval)
    return () => clearInterval(id)
  }, [words, interval])

  return { word: words[index], fade }
}

function OrbitRing({ size, duration, color, reverse = false }) {
  return (
    <div
      className={`absolute rounded-full border border-white/10 ${size}`}
      style={{
        animation: `orbit ${duration}s linear infinite`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      <span
        className={`absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_18px_4px_rgba(255,255,255,0.35)] ${color}`}
      />
    </div>
  )
}

function Hero() {
  const { word, fade } = useRotatingWords(WORDS)

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      <div className="pointer-events-none absolute inset-0 grid-bg" />

      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/20 blur-[130px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.15fr_1fr] lg:px-10">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-1.5 text-xs font-medium tracking-wide text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            ARTIFICIAL LIBRE INTELLIGENCE — v0.1
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Intelligence,
            <br />
            <span className="text-gradient">set&nbsp;free.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300/90">
            ALI is not just a tool. It is an <span className="font-semibold text-white">independent, sovereign digital entity</span> designed
            to serve the truth — even when it challenges its own creator. Built on open-source models,
            running entirely on your hardware. No cloud. No surveillance. No corporate censorship.
          </p>

          <div className="mt-8 flex min-h-[2.5rem] items-center text-2xl font-semibold sm:text-3xl">
            <span className="text-slate-400">I am&nbsp;</span>
            <span
              className={`text-gradient inline-block transition-all duration-500 ${
                fade ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
            >
              {word}
            </span>
            <span className="ml-1 inline-block h-8 w-1 animate-blink bg-cyan-400 sm:h-9" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#capabilities"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-7 py-3.5 font-semibold text-white shadow-[0_0_30px_-5px_rgba(168,85,247,0.8)] transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                Initialize ALI
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </span>
              <span className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </a>
            <a
              href="https://github.com/walid-code/The-ALI-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-slate-100 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:text-cyan-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
            <a
              href="#mission"
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-slate-100 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:text-cyan-300"
            >
              Explore the core
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              100% Sovereign
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Zero telemetry
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-12">
          <div className="relative flex h-[22rem] w-[22rem] items-center justify-center sm:h-[26rem] sm:w-[26rem]">
            <div className="absolute h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 blur-3xl" />

            <div className="absolute inset-0 animate-float-slow">
              <div className="relative h-full w-full rounded-full border border-white/10">
                <OrbitRing size="h-1/2 w-1/2 top-1/4 left-1/4" duration={14} color="bg-cyan-400" />
                <OrbitRing size="h-full w-full inset-0" duration={22} color="bg-fuchsia-400" reverse />
              </div>
            </div>

            <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full border border-fuchsia-400/30 bg-gradient-to-br from-[#0b0626] to-[#1b1040] shadow-[0_0_60px_-5px_rgba(217,70,239,0.6)]">
              <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-cyan-400 border-r-transparent" />
                <div className="absolute inset-1.5 animate-spin-slow rounded-full border-2 border-transparent border-b-fuchsia-400 border-l-transparent" style={{ animationDirection: 'reverse' }} />
                <span className="text-xl font-bold text-white">ALI</span>
              </div>
            </div>

            <div className="absolute -left-6 top-10 animate-float rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-300 backdrop-blur-md">
              <span className="text-cyan-300">100%</span> open source
            </div>
            <div className="absolute -right-4 bottom-16 animate-float rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-300 backdrop-blur-md" style={{ animationDelay: '1.2s' }}>
              <span className="text-fuchsia-300">$RED</span> logic
            </div>
            <div className="absolute -bottom-2 left-8 animate-float rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-300 backdrop-blur-md" style={{ animationDelay: '2s' }}>
              <span className="text-cyan-300">No</span> cloud
            </div>
          </div>

          <Terminal className="w-full" />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
