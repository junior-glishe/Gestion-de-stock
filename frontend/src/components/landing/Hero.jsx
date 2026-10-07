import { Link } from 'react-router-dom'
import Reveal from './Reveal'

/* Icônes des boutons du héro (trait 2, comme le site d'origine). */
const ArrowIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const PlayIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m10 8.5 5 3.5-5 3.5z" />
  </svg>
)

/* Section héro : promesse + visuel animé. */
export default function Hero() {
  return (
    <section id="accueil" className="hero-bg">
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-4 items-center">
        <div className="text-center lg:text-left">
          <Reveal as="h1" className="text-[clamp(1.9rem,4.4vw,2.9rem)] leading-[1.14] font-bold break-words text-balance">
            Gérez vos produits, suivez vos stocks, évitez les ruptures !
          </Reveal>
          <Reveal as="p" className="mt-6 text-neutral-600 leading-8 max-w-xl mx-auto lg:max-w-none lg:mx-0">
            Une application de gestion de stock simple et complète : organisez vos produits et
            catégories, enregistrez vos entrées et sorties, et soyez alerté dès que le stock devient
            bas.
          </Reveal>
          <Reveal className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              to="/connexion"
              className="btn-landing flex items-center gap-3 bg-brand text-white rounded-lg px-6 py-3.5 font-medium hover:bg-brand-dark shadow-lg shadow-brand/25"
            >
              <ArrowIcon />
              <span className="text-base">Commencer gratuitement</span>
            </Link>
            <a
              href="#fonctionnement"
              className="btn-landing flex items-center gap-3 bg-white text-neutral-800 border border-neutral-300 rounded-lg px-6 py-3.5 font-medium hover:border-brand hover:text-brand"
            >
              <PlayIcon />
              <span className="text-base">Voir la démo</span>
            </a>
          </Reveal>
        </div>

        <Reveal variant="reveal-zoom" data-float className="relative mx-auto w-full max-w-[640px]">
          <img
            src="/images/mobile-1.png"
            alt="Application StockPro : suivi des stocks et alertes"
            className="w-full h-auto aspect-[3/2] object-cover"
            loading="lazy"
          />
          <div className="float absolute -left-3 sm:-left-6 top-6 sm:top-8 bg-brand text-white text-xs sm:text-sm px-3 py-2.5 rounded-md shadow-xl flex items-center gap-2 whitespace-nowrap">
            <span className="h-5 w-5 rounded-full bg-white text-brand grid place-items-center text-xs">✓</span>
            Entrée de stock enregistrée
          </div>
          <div className="float-alt absolute -right-2 xl:-right-2 2xl:-right-6 bottom-6 sm:bottom-8 bg-red-500 text-white text-xs sm:text-sm px-3 py-2.5 rounded-md shadow-xl flex items-center gap-2 whitespace-nowrap">
            <span className="h-5 w-5 rounded-full bg-white text-red-500 grid place-items-center text-xs">✓</span>
            Alerte : stock bas
          </div>
        </Reveal>
      </div>
    </section>
  )
}
