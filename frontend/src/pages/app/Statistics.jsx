import Card from '../../components/ui/Card'
import Kpi from '../../components/ui/Kpi'
import DataTable from '../../components/ui/DataTable'
import ListRow from '../../components/ui/ListRow'
import Meter from '../../components/ui/Meter'
import EmptyState from '../../components/ui/EmptyState'
import PageHero from '../../components/ui/PageHero'
import { Activity, Bars, Donut } from '../../components/ui/Charts'
import { useStore } from '../../store/StoreContext'
import { useSpace } from '../../store/SpaceContext'
import {
  IconBox,
  IconChart,
  IconDatabase,
  IconEntry,
  IconExit,
  IconLayers,
  IconTag,
  IconTruck,
  IconWallet,
} from '../../lib/icons'
import { formatMoney, formatNumber } from '../../lib/format'

export default function Statistics() {
  const { data } = useStore()
  const { space } = useSpace()

  const stockValue = data.products.reduce((sum, product) => sum + product.quantite * product.prix, 0)
  const totalUnits = data.products.reduce((sum, product) => sum + product.quantite, 0)
  const totalEntries = data.movements
    .filter((movement) => movement.type === 'entree')
    .reduce((sum, movement) => sum + movement.quantite, 0)
  const totalExits = data.movements
    .filter((movement) => movement.type === 'sortie')
    .reduce((sum, movement) => sum + movement.quantite, 0)

  const valueByCategory = data.categories.map((category) => ({
    category,
    value: data.products
      .filter((product) => product.categorie === category)
      .reduce((sum, product) => sum + product.quantite * product.prix, 0),
  }))
  const unitsByCategory = data.categories.map((category) => ({
    category,
    units: data.products
      .filter((product) => product.categorie === category)
      .reduce((sum, product) => sum + product.quantite, 0),
  }))

  const suppliers = [...data.suppliers].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))

  const topProducts = [...data.products]
    .sort((a, b) => b.quantite * b.prix - a.quantite * a.prix)
    .slice(0, 6)

  const topRows = topProducts.map((product, index) => ({
    key: product.reference,
    cells: [
      <>
        <span className="tag">
          <span className="ic">{index + 1}</span>
        </span>
        <span className="nm">
          <b>{product.nom}</b>
          <span>{product.reference}</span>
        </span>
      </>,
      <span className="text-neutral-500">{product.categorie}</span>,
      <span className="num">{product.quantite}</span>,
      <span className="num">{formatMoney(product.prix)}</span>,
      <span className="num">
        <b>{formatMoney(product.quantite * product.prix)}</b>
      </span>,
    ],
  }))

  /* Dates de l'API au format français « 6/10/2026 » (ou ISO). */
  const parseDate = (value) => {
    if (!value) return null
    const fr = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (fr) return new Date(Number(fr[3]), Number(fr[2]) - 1, Number(fr[1]))
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  /* Activité des 14 derniers jours (cumul entrées / sorties par jour). */
  const activity = (() => {
    const byDay = new Map()
    data.movements.forEach((movement) => {
      const date = parseDate(movement.date)
      if (!date) return
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      const day = byDay.get(key) || { date, entree: 0, sortie: 0 }
      if (movement.type === 'entree') day.entree += movement.quantite
      else day.sortie += movement.quantite
      byDay.set(key, day)
    })
    return [...byDay.values()]
      .sort((a, b) => a.date - b.date)
      .slice(-14)
      .map((day) => ({
        label: `${String(day.date.getDate()).padStart(2, '0')}/${String(day.date.getMonth() + 1).padStart(2, '0')}`,
        entree: day.entree,
        sortie: day.sortie,
      }))
  })()

  const donutData = valueByCategory
    .filter((item) => item.value > 0)
    .map((item) => ({ name: item.category, value: item.value }))

  const barsData = unitsByCategory.map((item) => ({ name: item.category, value: item.units }))

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconChart />}
        title="Statistiques"
        description="Une vue d'ensemble de la valeur et de l'activité de votre stock."
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5 stagger">
        <Kpi
          label="Valeur du stock"
          value={formatMoney(stockValue)}
          icon={<IconWallet />}
          small
          sub="Valeur immobilisée"
        />
        <Kpi
          label="Unités en stock"
          value={formatNumber(totalUnits)}
          icon={<IconDatabase />}
          tone="blue"
          sub={`${data.products.length} référence(s)`}
        />
        <Kpi label="Unités entrées" value={formatNumber(totalEntries)} icon={<IconEntry />} sub="Cumul des réceptions" />
        <Kpi
          label="Unités sorties"
          value={formatNumber(totalExits)}
          icon={<IconExit />}
          tone="red"
          sub="Cumul des sorties"
        />
      </div>

      {/* Activité des mouvements */}
      <div className="mb-5">
        <Card
          title="Activité des 14 derniers jours"
          sub="Unités entrées et sorties enregistrées par jour"
          icon={<IconChart />}
        >
          {activity.length ? (
            <Activity data={activity} />
          ) : (
            <EmptyState icon={<IconChart />}>
              Aucun mouvement enregistré : les entrées et sorties apparaîtront ici.
            </EmptyState>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
        <Card
          title="Valeur du stock par catégorie"
          sub="Répartition de la valeur totale"
          icon={<IconWallet />}
          className="col-span-2 lg:col-span-1"
        >
          {donutData.length ? (
            <Donut data={donutData} centerValue={formatMoney(stockValue)} centerLabel="Valeur totale" />
          ) : (
            <EmptyState icon={<IconWallet />}>Aucune donnée.</EmptyState>
          )}
        </Card>

        <Card
          title="Quantités par catégorie"
          sub="Unités en stock par catégorie"
          icon={<IconLayers />}
          className="col-span-2 lg:col-span-1"
        >
          {totalUnits ? (
            <Bars data={barsData} name="Unités" unit="unités" color="#2563eb" />
          ) : (
            <EmptyState icon={<IconLayers />}>Aucune donnée.</EmptyState>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 mt-5">
        <Card
          title="Flux entrées / sorties"
          sub="Comparaison sur l'ensemble des mouvements"
          icon={<IconChart />}
          className="col-span-2 lg:col-span-1"
        >
          <Meter label="Entrées" value={`${totalEntries} unités`} tone="blue" />
          <Meter label="Sorties" value={`${totalExits} unités`} tone="red" />
          <Meter
            label="Solde net"
            value={`${totalEntries - totalExits >= 0 ? '+' : '−'}${Math.abs(totalEntries - totalExits)} unités`}
            tone={totalEntries - totalExits >= 0 ? 'blue' : 'amber'}
          />
        </Card>

        <Card
          title="Fournisseurs"
          sub="Partenaires enregistrés"
          icon={<IconTruck />}
          className="col-span-2 lg:col-span-1"
        >
          {suppliers.length ? (
            <div className="lst">
              {suppliers.map((supplier) => (
                <ListRow
                  key={supplier.id}
                  icon={<IconTruck />}
                  title={supplier.nom}
                  sub={supplier.contact || supplier.ville || 'Coordonnées non renseignées'}
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={<IconTruck />}>Aucun fournisseur.</EmptyState>
          )}
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Produits les plus valuables" sub="Classement par valeur immobilisée" icon={<IconBox />} pad={false}>
          <DataTable
            columns={['Produit', 'Catégorie', 'Quantité', 'Prix unitaire', 'Valeur en stock']}
            rows={topRows}
            icon={<IconTag />}
            empty="Aucun produit."
          />
        </Card>
      </div>
    </>
  )
}
