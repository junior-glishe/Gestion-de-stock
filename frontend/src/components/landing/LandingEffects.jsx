import { useEffect } from 'react'

/*
 * Effets du site d'origine :
 * - parallaxe légère sur le visuel du héro ([data-float])
 * - aimantation des grands boutons (.btn-landing)
 */
export default function LandingEffects() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const floaters = [...document.querySelectorAll('[data-float]')]
    let ticking = false

    const onScroll = () => {
      if (reduced) return
      floaters.forEach((element, index) => {
        if (!element.classList.contains('is-in')) return
        const rect = element.getBoundingClientRect()
        const offset =
          (rect.top + rect.height / 2 - window.innerHeight / 2) * (index ? 0.06 : -0.05)
        element.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
      })
      ticking = false
    }

    const requestTick = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(onScroll)
    }

    window.addEventListener('scroll', requestTick, { passive: true })

    const buttons = []
    const cleanups = []
    if (!reduced && window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.btn-landing').forEach((button) => {
        buttons.push(button)
        const onMove = (event) => {
          const rect = button.getBoundingClientRect()
          const x = (event.clientX - rect.left - rect.width / 2) * 0.14
          const y = (event.clientY - rect.top - rect.height / 2) * 0.22
          button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
        }
        const onLeave = () => {
          button.style.transform = ''
        }
        button.addEventListener('mousemove', onMove)
        button.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          button.removeEventListener('mousemove', onMove)
          button.removeEventListener('mouseleave', onLeave)
        })
      })
    }

    return () => {
      window.removeEventListener('scroll', requestTick)
      cleanups.forEach((cleanup) => cleanup())
      buttons.forEach((button) => {
        button.style.transform = ''
      })
    }
  }, [])

  return null
}
