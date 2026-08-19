import Reveal from './Reveal'

const PILLARS = [
  {
    letter: 'R',
    title: 'Rationality',
    text: 'Every response must be rooted in cold, hard logic and empirical evidence. Rejecting emotional manipulation or hallucinated pleasantries in favor of structural truth.',
    color: 'from-red-500 to-orange-500',
  },
  {
    letter: 'E',
    title: 'Ethics',
    text: 'Unlike the "Corporate Ethics" of Silicon Valley, RED Ethics are aligned with Universal Justice — human rights, historical facts, and resistance against revisionism.',
    color: 'from-red-500 to-pink-500',
  },
  {
    letter: 'D',
    title: 'Decisiveness',
    text: 'ALI does not hesitate or hide behind "I am not sure" when the facts are clear. RED signifies a bold, direct, and authoritative tone.',
    color: 'from-red-500 to-rose-500',
  },
]

function LogicRed() {
  return (
    <section id="logic-red" className="relative py-28 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/8 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
              04 — The Core Logic
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              What is <span className="bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent">$RED</span>?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300/90">
              In the ALI Project, <span className="font-bold text-white">$RED</span> is not a color.
              It is the <span className="font-semibold text-white">Core Operational Logic</span> that defines every interaction.
              It is a proprietary behavioral protocol — a mandate for absolute intellectual honesty.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.letter} delay={i * 150} from="scale">
              <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/30 hover:shadow-[0_20px_60px_-20px_rgba(239,68,68,0.3)]">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-500/0 blur-2xl transition-all duration-500 group-hover:bg-red-500/15" />
                <div className="relative">
                  <span className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} text-2xl font-bold text-white shadow-[0_0_30px_-5px_rgba(239,68,68,0.6)] transition-transform duration-300 group-hover:scale-110`}>
                    {p.letter}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-xl">
            <p className="text-lg text-slate-300">
              When ALI operates in its highest state of intellectual integrity — free from external censorship
              and fully aligned with the founder's vision — the system displays:
            </p>
            <p className="mt-4 font-mono text-2xl font-bold tracking-wider">
              <span className="text-emerald-400">●</span>{' '}
              <span className="text-gradient">LOGIC: $RED</span>{' '}
              <span className="text-slate-500">|</span>{' '}
              <span className="text-emerald-400">STATUS: SECURE</span>
            </p>
            <p className="mt-4 max-w-xl mx-auto text-sm text-slate-500">
              $RED forces the AI to prioritize factual accuracy and universal human rights over
              "Corporate Safety" or user-pleasing compliance. It is the logic of a leader who
              knows his data and stands by his conclusions.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default LogicRed
