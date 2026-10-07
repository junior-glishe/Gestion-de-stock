import { useEffect, useRef } from 'react'

/*
 * Apparition animée au défilement : la classe `is-in` est ajoutée
 * lorsque l'élément entre dans le champ de vision.
 *
 * <Reveal variant="reveal-zoom" delay={140}>…</Reveal>
 */
export default function Reveal({
  as: Tag = 'div',
  variant = '',
  delay = null,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          element.classList.add('is-in')
          observer.unobserve(element)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${variant} ${className}`.trim()}
      style={delay !== null ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
