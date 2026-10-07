import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { IconClose, IconLogout } from '../../lib/icons'
import { initials } from '../../lib/format'

/* Menu latéral de l'espace de gestion. */

export default function Sidebar({ space, role, currentPage, openAlerts, user, onClose, onLogout }) {
  return (
    <aside className="sb">
      <div className="sb-top">
        <Link to="/" className="sb-logo" aria-label="StockPro – Accueil">
          <img src="/images/logo.png" alt="StockPro" />
        </Link>
        <button type="button" className="sb-x lg:hidden!" onClick={onClose} aria-label="Fermer le menu">
          <IconClose />
        </button>
      </div>

      <nav className="sb-nav" aria-label="Navigation principale">
        {space.groups.map((group) => (
          <Fragment key={group.label}>
            <p className="sb-lab">{group.label}</p>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = item.key === currentPage
              return (
                <Link
                  key={item.key}
                  to={`/${role}/${item.key}`}
                  className={`nav-i${isActive ? ' on' : ''}`}
                  data-tip={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon />
                  <span className="lbl">{item.label}</span>
                  {item.key === 'alertes' && openAlerts > 0 ? (
                    <span className="cnt">{openAlerts}</span>
                  ) : null}
                </Link>
              )
            })}
          </Fragment>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="sb-user">
          <span className="av">{initials(user.nom)}</span>
          <span className="meta">
            <b>{user.nom}</b>
            <span>{space.label}</span>
          </span>
        </div>
        <Link to="/" className="sb-out" onClick={onLogout}>
          <IconLogout />
          <span className="lbl">Quitter l'espace</span>
        </Link>
      </div>
    </aside>
  )
}
