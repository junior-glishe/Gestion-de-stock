import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { SPACES, PAGE_META, findSpaceItem } from '../../data/navigation'
import { useAuth } from '../../store/AuthContext'
import { useStore } from '../../store/StoreContext'
import { useUi } from '../../store/UiContext'
import { SpaceProvider } from '../../store/SpaceContext'

const SIDEBAR_KEY = 'stockpro_sidebar_collapsed'

/*
 * Coque des espaces de gestion : menu latéral, barre du haut,
 * contenu de la page (Outlet) et pied de page.
 */

export default function SpaceLayout({ role }) {
  const space = SPACES[role]
  const { page } = useParams()
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()
  const { data } = useStore()
  const { confirmAction } = useUi()

  const [navOpen, setNavOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_KEY) === '1')
  const [failed, setFailed] = useState(false)

  /* Ouverture directe d'une URL d'espace : sans session, on connecte le
     compte de démonstration ; avec une session, on renvoie l'utilisateur
     vers l'espace correspondant à son rôle en base. */
  useEffect(() => {
    if (!user) {
      setFailed(false)
      login(role).catch(() => setFailed(true))
    } else if (user.role !== role) {
      navigate(`/${user.role}/${SPACES[user.role].defaultPage}`, { replace: true })
    }
  }, [role, user, login, navigate])

  if (!user) {
    return failed ? (
      <main className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-3">Connexion à l'impossible</h1>
          <p className="text-neutral-500 leading-7">
            L'API est injoignable. Démarrez le backend (
            <code className="px-1 rounded bg-neutral-100">npm run dev</code> dans le dossier{' '}
            <code className="px-1 rounded bg-neutral-100">backend</code>) puis rechargez la page.
          </p>
        </div>
      </main>
    ) : null
  }

  const item = findSpaceItem(role, page)
  if (!item) return <Navigate to={`/${role}/${space.defaultPage}`} replace />

  const pageTitle = PAGE_META[page]?.title || item.label
  const openAlerts = data.alerts.filter((alert) => !alert.traitee).length
  const hasAlerts = space.groups.some((group) =>
    group.items.some((entry) => entry.key === 'alertes'),
  )

  const toggleSidebar = () => {
    setCollapsed((previous) => {
      localStorage.setItem(SIDEBAR_KEY, String(!previous))
      return !previous
    })
  }

  const handleLogout = (event) => {
    event.preventDefault()
    confirmAction({
      title: 'Quitter l’espace ?',
      sub: 'Vous serez ramené vers le site public.',
      message: 'Voulez-vous vraiment quitter votre espace de gestion ?',
      ok: 'Se déconnecter',
      onConfirm: async () => {
        await logout()
        navigate('/')
      },
    })
  }

  return (
    <SpaceProvider role={role}>
      <div className={`app${collapsed ? ' col' : ''}${navOpen ? ' nav-open' : ''}`}>
        <Sidebar
          space={space}
          role={role}
          currentPage={page}
          openAlerts={openAlerts}
          user={user}
          onClose={() => setNavOpen(false)}
          onLogout={handleLogout}
        />
        <div className="sb-scrim" onClick={() => setNavOpen(false)} />

        <div className="shell">
          <Topbar
            pageTitle={pageTitle}
            role={role}
            hasAlerts={hasAlerts}
            openAlerts={openAlerts}
            user={user}
            onOpenMenu={() => setNavOpen(true)}
            onToggleSidebar={toggleSidebar}
            onLogout={handleLogout}
          />

          <main className="wrap">
            <div className="fade" key={page}>
              <Outlet />
            </div>
          </main>

          <footer className="ft">
            <div className="ft-in">
              <p>
                © {new Date().getFullYear()} StockPro · {space.label}
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SpaceProvider>
  )
}
