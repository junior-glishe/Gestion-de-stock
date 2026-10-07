import Reveal from './Reveal'
import { IconShield, IconCheck, IconChart, IconUsers } from '../../lib/icons'

/* Histoire, équipe et valeurs. */
export default function About() {
  return (
    <section id="a-propos" className="relative overflow-hidden bg-neutral-50">
      <span aria-hidden className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <span aria-hidden className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
              À propos de StockPro
            </span>
          </Reveal>
          <Reveal as="h2" delay={90} className="mt-5 text-3xl sm:text-4xl font-bold text-neutral-900">
            Une gestion de stock qui se fait oublier
          </Reveal>
          <Reveal as="p" delay={180} className="mt-4 text-neutral-600 leading-7">
            Une application pensée pour rendre la gestion de stock claire, accessible et fiable —
            pour que vous puissiez vous concentrer sur votre activité.
          </Reveal>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <Reveal id="histoire" className="reveal">
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">Notre histoire</h3>
            <p className="mt-4 text-neutral-600 leading-7">
              StockPro est né d'un constat simple : trop de commerces gèrent encore leurs stocks sur
              papier ou sur tableur, avec des ruptures et des erreurs à la clé. Nous avons conçu une
              application claire pour y remédier.
            </p>
            <p className="mt-4 text-neutral-600 leading-7">
              Plutôt qu'un outil complexe réservé aux grandes structures, nous avons voulu un espace
              sobre, rapide et immédiatement lisible — pensé pour les équipes qui n'ont pas le temps
              d'apprendre un logiciel.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3 text-sm text-neutral-600">
                <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-light text-brand-dark">
                  <IconCheck className="h-3 w-3" />
                </span>
                Chaque entrée, sortie et inventaire est tracé depuis un même tableau de bord.
              </li>
              <li className="flex items-start gap-3 text-sm text-neutral-600">
                <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-light text-brand-dark">
                  <IconCheck className="h-3 w-3" />
                </span>
                Les alertes de stock bas remontent automatiquement, avant la rupture.
              </li>
            </ul>
          </Reveal>

          <Reveal
            id="equipe"
            variant="reveal-zoom"
            className="relative rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-8 sm:p-10 text-white shadow-xl shadow-brand/25"
          >
            <span aria-hidden className="absolute top-6 right-8 font-serif text-7xl leading-none text-white/25">
              &ldquo;
            </span>
            <p className="relative text-xl sm:text-2xl font-semibold leading-9">
              Un stock clair, c'est un commerce qui respire.
            </p>
            <p className="relative mt-4 text-brand-light/90 leading-7">
              Cette conviction anime chaque décision. StockPro évolue au fil des retours des équipes
              qui l'utilisent au quotidien.
            </p>
            <div className="relative mt-8 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
                <IconUsers className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">L'équipe StockPro</p>
                <p className="text-xs text-brand-light/80">Développeurs passionnés par la conception logicielle</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid sm:grid-cols-3 gap-6">
          <Reveal className="lift rounded-xl bg-brand p-7 text-white shadow-lg shadow-brand/30">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white">
              <IconShield className="h-5 w-5" />
            </span>
            <h4 className="mt-5 font-semibold text-lg text-white">Fiabilité</h4>
            <p className="mt-2 text-sm text-white/85 leading-7">
              Des données à jour et cohérentes, pour des décisions prises en toute confiance.
            </p>
          </Reveal>
          <Reveal delay={120} className="lift rounded-xl border border-neutral-200 bg-white p-7">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-light text-brand-dark">
              <IconChart className="h-5 w-5" />
            </span>
            <h4 className="mt-5 font-semibold text-lg text-neutral-900">Clarté</h4>
            <p className="mt-2 text-sm text-neutral-500 leading-7">
              Un espace sobre et lisible : on trouve l'information en un coup d'œil.
            </p>
          </Reveal>
          <Reveal delay={240} className="lift rounded-xl border border-neutral-200 bg-white p-7">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-light text-brand-dark">
              <IconCheck className="h-5 w-5" />
            </span>
            <h4 className="mt-5 font-semibold text-lg text-neutral-900">Évolution</h4>
            <p className="mt-2 text-sm text-neutral-500 leading-7">
              StockPro s'améliore en continu, guidé par les retours de ses utilisateurs.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}