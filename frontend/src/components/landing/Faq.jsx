import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'

const FAQS = [
  {
    q: 'Que puis-je gérer avec StockPro ?',
    a: 'Vos produits, vos catégories, vos entrées et sorties de stock, ainsi que les alertes de stock bas.',
  },
  {
    q: 'Comment fonctionnent les alertes de stock bas ?',
    a: 'Vous fixez un seuil pour chaque produit. Dès que la quantité passe sous ce seuil, une alerte vous prévient avant la rupture.',
  },
  {
    q: "Puis-je consulter l'historique des mouvements ?",
    a: 'Oui, chaque entrée et sortie est enregistrée avec sa date pour un suivi complet.',
  },
  {
    q: "L'application fonctionne-t-elle sur mobile ?",
    a: "Oui, l'interface s'adapte à tous les écrans : téléphone, tablette et ordinateur.",
  },
  {
    q: 'Comment commencer ?',
    a: null, // contenu particulier : renvoie vers la page de connexion
  },
]

function ChevronDown() {
  return (
    <svg
      className="chev h-4 w-4 text-neutral-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/* Questions fréquentes, une seule ouverte à la fois. */
export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="bg-neutral-50">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Reveal
              as="img"
              variant="reveal-left"
              src="/images/FAQs-cuate.png"
              alt="Questions fréquentes StockPro"
              className="w-full max-w-lg mx-auto rounded-2xl object-cover"
            />
          </div>

          <div>
            <span className="text-sm font-semibold text-brand uppercase tracking-wider">FAQ</span>
            <Reveal as="h2" className="mt-2 text-3xl sm:text-4xl font-bold">
              Questions fréquentes
            </Reveal>
            <p className="mt-4 text-neutral-500 leading-7">
              Retrouvez les réponses aux questions les plus fréquentes concernant StockPro.
            </p>

            <div className="mt-8 space-y-3">
              {FAQS.map((item, index) => (
                <details
                  key={item.q}
                  className="faq bg-white rounded-lg shadow-sm p-5"
                  open={openIndex === index}
                  onToggle={(event) => setOpenIndex(event.currentTarget.open ? index : null)}
                >
                  <Reveal as="summary" delay={0} className="cursor-pointer font-medium">
                    {item.q}
                    <ChevronDown />
                  </Reveal>
                  <Reveal as="div" delay={110} className="faq-body">
                    <div>
                      <p className="mt-3 text-sm text-neutral-500 leading-7">
                        {item.a ?? (
                          <>
                            Rendez-vous sur la{' '}
                            <Link to="/connexion" className="text-brand underline">
                              page de connexion
                            </Link>{' '}
                            pour accéder à votre espace.
                          </>
                        )}
                      </p>
                    </div>
                  </Reveal>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
