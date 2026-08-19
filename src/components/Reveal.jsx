import { useEffect, useRef, useState } from 'react'

function Reveal({ children, className = '', delay = 0, from = 'up' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const hidden =
    from === 'left'
      ? '-translate-x-12 opacity-0'
      : from === 'right'
        ? 'translate-x-12 opacity-0'
        : from === 'scale'
          ? 'scale-90 opacity-0'
          : 'translate-y-12 opacity-0'

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : hidden
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Reveal
