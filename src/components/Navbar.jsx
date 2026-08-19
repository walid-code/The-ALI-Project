import { useEffect, useState } from 'react'
import Logo from './Logo'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Mission', href: '#mission' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Architecture', href: '#architecture' },
  { label: '$RED', href: '#logic-red' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-void/80 py-3 shadow-[0_10px_40px_-15px_rgba(168,85,247,0.35)] backdrop-blur-xl'
          : 'bg-transparent py-6'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#home" className="group flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 transition-transform duration-500 group-hover:rotate-90">
            <Logo className="h-8 w-8" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            ALI<span className="text-gradient"> PROJECT</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/cv-walid-fodha.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-cyan-400/50 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            The Developer
          </a>
          <a
            href="https://github.com/walid-code/The-ALI-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-cyan-400/50 hover:text-white"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a
            href="#capabilities"
            className="rounded-lg border border-fuchsia-500/50 bg-fuchsia-500/10 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-fuchsia-500/25 hover:shadow-[0_0_24px_rgba(217,70,239,0.5)]"
          >
            Get involved
          </a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="space-y-1 border-t border-white/10 bg-void/95 px-6 py-4 backdrop-blur-xl">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/cv-walid-fodha.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              The Developer
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Navbar
