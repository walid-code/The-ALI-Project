import Reveal from './Reveal'

const STACK = [
  'Python',
  'Ollama',
  'Qwen3',
  'ChromaDB',
  'FastAPI',
  'React 19',
  'Vite',
  'Rich CLI',
  'PyPDF2',
  'Tailwind CSS',
  'AES-256',
  'RAG',
]

const LAYERS = [
  {
    name: 'The Engine',
    desc: 'Ollama-powered local inference with Qwen3 models — fully sovereign, zero cloud dependency. The "Abliteration" process removes refusal vectors for fearless intelligence.',
    icon: '🧠',
  },
  {
    name: 'Private Memory (RAG)',
    desc: 'ChromaDB vector store with document ingestion. Converts archives into mathematical embeddings for semantic search — grounded in your professional reality.',
    icon: '📚',
  },
  {
    name: 'Agentic Core',
    desc: 'Self-correction with dual-instance "Critic" audits. Tool use via local Python interpreter. 24-hour memory consolidation cycles.',
    icon: '⚡',
  },
  {
    name: 'The Black Box',
    desc: 'Zero-knowledge architecture. Local inference perimeter, metadata scrubbing, anti-telemetry hardening. AES-256 encryption at disk level.',
    icon: '🔒',
  },
]

function TechStack() {
  return (
    <section id="architecture" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[80%] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              03 — Architecture
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              The <span className="text-gradient">Neural Architecture</span> of Sovereignty
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300/90">
              From the engine to the Black Box, each layer is decoupled, versioned, and sovereign.
              No external dependency. No cloud leak.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-16 space-y-6">
          {LAYERS.map((layer, i) => (
            <Reveal key={layer.name} delay={i * 120} from={i % 2 === 0 ? 'left' : 'right'}>
              <div className="group glass relative flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
                <span className="absolute -left-px top-1/2 h-0 w-0.5 -translate-y-1/2 bg-gradient-to-b from-cyan-400 to-fuchsia-400 transition-all duration-500 group-hover:h-full" />
                <div className="flex items-center gap-5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 text-2xl transition-transform duration-300 group-hover:scale-110">
                    {layer.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      <span className="text-gradient mr-2 font-mono text-sm">L{i + 1}</span>
                      {layer.name}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                      {layer.desc}
                    </p>
                  </div>
                </div>
                <span className="hidden shrink-0 items-center gap-2 text-xs text-slate-500 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
                  live
                </span>
              </div>
            </Reveal>
          ))}

          <div className="pointer-events-none absolute inset-y-4 left-4 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent sm:left-[6.6rem]" />
        </div>

        <Reveal>
          <div className="relative mt-20 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] py-5">
            <div className="flex w-max animate-marquee gap-14 whitespace-nowrap px-7">
              {[...STACK, ...STACK].map((tech, i) => (
                <span key={i} className="flex items-center gap-3 text-lg font-semibold text-slate-400">
                  <span className="text-cyan-400">▍</span>
                  {tech}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default TechStack
