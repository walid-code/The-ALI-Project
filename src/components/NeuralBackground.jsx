import { useEffect, useRef } from 'react'

const COLORS = ['#22d3ee', '#a855f7', '#f0abfc', '#38bdf8']

function NeuralBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let rafId = null
    let particles = []
    const mouse = { x: null, y: null }

    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      canvas.width = window.innerWidth * DPR
      canvas.height = window.innerHeight * DPR
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

      const count = Math.min(110, Math.floor((window.innerWidth * window.innerHeight) / 16000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        tw: Math.random() * Math.PI * 2,
      }))
    }

    function draw() {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.tw += 0.02

        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        const glow = 0.55 + 0.45 * Math.sin(p.tw)
        ctx.globalAlpha = 0.35 + glow * 0.5
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (0.8 + glow * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }

      const linkDist = 130
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.22
            ctx.globalAlpha = alpha
            ctx.strokeStyle = a.color
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        // mouse attraction
        if (mouse.x !== null && mouse.y !== null) {
          const a = particles[i]
          const dx = a.x - mouse.x
          const dy = a.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < 160) {
            ctx.globalAlpha = (1 - dist / 160) * 0.5
            ctx.strokeStyle = '#22d3ee'
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    function onMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function onMouseLeave() {
      mouse.x = null
      mouse.y = null
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      aria-hidden="true"
    />
  )
}

export default NeuralBackground
