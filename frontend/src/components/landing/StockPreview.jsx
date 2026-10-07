import Reveal from './Reveal'

/* Aperçu figé du tableau de stock. */
export default function StockPreview() {
  return (
    <section id="stocks" className="bg-neutral-50">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center max-w-xl mx-auto">
          <Reveal as="h2" className="text-3xl sm:text-4xl font-bold">
            Suivez vos stocks en un coup d'œil
          </Reveal>
          <p className="mt-4 text-neutral-600 leading-7">
            Quantités, catégories et statuts sont à jour en temps réel. Les produits sous leur seuil
            sont signalés immédiatement.
          </p>
        </div>

        <Reveal variant="reveal-zoom" className="lift mt-10 max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src="/images/stock.png"
            alt="Aperçu du tableau de bord StockPro"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  )
}
