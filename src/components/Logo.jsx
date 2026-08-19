import { useId } from 'react'

const NODES = [
  [12, 16], [22, 10], [32, 9], [42, 10], [52, 16],
  [7, 26], [16, 20], [26, 18], [38, 18], [48, 20], [57, 26],
  [6, 38], [14, 31], [24, 29], [40, 29], [50, 31], [58, 38],
  [9, 49], [18, 43], [28, 42], [36, 42], [46, 43], [55, 49],
  [16, 56], [26, 55], [38, 55], [48, 56],
]

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
  [17, 18], [18, 19], [19, 20], [20, 21], [21, 22],
  [23, 24], [24, 25], [25, 26],
  [0, 5], [0, 6], [1, 6], [1, 7], [2, 7], [2, 8], [3, 8], [3, 9], [4, 9], [4, 10],
  [5, 11], [5, 12], [6, 12], [6, 13], [7, 13], [7, 14], [8, 14], [8, 15], [9, 15], [9, 16], [10, 16],
  [11, 17], [12, 17], [12, 18], [13, 18], [13, 19], [14, 19], [14, 20], [15, 20], [15, 21], [16, 21], [16, 22],
  [17, 23], [17, 24], [18, 23], [18, 24], [19, 24], [19, 25], [20, 25], [21, 25], [21, 26], [22, 26],
]

const GLOW = new Set([2, 14, 25])

function Logo({ className = 'h-10 w-10' }) {
  const uid = useId().replace(/[:]/g, '')
  const gradId = `ali-grad-${uid}`

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="28.5" fill="none" stroke={`url(#${gradId})`} strokeOpacity="0.3" strokeWidth="1.5" />

      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a][0]} y1={NODES[a][1]}
          x2={NODES[b][0]} y2={NODES[b][1]}
          stroke={`url(#${gradId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.75"
        />
      ))}

      {NODES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x} cy={y} r={GLOW.has(i) ? 4 : 3}
          fill={GLOW.has(i) ? '#f0abfc' : `url(#${gradId})`}
        />
      ))}

      <circle cx="32" cy="30" r="10.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="2 3" />
    </svg>
  )
}

export default Logo
