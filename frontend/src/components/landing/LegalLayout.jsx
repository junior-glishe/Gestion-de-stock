import { Link } from 'react-router-dom'
import LandingFooter from './LandingFooter'

export function LegalSection({ number, heading, children }) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-lg sm:text-xl font-semibold text-neutral-900">
        <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-brand-light text-brand-dark text-xs font-bold">
          {number}
        </span>
        {heading}
      </h2>
      <div className="mt-3 space-y-3 text-sm text-neutral-600 leading-7">{children}</div>
    </section>
  )
}

/* Page légale : entête + corps + pied de page du site. */
export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="sticky top-0 z-40 bg-neutral-50/85 backdrop-blur border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="StockPro" className="h-8 w-auto" />
            <span className="text-xl font-extrabold text-brand">StockPro</span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-neutral-600 hover:text-brand transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-12 md:py-16">
        <span className="inline-flex items-center rounded-full bg-brand-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
          Documents légaux
        </span>
        <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-neutral-900">{title}</h1>
        <p className="mt-3 text-sm text-neutral-500">Dernière mise à jour : le {updated}.</p>

        <article className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="space-y-10">{children}</div>
        </article>
      </main>

      <LandingFooter />
    </div>
  )
}