import Reveal from './Reveal'

/* Icônes des cartes (traits identiques au site d'origine). */
const icon =
  (paths) =>
  ({ className = 'h-6 w-6 text-brand' }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  )

const IconProducts = icon(
  <>
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </>,
)
const IconCategories = icon(<path d="M3 6h6l2 2h10v10H3z" />)
const IconInbound = icon(<path d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14" />)
const IconOutbound = icon(<path d="M12 16V4m0 0-4 4m4-4 4 4M5 20h14" />)
const IconLowStock = icon(<path d="M6 15v-5a6 6 0 1 1 12 0v5l2 2H4zM10 20h4" />)
const IconHistory = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
)

const FEATURES = [
  {
    id: 'produits',
    Icon: IconProducts,
    title: 'Produits',
    text: 'Créez et modifiez vos produits avec leurs références, prix et quantités.',
  },
  {
    id: null,
    Icon: IconCategories,
    title: 'Catégories',
    text: 'Classez vos articles par catégories pour les retrouver et les filtrer facilement.',
  },
  {
    id: null,
    Icon: IconInbound,
    title: 'Entrées',
    text: 'Enregistrez chaque réception de marchandise et mettez le stock à jour.',
  },
  {
    id: null,
    Icon: IconOutbound,
    title: 'Sorties',
    text: "Suivez les ventes et les consommations pour éviter les écarts d'inventaire.",
  },
  {
    id: 'alertes',
    Icon: IconLowStock,
    title: 'Alertes de stock bas',
    text: "Soyez prévenu dès qu'un produit passe sous son seuil de sécurité.",
  },
  {
    id: null,
    Icon: IconHistory,
    title: 'Historique',
    text: 'Retrouvez tous les mouvements avec leur date pour un suivi complet.',
  },
]

/* Grille des fonctionnalités principales. */
export default function Features() {
  return (
    <section id="fonctionnalites" className="bg-neutral-50">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center max-w-xl mx-auto">
          <Reveal as="h2" className="text-3xl sm:text-4xl font-bold">
            Tout pour gérer votre stock
          </Reveal>
          <p className="mt-4 text-neutral-600 leading-7">
            Des fonctionnalités simples et efficaces pour suivre chaque produit, du catalogue
            jusqu'à l'alerte de réapprovisionnement.
          </p>
        </div>

        <div id="featGrid" className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <Reveal
              key={feature.title}
              delay={Math.min(index, 6) * 80}
              id={feature.id ?? undefined}
              className="lift bg-white rounded-xl p-6 shadow-sm border border-neutral-100"
            >
              <span className="lift-icon h-12 w-12 rounded-xl bg-brand-light grid place-items-center">
                <feature.Icon />
              </span>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-6">{feature.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
