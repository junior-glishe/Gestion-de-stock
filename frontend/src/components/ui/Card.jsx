/* Carte blanche avec en-tête (icône + titre) et corps. */

const SPAN_CLASSES = { 2: 'col-span-2 lg:col-span-2', 3: 'col-span-2 lg:col-span-3', 4: 'col-span-2 lg:col-span-4' }

export default function Card({
  title,
  sub,
  icon,
  tone = '',
  right,
  children,
  span,
  lift = false,
  pad = true,
  className = '',
}) {
  return (
    <section className={`card${lift ? ' lift' : ''} ${SPAN_CLASSES[span] || ''} ${className}`}>
      {title ? (
        <header className="card-h">
          {icon ? <span className={`ic ${tone}`}>{icon}</span> : null}
          <div>
            <h3>{title}</h3>
            {sub ? <p>{sub}</p> : null}
          </div>
          {right ? <div className="r">{right}</div> : null}
        </header>
      ) : null}

      {pad ? <div className="card-b">{children}</div> : children}
    </section>
  )
}
