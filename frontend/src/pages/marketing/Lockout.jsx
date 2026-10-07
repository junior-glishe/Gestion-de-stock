import { Link } from 'react-router-dom'

/* Page affichée après plusieurs tentatives de connexion infructueuses. */
export default function Lockout() {
  return (
    <main className="min-h-screen grid place-items-center bg-neutral-50 px-6 py-14">
      <div className="w-full max-w-md text-center anim-up">
        <Link to="/" className="inline-block" aria-label="StockPro – Accueil">
          <img src="/images/logo.png" alt="StockPro" className="mx-auto h-12 w-auto object-contain" />
        </Link>
        <div className="mt-10 mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold text-neutral-900">Accès temporairement bloqué</h1>
        <p className="mt-5 text-neutral-600 leading-7">
          Pour des raisons de sécurité, l'accès à cette plateforme a été bloqué après plusieurs
          tentatives de connexion infructueuses.
        </p>
        <p className="mt-3 text-neutral-600 leading-7">
          Cette plateforme n'est plus accessible depuis votre connexion.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white rounded-lg px-6 py-3 text-sm font-medium"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}