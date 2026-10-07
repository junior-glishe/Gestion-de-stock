import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#stocks', label: 'Stocks', caret: true },
  { href: '#a-propos', label: 'À propos', caret: true },
  { href: '#faq', label: 'FAQ' },
]

const Caret = () => <span className="text-[10px] text-neutral-400">⌵</span>

/* En-tête du site public : navigation, menu mobile et section active. */
export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('accueil')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('section[id]').forEach((section) => spy.observe(section))
    return () => spy.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const linkClass = (href) =>
    `nav-link${href === '#accueil' ? ' text-brand' : ''}${
      activeSection === href.slice(1) ? ' active' : ''
    }`

  return (
    <header
      id="siteHeader"
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm${scrolled ? ' scrolled' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="#accueil" className="flex items-center" aria-label="StockPro – Accueil">
          <img src="/images/logo.png" alt="StockPro" className="h-9 w-auto object-contain" />
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <a href="#accueil" className={linkClass('#accueil')}>
            Accueil
          </a>

          <div className="relative group">
            <a
              href="#fonctionnalites"
              className={`nav-link${activeSection === 'fonctionnalites' ? ' active' : ''} flex items-center gap-1 hover:text-brand`}
            >
              Fonctionnalités <Caret />
            </a>
            <div className="absolute left-0 top-full pt-3 hidden group-hover:block">
              <div className="bg-white rounded-lg shadow-xl w-40 py-2 origin-top-left scale-95 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <a href="#produits" className="block px-4 py-2 hover:text-brand">
                  Produits
                </a>
                <a href="#alertes" className="flex justify-between px-4 py-2 text-brand">
                  Alertes <span>›</span>
                </a>
              </div>
            </div>
          </div>

          {NAV_LINKS.slice(1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${linkClass(link.href)} hover:text-brand${link.caret ? ' flex items-center gap-1' : ''}`}
            >
              {link.label} {link.caret && <Caret />}
            </a>
          ))}

          <Link to="/connexion" className="nav-link hover:text-brand">
            Connexion
          </Link>

          <a
            href="#aide"
            className="btn-landing bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md shadow-md shadow-brand/20"
          >
            Centre d'aide
          </a>
        </nav>

        <button
          id="burger"
          type="button"
          className={`lg:hidden p-2 rounded-md${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div
        id="mobileNav"
        className={`${menuOpen ? '' : 'hidden'} lg:hidden border-t bg-white px-5 py-4 space-y-3 text-sm font-medium`}
      >
        <a href="#accueil" className="block text-brand" onClick={closeMenu}>
          Accueil
        </a>
        <a href="#fonctionnalites" className="block" onClick={closeMenu}>
          Fonctionnalités
        </a>
        <a href="#stocks" className="block" onClick={closeMenu}>
          Stocks
        </a>
        <a href="#a-propos" className="block" onClick={closeMenu}>
          À propos
        </a>
        <a href="#faq" className="block" onClick={closeMenu}>
          FAQ
        </a>
        <Link to="/connexion" className="block" onClick={closeMenu}>
          Connexion
        </Link>
        <a href="#aide" className="inline-block bg-brand text-white px-4 py-2 rounded-md" onClick={closeMenu}>
          Centre d'aide
        </a>
      </div>
    </header>
  )
}
