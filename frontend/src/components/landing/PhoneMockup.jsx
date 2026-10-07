/* Maquette de téléphone utilisée dans les illustrations de la page d'accueil.
   `revealText` révèle les textes d'alerte au défilement (bannière « Commencer »). */
export default function PhoneMockup({ className = '', revealText = false }) {
  const text = revealText ? 'reveal ' : ''
  return (
    <div
      className={`relative mx-auto w-full rounded-[2.2rem] border-[7px] border-neutral-900 bg-white shadow-2xl overflow-hidden aspect-[9/18.5] ${className}`}
    >
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-3 w-16 rounded-full bg-neutral-900 z-10" />
      <div className="flex justify-between px-4 pt-2 text-[8px] font-semibold">
        <span>9:41</span>
        <span>▂▄▆ ▮</span>
      </div>
      <div className="flex items-center justify-between px-4 pt-3 text-[9px] text-neutral-500">
        <span className="flex-1 text-center">En ligne</span>
        <span className="h-3 w-6 rounded-full bg-brand relative">
          <i className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white" />
        </span>
      </div>
      <div className="map-bg relative h-[46%] mt-2 flex items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full border border-dashed border-brand/50" />
        <div className="absolute h-20 w-20 rounded-full border border-dashed border-brand/50" />
        <div className="relative h-6 w-6 rounded-full bg-brand-light grid place-items-center">
          <span className="h-3 w-2 rounded-sm bg-brand" />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-white px-3 pb-2 pt-2 rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,.08)]">
        <p className={`${text}text-[7px] text-brand`}>Alerte : un produit est bientôt en rupture</p>
        <div className="flex items-center gap-2 mt-1.5">
          <img
            src="/images/laptop-x15.jpg"
            alt="Ordinateur portable X15"
            className="h-6 w-6 rounded-md object-cover shrink-0 ring-1 ring-neutral-200"
          />
          <div className="flex-1 text-[8px] leading-tight">
            <b>Ordinateur portable X15</b>
            <br />
            <span className="text-brand text-[7px]">Stock bas</span>
          </div>
          <b className="text-[9px]">3 unités</b>
        </div>
        <div className="mt-2 text-[7px] leading-tight space-y-1.5">
          <p className={`${text}flex gap-1.5`}>
            <i className="mt-0.5 h-1.5 w-1.5 rounded-full bg-neutral-800 shrink-0" />
            Catégorie : Informatique
          </p>
          <p className={`${text}flex gap-1.5`}>
            <i className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
            Seuil d'alerte : 5 unités
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 text-[8px] font-medium">
          <span className="border border-brand text-brand rounded text-center py-1">Ignorer</span>
          <span className="bg-brand text-white rounded text-center py-1">Réappro.</span>
        </div>
        <div className="flex justify-around mt-2 text-[6px] text-neutral-400 pb-1">
          <span>Accueil</span>
          <span>Produits</span>
          <span>Mouvements</span>
          <span>Plus</span>
        </div>
      </div>
    </div>
  )
}
