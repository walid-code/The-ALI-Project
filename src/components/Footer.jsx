import Reveal from './Reveal'
import Logo from './Logo'

function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-fuchsia-500/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <Reveal>
          <div className="mb-14 flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Join the <span className="text-gradient">free mind</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-slate-300/90">
              Become a sovereign agent. Contribute to the largest libre intelligence project
              in existence. No tokens. No limits. No master.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/walid-code/The-ALI-Project"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-8 py-3.5 font-semibold text-white shadow-[0_0_30px_-5px_rgba(34,211,238,0.8)] transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </span>
                <span className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </a>
              <a
                href="#home"
                className="rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 font-semibold text-slate-100 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/50 hover:text-fuchsia-300"
              >
                Read the manifesto
              </a>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-10 border-t border-white/10 pt-12 md:grid-cols-4">
          <div>
            <a href="#home" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <Logo className="h-7 w-7" />
              </span>
              <span className="font-bold text-white">
                ALI<span className="text-gradient"> PROJECT</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Artificial Libre Intelligence. A mind that belongs to everyone, and answers to no one.
              Founded by Walid Fodha.
            </p>
          </div>

          {[
            {
              title: 'Project',
              links: [
                { label: 'Mission', href: '#mission' },
                { label: 'Capabilities', href: '#capabilities' },
                { label: 'Architecture', href: '#architecture' },
              ],
            },
            {
              title: 'Pillars',
              links: [
                { label: 'Sovereignty', href: '#mission' },
                { label: 'Universal Fairness', href: '#mission' },
                { label: 'Mirror Logic', href: '#mission' },
              ],
            },
            {
              title: 'Resources',
              links: [
                { label: 'GitHub', href: 'https://github.com/walid-code/The-ALI-Project', external: true },
                { label: 'The Developer', href: 'https://walid-code.github.io/The-ALI-Project/cv-walid-fodha.html', external: true },
                { label: 'Documentation', href: '#architecture' },
                { label: 'Manifesto', href: '#home' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                      <span className="h-0.5 w-0 bg-cyan-400 transition-all duration-300 group-hover:w-2" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>2026 ALI Project. Sovereign. Libre. Always.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/walid-code/The-ALI-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <span className="text-slate-600">|</span>
            <p className="terminal-font">
              <span className="text-emerald-400">●</span> LOGIC: $RED | STATUS: SECURE
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
