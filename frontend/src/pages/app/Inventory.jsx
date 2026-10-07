import { useState } from 'react'
import Card from '../../components/ui/Card'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import ListRow from '../../components/ui/ListRow'
import EmptyState from '../../components/ui/EmptyState'
import PageHero from '../../components/ui/PageHero'
import { useStore } from '../../store/StoreContext'
import { useSpace } from '../../store/SpaceContext'
import { useUi } from '../../store/UiContext'
import { rowMatches, useFilters } from '../../lib/filters'
import { IconCheck, IconClipboard, IconClock, IconTag } from '../../lib/icons'

export default function Inventory() {
  const { data, generateInventory } = useStore()
  const { space } = useSpace()
  const { showToast } = useUi()
  const [counts, setCounts] = useState({})
  const { filters, setSearch, reset } = useFilters({ q: '' })

  const countOf = (reference) => counts[reference] ?? ''
  const differenceOf = (product) =>
    countOf(product.reference) === '' ? null : Number(countOf(product.reference)) - product.quantite

  const entries = data.products.map((product) => ({
    product,
    searchText: `${product.reference} ${product.nom} ${product.categorie}`,
  }))
  const visible = entries.filter((entry) => rowMatches(entry, filters))

  const rows = visible.map(({ product }) => {
    const difference = differenceOf(product)
    return {
      key: product.reference,
      cells: [
        <span className="nm">
          <b>{product.nom}</b>
          <span>
            {product.reference} · {product.categorie}
          </span>
        </span>,
        <span className="tag">
          <span className="ic">
            <IconTag />
          </span>
          {product.categorie}
        </span>,
        <b className="num text-lg">{product.quantite}</b>,
        <input
          className="inp inp-s"
          style={{ maxWidth: 130 }}
          type="number"
          min="0"
          placeholder="Compter"
          value={countOf(product.reference)}
          onChange={(event) =>
            setCounts((previous) => ({ ...previous, [product.reference]: event.target.value }))
          }
          aria-label={`Quantité réelle pour ${product.nom}`}
        />,
        <span
          className={
            difference === null
              ? 'text-neutral-400 font-semibold'
              : `font-semibold ${difference === 0 ? 'text-brand-dark' : 'text-red-600'}`
          }
        >
          {difference === null ? '–' : `${difference > 0 ? '+' : ''}${difference}`}
        </span>,
      ],
    }
  })

  const checked = data.products.filter((product) => countOf(product.reference) !== '').length
  const differences = data.products.filter(
    (product) => differenceOf(product) !== null && differenceOf(product) !== 0,
  ).length

  const handleGenerate = async () => {
    const error = await generateInventory(
      data.products.map((product) => ({
        reference: product.reference,
        realQuantity: countOf(product.reference),
      })),
    )
    if (error) return showToast(error, { error: true })

    setCounts({})
    showToast(
      `Inventaire généré : ${checked} produit(s) contrôlé(s), ${differences} écart(s) corrigé(s)`,
    )
    return undefined
  }

  const totalChecked = data.inventories.reduce((sum, entry) => sum + entry.checked, 0)
  const totalDifferences = data.inventories.reduce((sum, entry) => sum + entry.differences, 0)

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconClipboard />}
        title="Inventaire"
        description="Comparez la quantité théorique à la quantité réelle comptée, puis générez l'inventaire."
        actions={
          <button type="button" className="btn btn-p btn-lg" onClick={handleGenerate}>
            <IconClipboard />
            Générer l'inventaire
          </button>
        }
      />

      <Card
        title="Saisie des quantités réelles"
        sub="Saisissez la quantité comptée : l'écart s'affiche en direct"
        icon={<IconClipboard />}
        pad={false}
      >
        <FilterBar
          searchPlaceholder="Rechercher un produit à contrôler…"
          filters={filters}
          onSearch={setSearch}
          onSelect={() => {}}
          onReset={reset}
          shown={visible.length}
          total={entries.length}
        />
        <DataTable
          columns={['Produit', 'Catégorie', 'Quantité théorique', 'Quantité réelle', 'Écart']}
          rows={rows}
          icon={<IconClipboard />}
          empty="Aucun produit à contrôler."
        />
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-5">
        <Card title="Contrôle en cours" sub="Synthèse de votre saisie" icon={<IconClipboard />} span={2}>
          <div className="invsum">
            <IconClipboard />
            <span>
              <b>{checked}</b> produit(s) compté(s) ·{' '}
              <b className={differences ? 'text-red-600' : 'text-brand-dark'}>{differences}</b>{' '}
              écart(s) détecté(s)
            </span>
          </div>
        </Card>

        <Card
          title="Historique"
          sub={`${data.inventories.length} inventaire(s) · ${totalChecked} contrôle(s) · ${totalDifferences} écart(s)`}
          icon={<IconClock />}
          className="col-span-2 lg:col-span-1"
        >
          {data.inventories.length ? (
            <div className="lst">
              {data.inventories.map((entry) => (
                <ListRow
                  key={entry.id}
                  icon={<IconCheck />}
                  title={`${entry.date} · ${entry.checked} produit(s) contrôlé(s)`}
                  right={
                    <span className={`qty ${entry.differences ? 'dn' : 'up'}`}>
                      {entry.differences} écart(s)
                    </span>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={<IconClock />}>Aucun inventaire généré.</EmptyState>
          )}
        </Card>
      </div>
    </>
  )
}
