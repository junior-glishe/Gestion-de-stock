import { useEffect, useState } from 'react'

/* Barre de progression de lecture, en haut de la page. */
export default function ScrollProgress() {
  const [ratio, setRatio] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setRatio(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      id="progress"
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-brand"
      style={{ transform: `scaleX(${ratio})` }}
    />
  )
}
