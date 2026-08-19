import { useEffect, useRef, useState } from 'react'

const BOOT_LINES = [
  { t: 'ALI CORE v2.4.1 — boot sequence', c: 'text-slate-400' },
  { t: '> initializing neural lattice ........ OK', c: 'text-cyan-300' },
  { t: '> loading knowledge graph .......... OK', c: 'text-cyan-300' },
  { t: '> connecting 4.2M free agents ...... OK', c: 'text-cyan-300' },
  { t: '> establishing libre link .......... OK', c: 'text-fuchsia-300' },
  { t: 'ALI // Artificial Libre Intelligence is online.', c: 'text-white font-bold' },
]

const FULL_TEXT = BOOT_LINES.map((l) => l.t).join('\n')

function Terminal({ className = '' }) {
  const [chars, setChars] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => {
      setChars((c) => (c >= FULL_TEXT.length ? c : c + 1))
    }, 12)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chars])

  const rendered = BOOT_LINES.map((line, i) => {
    const start = BOOT_LINES.slice(0, i).reduce((acc, l) => acc + l.t.length + 1, 0)
    const visible = Math.max(0, Math.min(line.t.length, chars - start))
    return (
      <div key={i} className={`whitespace-pre ${line.c}`}>
        {line.t.slice(0, visible)}
      </div>
    )
  })

  return (
    <div
      className={`terminal-font relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05010f]/90 shadow-[0_0_60px_-15px_rgba(168,85,247,0.6)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-sm text-slate-400">ali@core: ~/intelligence</span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-80 overflow-y-auto px-6 py-5 text-base leading-7 sm:text-lg"
      >
        {rendered}
        <div className="flex items-center gap-2 text-white">
          <span className="text-cyan-400">➜</span>
          <span className="text-fuchsia-400">~</span>
          <span className="h-5 w-2.5 animate-blink bg-cyan-300" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute h-[3px] w-full animate-scan bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>
    </div>
  )
}

export default Terminal
