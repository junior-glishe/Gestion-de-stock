import { IconPlus } from '../../lib/icons'

/*
 * Blocs repliables utilisés pour les formulaires d'ajout.
 * `CollapseButton` se place dans les actions du bandeau de page,
 * `CollapsePanel` contient le formulaire à afficher ou masquer.
 */

export function CollapseButton({ open, onToggle, openLabel, closeLabel, icon }) {
  return (
    <button
      type="button"
      className="btn btn-p btn-md"
      aria-expanded={open}
      onClick={onToggle}
    >
      <span className="lbtxt">{open ? closeLabel : openLabel}</span>
      {icon || <IconPlus />}
    </button>
  )
}

export function CollapsePanel({ open, children }) {
  return (
    <div className={`pnl${open ? ' open' : ''}`}>
      <div className="in">{children}</div>
    </div>
  )
}
