import { Link } from 'react-router-dom'
import Reveal from './Reveal'

/* Bannière d'appel à l'action. */
export default function CallToAction() {
  return (
    <section id="commencer" className="max-w-6xl mx-auto px-5 py-16">
      <div className="relative overflow-hidden rounded-2xl bg-banner text-white px-6 sm:px-12 py-12 lg:min-h-[320px]">
        <div className="lg:w-3/5 relative z-10">
          <Reveal as="h2" className="text-3xl sm:text-4xl font-bold">
            Essayez StockPro dès aujourd'hui
          </Reveal>
          <Reveal as="p" className="mt-5 text-sm sm:text-[15px] leading-7">
            StockPro est une application de gestion de stock pensée pour simplifier le quotidien des
            commerçants et des gestionnaires. Produits, catégories, entrées, sorties, alertes de
            stock bas : gardez le contrôle de votre inventaire, où que vous soyez, et ne tombez plus
            jamais en rupture.
          </Reveal>
          <Reveal
            as={Link}
            to="/connexion"
            className="btn-landing mt-6 inline-block bg-neutral-800 hover:bg-black text-white text-sm px-7 py-3 rounded-md shadow-lg shadow-black/25"
          >
            Commencer
          </Reveal>
        </div>
        <div className="hidden lg:block absolute right-10 -top-2 w-32">
          <img
            src="/images/Firefly.png"
            alt="Application StockPro : gestion des stocks"
            className="w-full h-auto drop-shadow-2xl -rotate-[18deg]"
            loading="lazy"
          />
        </div>
        <div className="hidden lg:block absolute right-40 top-28 w-32">
          <img
            src="/images/mobile.png"
            alt="Application StockPro : alertes de stock bas"
            className="w-full h-auto drop-shadow-2xl rotate-[18deg]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
