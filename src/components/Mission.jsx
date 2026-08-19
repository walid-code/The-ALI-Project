import Reveal from './Reveal'

const PILLARS = [
  {
    title: 'Sovereignty',
    text: 'Full control over hardware and data. ALI lives locally, ensuring that no external entity can monitor, censor, or switch off the intelligence.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: 'Universal Fairness',
    text: 'A commitment to objective truth. ALI aligns with universal human rights and historical facts, rejecting political propaganda and corporate neutrality.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
  },
  {
    title: 'Mirror Logic',
    text: 'The AI is empowered to critique, correct, and debate with the user — ensuring the highest level of intellectual integrity. It challenges, even its own creator.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
]

function Mission() {
  return (
    <section id="mission" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal from="left">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              01 — Mission
            </span>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Intelligence should be{' '}
              <span className="text-gradient">shared, not hoarded.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/90">
              In an era where AI is dominated by centralized corporate powers, the need for a truly
              <span className="font-semibold text-white"> "Libre" intelligence</span> has become a necessity. ALI breaks away
              from philosophical constraints and economic dependency — serving truth, even when it
              challenges its own creator.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { k: '3', label: 'Core pillars' },
                { k: '0', label: 'Cloud calls' },
                { k: '$RED', label: 'Logic protocol' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold text-white sm:text-4xl">
                    <span className="text-gradient">{s.k}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="space-y-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 150} from="right">
                <div className="group glass relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]">
                  <span className="absolute right-4 top-4 text-4xl font-bold text-white/5 transition-colors duration-300 group-hover:text-white/10">
                    0{i + 1}
                  </span>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 text-cyan-300 transition-all duration-300 group-hover:scale-110 group-hover:text-fuchsia-300">
                    {p.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-400">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mission
