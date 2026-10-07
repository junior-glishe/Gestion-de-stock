import Reveal from './Reveal'

const STEPS_LEFT = [
  {
    number: 1,
    title: 'Créer vos produits',
    text: 'Ajoutez vos produits et classez-les par catégories pour retrouver chaque article en un instant',
  },
  {
    number: 3,
    title: 'Recevoir les alertes',
    text: "Soyez prévenu automatiquement dès qu'un produit passe sous son seuil de stock bas.",
  },
]

const STEPS_RIGHT = [
  {
    number: 2,
    title: 'Enregistrer les mouvements',
    text: 'Saisissez chaque entrée et sortie : le stock se met à jour instantanément.',
  },
  {
    number: 4,
    title: 'Suivre et décider',
    text: "Consultez l'état du stock et l'historique pour anticiper vos réapprovisionnements.",
  },
]

function Step({ step }) {
  return (
    <>
      <span
        className={`h-14 w-14 rounded-xl text-2xl font-semibold grid place-items-center ${
          step.number === 3 ? 'bg-brand text-white' : 'bg-brand-light text-brand'
        }`}
      >
        {step.number}
      </span>
      <h3 className="mt-4 font-semibold">{step.title}</h3>
      <p className="mt-1 text-sm text-neutral-500 leading-6 max-w-[220px]">{step.text}</p>
    </>
  )
}

/* Étapes de fonctionnement de l'application. */
export default function HowItWorks() {
  return (
    <section id="fonctionnement" className="max-w-6xl mx-auto px-5 py-20">
      <div className="text-center max-w-xl mx-auto">
        <Reveal as="h2" className="text-3xl sm:text-4xl font-bold">
          Comment fonctionne StockPro
        </Reveal>
        <p className="mt-4 text-neutral-600 leading-7">
          Ajoutez vos produits, enregistrez chaque entrée et sortie, et laissez l'application
          surveiller vos niveaux de stock à votre place.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 lg:grid-cols-3 gap-10 items-start lg:items-center">
        <div className="contents lg:block lg:order-1 lg:space-y-14 lg:text-right">
          {STEPS_LEFT.map((step, index) => (
            <Reveal
              key={step.number}
              delay={index * 110}
              className={`flex flex-col lg:items-end ${step.number === 1 ? 'order-2' : 'order-4'}`}
            >
              <Step step={step} />
            </Reveal>
          ))}
        </div>

        <div className="col-span-2 lg:col-span-1 order-1 lg:order-2 relative grid place-items-center overflow-hidden">
          <Reveal
            delay={0}
            className="halo absolute z-0 h-60 w-60 sm:h-[380px] sm:w-[380px] rounded-full bg-brand"
          />
          <Reveal
            delay={110}
            className="absolute z-0 h-60 w-60 sm:h-[380px] sm:w-[380px] rounded-full border border-brand/30 spin-slow"
          />
          <Reveal variant="reveal-zoom" className="relative z-10 h-[380px] sm:h-[440px] lg:h-[460px]">
            <img
              src="/images/mobile.png"
              alt="Application StockPro : suivi des stocks et alertes"
              className="h-full w-auto max-w-full object-contain"
              loading="lazy"
            />
          </Reveal>
        </div>

        <div className="contents lg:block lg:order-3 lg:space-y-14">
          {STEPS_RIGHT.map((step, index) => (
            <Reveal
              key={step.number}
              delay={index * 110}
              className={`flex flex-col ${step.number === 2 ? 'order-3' : 'order-5'}`}
            >
              <Step step={step} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}