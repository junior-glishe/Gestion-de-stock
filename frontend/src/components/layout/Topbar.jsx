import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBell, IconLayers, IconLogout, IconMenu, IconPanel } from '../../lib/icons'
import { initials } from '../../lib/format'

/* Barre supérieure : menu, fil d'Ariane, alertes et compte. */

export default function Topbar({
  pageTitle,
  role,
  hasAlerts,
  openAlerts,
  user,
  onOpenMenu,
  onToggleSidebar,
  onLogout,
}) {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`tb${scrolled ? ' scrolled' : ''}`}>
      <div className="tb-in">
        <button type="button" className="ic-btn lg:hidden!" onClick={onOpenMenu} aria-label="Ouvrir le menu">
          <IconMenu />
        </button>
        <button
          type="button"
          className="ic-btn hidden! lg:grid!"
          onClick={onToggleSidebar}
          aria-label="Réduire ou étendre le menu"
        >
          <IconPanel />
        </button>

        <p className="tb-crumb">
          <IconLayers />
          <b>{pageTitle}</b>
        </p>

        <div className="tb-r">
          {hasAlerts ? (
            <button
              type="button"
              className="ic-btn"
              onClick={() => navigate(`/${role}/alertes`)}
              aria-label="Voir les alertes"
            >
              <IconBell />
              <span className={`tb-badge${openAlerts ? '' : ' off'}`}>{openAlerts}</span>
            </button>
          ) : null}

          <div className="tb-id">
            <span className="av">{initials(user.nom)}</span>
            <span className="meta">
              <b>{user.nom}</b>
              <span>{user.email}</span>
            </span>
          </div>

          <button type="button" className="btn btn-g btn-md hidden! sm:inline-flex!" onClick={onLogout}>
            <IconLogout />
            Quitter
          </button>
        </div>
      </div>
    </header>
  )
}
