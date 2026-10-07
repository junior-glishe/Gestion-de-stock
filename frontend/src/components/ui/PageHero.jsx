import { IconLayers } from '../../lib/icons'
import { longDate } from '../../lib/format'

/*
 * Bandeau d'en-tête vert des pages de l'espace de gestion.
 * Sur le tableau de bord, le titre devient une salutation personnalisée.
 */

export default function PageHero({ spaceLabel, icon, title, description, actions }) {
  return (
    <section className="hero">
      <div className="hero-in">
        <p className="hero-eye">
          <span className="ic">
            <IconLayers />
          </span>
          <span>
            {spaceLabel} · {longDate()}
          </span>
        </p>
        <h1>{title}</h1>
        <p className="hero-sub">{description}</p>
        {actions ? <div className="hero-acts">{actions}</div> : null}
      </div>
      <div className="hero-side">{icon}</div>
    </section>
  )
}
