import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_PASSWORD, useAuth } from '../../store/AuthContext'
import { SPACES } from '../../data/navigation'

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function CrossIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function NoticeToast({ notice }) {
  const success = notice.type === 'success'
  const duration = success ? 2200 : 3500
  return (
    <div
      role={success ? 'status' : 'alert'}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2.5rem)] sm:w-96 overflow-hidden rounded-xl border shadow-2xl ${
        success ? 'bg-emerald-600 border-emerald-700/70' : 'bg-red-600 border-red-700/70'
      }`}
      style={{ animation: 'fadeUp .3s cubic-bezier(.22,1,.36,1) both' }}
    >
      <div className="flex items-start gap-3 px-5 py-4 text-white">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 backdrop-blur ${
            success ? '' : ''
          }`}
        >
          {success ? <CheckIcon className="h-5 w-5" /> : <CrossIcon className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <p className="font-semibold leading-tight">{success ? 'Connexion réussie !' : 'Connexion impossible'}</p>
          <p className="mt-1 text-sm leading-5 text-white/90">{notice.message}</p>
        </div>
      </div>
      <div className="h-1.5 bg-white/25">
        <div
          data-progress
          className="h-full bg-white rounded-r-full"
          style={{ animation: `drainBar ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  )
}

/* Page de connexion : l'authentification se fait contre la base
   (POST /api/auth/login) et l'espace ouvert dépend du rôle stocké
   en base — aucun choix d'acteur dans le formulaire. */
export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState(SPACES.gestionnaire.demoUser.email)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(() => Number(sessionStorage.getItem('stockpro_failed') || 0))
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setNotice(null)
    try {
      const account = await login(null, { email, motDePasse: password })
      sessionStorage.removeItem('stockpro_failed')
      setNotice({ type: 'success', message: `Bienvenue ${account.nom ?? 'sur votre espace'} ! Redirection en cours…` })
      setTimeout(() => {
        if (mountedRef.current) navigate(`/${account.role}/${SPACES[account.role].defaultPage}`)
      }, 2200)
    } catch (err) {
      const next = failed + 1
      setFailed(next)
      sessionStorage.setItem('stockpro_failed', String(next))
      if (next >= 3) {
        navigate('/acces-bloque')
        return
      }
      setNotice({ type: 'error', message: err.message })
      setTimeout(() => {
        if (mountedRef.current) setNotice(null)
      }, 3500)
    } finally {
      if (mountedRef.current) setBusy(false)
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* FORMULAIRE (gauche) */}
      <section className="anim-form flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-10">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="inline-block anim-up anim-d1" aria-label="StockPro – Accueil">
            <img src="/images/logo.png" alt="StockPro" className="h-12 w-auto object-contain" />
          </Link>
          <h1 className="mt-10 text-3xl sm:text-4xl font-bold anim-up anim-d2">Connexion</h1>
          <p className="mt-3 text-neutral-500 leading-7 anim-up anim-d3">
            Accédez à votre espace pour gérer vos produits, vos entrées / sorties et vos alertes de
            stock bas.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="anim-up anim-d4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vous@exemple.com"
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="anim-up anim-d5">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-neutral-200 rounded-lg pl-4 pr-20 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <button
                  type="button"
                  id="toggle"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-brand"
                  onClick={() => setShowPassword((shown) => !shown)}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <div className="anim-up flex items-center justify-between text-sm" style={{ animationDelay: '.62s' }}>
              <label className="flex items-center gap-2 text-neutral-600">
                <input type="checkbox" className="accent-brand h-4 w-4" />
                Se souvenir de moi
              </label>
              <button
                type="button"
                className="ul-link text-brand hover:text-brand"
                onClick={() => setForgotOpen(true)}
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-login anim-up w-full bg-brand hover:bg-brand-dark text-white rounded-lg py-3 font-medium disabled:opacity-60"
              style={{ animationDelay: '.7s' }}
            >
              {busy ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-4 text-sm text-center anim-up" style={{ animationDelay: '.78s' }}>
            <Link to="/" className="ul-link text-neutral-500 hover:text-brand">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </section>

      {/* IMAGE (droite) */}
      <aside className="anim-aside relative hidden lg:block bg-brand overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
          alt="Entrepôt et gestion de stock"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-14 text-white max-w-lg">
          <h2 className="text-3xl font-bold leading-tight">
            Gardez le contrôle de votre stock, sans rupture.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/90">
            Produits, catégories, entrées, sorties et alertes de stock bas : tout au même endroit.
          </p>
        </div>
      </aside>

      {forgotOpen ? (
        <div className="fixed inset-0 z-[110] grid place-items-center px-5">
          <div className="absolute inset-0 bg-black/50" onClick={() => setForgotOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Identifiants oubliés"
            className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl"
            style={{ animation: 'popIn .3s cubic-bezier(.22,1,.36,1) both' }}
          >
            <div className="flex items-start gap-3 px-6 pt-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <h2 className="text-lg font-semibold leading-snug">Identifiants oubliés</h2>
            </div>
            <p className="mt-3 px-6 pb-6 text-sm text-neutral-600 leading-7">
              Si vous avez oublié vos identifiants, rapprochez-vous de votre
              <span className="font-medium text-neutral-800"> administrateur </span>
              pour les récupérer ou les réinitialiser.
            </p>
            <div className="border-t border-neutral-100 px-6 py-4 text-right">
              <button
                type="button"
                className="bg-brand hover:bg-brand-dark text-white text-sm rounded-lg px-5 py-2.5 font-medium"
                onClick={() => setForgotOpen(false)}
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {notice ? <NoticeToast notice={notice} /> : null}
    </main>
  )
}
