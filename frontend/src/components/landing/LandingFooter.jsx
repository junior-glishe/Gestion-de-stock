import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { href: '#accueil', label: 'Accueil' },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
  { href: '/conditions', label: "Conditions d'utilisation" },
]

const ABOUT_LINKS = [
  { href: '#equipe', label: "L'équipe" },
  { href: '#histoire', label: 'Notre histoire' },
  { href: '#aide', label: 'Carrières' },
]

export default function LandingFooter() {
  return (
    <footer className="bg-footer text-neutral-300 mt-16">
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10">
          <div>
            <a href="#accueil" className="text-2xl font-extrabold text-brand">
              StockPro
            </a>
            <p className="mt-4 text-xs leading-6 max-w-[260px]">
              StockPro est une application de gestion de stock simple et fiable : produits,
              catégories, entrées, sorties et alertes de stock bas, pour ne plus jamais manquer d'un
              article.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium">Liens rapides</h4>
            <ul className="mt-5 space-y-3 text-xs">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('#') ? (
                    <a href={link.href} className="ul-link hover:text-white">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="ul-link hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium">À propos</h4>
            <ul className="mt-5 space-y-3 text-xs">
              {ABOUT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="ul-link hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium">Contact</h4>
            <p className="mt-5 text-xs leading-6">Porto-Novo, Bénin</p>
            <p className="mt-4 text-xs leading-6">
              +229 00 00 00 00
              <br />
              contact@stockpro.com
            </p>
          </div>
        </div>

        <div className="mt-14 pt-5 border-t border-neutral-600 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
          <p>Copyright StockPro © 2026. Tous droits réservés.</p>
          <div className="flex gap-3 text-white">
            <a href="#" aria-label="Facebook" className="h-4 w-4 rounded-sm bg-white block" />
            <a href="#" aria-label="Instagram" className="h-4 w-4 rounded-sm border-2 border-white block" />
            <a href="#" aria-label="Twitter" className="h-4 w-4 rounded-sm bg-white block" />
          </div>
        </div>
      </div>
    </footer>
  )
}
