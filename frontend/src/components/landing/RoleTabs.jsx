import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { IconCar, IconDocument, IconMail } from '../../lib/icons'

const ROLES = [
  {
    key: 'superviseur',
    label: 'Superviseur',
    items: [
      {
        Icon: IconMail,
        title: 'Consulter le stock',
        text: "Visualisez l'état du stock en temps réel, produit par produit et par catégorie.",
      },
      {
        Icon: IconDocument,
        title: 'Suivre les mouvements',
        text: "Retrouvez l'historique de toutes les entrées et sorties avec leur date.",
      },
      {
        Icon: IconCar,
        title: 'Anticiper les ruptures',
        text: 'Repérez les produits à réapprovisionner grâce aux alertes de stock bas.',
      },
    ],
  },
  {
    key: 'gestionnaire',
    label: 'Gestionnaire',
    items: [
      {
        Icon: IconMail,
        title: 'Produits & catégories',
        text: 'Ajoutez vos produits, classez-les par catégories et gardez un catalogue toujours à jour.',
      },
      {
        Icon: IconDocument,
        title: 'Entrées / sorties',
        text: 'Enregistrez chaque entrée et sortie pour connaître à tout moment les quantités disponibles.',
      },
      {
        Icon: IconCar,
        title: 'Alertes de stock bas',
        text: 'Fixez un seuil par produit et soyez prévenu avant la rupture.',
      },
    ],
  },
]

/* Présentation des espaces, avec onglets superviseur / gestionnaire. */
export default function RoleTabs() {
  const [activeRole, setActiveRole] = useState('gestionnaire')
  const [displayedRole, setDisplayedRole] = useState('gestionnaire')
  const [swapping, setSwapping] = useState(false)

  const changeRole = (role) => {
    if (role === activeRole || swapping) return
    setActiveRole(role)
    setSwapping(true)
  }

  useEffect(() => {
    if (!swapping) return undefined
    const timer = setTimeout(() => {
      setDisplayedRole(activeRole)
      setSwapping(false)
    }, 220)
    return () => clearTimeout(timer)
  }, [swapping, activeRole])

  const items = ROLES.find((role) => role.key === displayedRole).items

  return (
    <section id="application" className="max-w-6xl mx-auto px-5 py-16">
      <div className="text-center max-w-xl mx-auto">
        <Reveal as="h2" className="text-3xl sm:text-4xl font-bold">
          Comment fonctionne l'application
        </Reveal>
        <p className="mt-4 text-neutral-600 leading-7">
          Produits, catégories, entrées, sorties et alertes de stock bas : tout ce qu'il faut pour
          garder le contrôle de votre inventaire.
        </p>
        <div className="mt-8 inline-flex bg-neutral-50 p-1.5 rounded-lg shadow-sm text-sm font-medium">
          {ROLES.map((role) => (
            <button
              key={role.key}
              type="button"
              data-tab={role.key}
              className={`px-6 py-2.5 rounded-md${activeRole === role.key ? ' tab-active' : ''}`}
              onClick={() => changeRole(role.key)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-14 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[380px] sm:h-[480px] grid place-items-center overflow-hidden">
          <Reveal delay={0} className="halo absolute h-72 w-72 sm:h-[400px] sm:w-[400px] rounded-full bg-brand" />
          <Reveal
            delay={110}
            className="absolute h-72 w-72 sm:h-[400px] sm:w-[400px] rounded-full border border-brand/30 spin-slow"
          />
          <Reveal
            delay={220}
            className="absolute w-32 sm:w-44 -rotate-[18deg] -translate-x-16 sm:-translate-x-24 -translate-y-12"
          >
            <img
              src="/images/Firefly.png"
              alt="Application StockPro : gestion des stocks"
              className="w-full h-auto drop-shadow-xl"
              loading="lazy"
            />
          </Reveal>
          <Reveal
            delay={330}
            className="absolute w-32 sm:w-44 rotate-[18deg] translate-x-12 sm:translate-x-16 translate-y-16 sm:translate-y-24"
          >
            <img
              src="/images/mobile.png"
              alt="Application StockPro : alertes de stock bas"
              className="w-full h-auto drop-shadow-xl"
              loading="lazy"
            />
          </Reveal>
        </div>

        <div
          id="tabContent"
          className={`grid sm:grid-cols-2 gap-x-10 gap-y-10 max-w-lg mx-auto lg:mx-0${swapping ? ' swap' : ''}`}
        >
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <span className="h-14 w-14 rounded-xl bg-brand-light grid place-items-center">
                <item.Icon className="h-6 w-6 text-brand" />
              </span>
              <h3 className="mt-4 font-semibold text-sm">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-6">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
