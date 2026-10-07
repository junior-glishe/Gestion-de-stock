import Card from '../../components/ui/Card'
import DataTable from '../../components/ui/DataTable'
import Field from '../../components/ui/Field'
import FilterBar from '../../components/ui/FilterBar'
import PageHero from '../../components/ui/PageHero'
import { useStore } from '../../store/StoreContext'
import { useSpace } from '../../store/SpaceContext'
import { useUi } from '../../store/UiContext'
import { rowMatches, useFilters } from '../../lib/filters'
import { IconClock, IconEntry, IconExit } from '../../lib/icons'

/* Page des mouvements de stock : formulaire + historique (entrée ou sortie). */
export default function Movements({ type }) {
  const isIn = type === 'entree'
  const filterKey = isIn ? 'entrees' : 'sorties'

  const { data, recordMovement } = useStore()
  const { space } = useSpace()
  const { showToast } = useUi()
  const { filters, setSearch, reset } = useFilters({ q: '' })

  const movements = data.movements.filter((movement) => movement.type === type)
  const entries = movements.map((movement) => ({
    movement,
    searchText: `${movement.nom} ${movement.reference} ${movement.date}`,
  }))
  const visible = entries.filter((entry) => rowMatches(entry, filters))

  const rows = visible.map(({ movement }) => ({
    key: movement.id,
    cells: [
      <span className="num text-neutral-500">{movement.date}</span>,
      <span className="nm">
        <b>{movement.nom}</b>
        <span>{movement.reference}</span>
      </span>,
      <span className={`qty ${isIn ? 'up' : 'dn'}`}>
        {isIn ? '+' : '−'}
        {movement.quantite}
      </span>,
    ],
  }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const error = await recordMovement({
      type,
      reference: form.p.value,
      quantite: Number(form.q.value),
    })
    if (error) return showToast(error, { error: true })

    showToast(`${isIn ? 'Entrée' : 'Sortie'} de ${form.q.value} unité(s) enregistrée`)
    form.reset()
    return undefined
  }

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={isIn ? <IconEntry /> : <IconExit />}
        title={isIn ? 'Entrée de stock' : 'Sortie de stock'}
        description={
          isIn
            ? 'Enregistrez chaque réception de marchandise.'
            : 'Enregistrez les ventes et les consommations.'
        }
        actions={
          <span className="tag">
            <span className="ic">{isIn ? <IconEntry /> : <IconExit />}</span>
            {isIn ? 'Réception de marchandise' : 'Sortie de marchandise'}
          </span>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card
          title={isIn ? 'Enregistrer une entrée' : 'Enregistrer une sortie'}
          sub={
            isIn
              ? 'Stock et alertes mis à jour automatiquement'
              : "Le stock décrémente et le seuil d'alerte est contrôlé"
          }
          icon={isIn ? <IconEntry /> : <IconExit />}
          tone={isIn ? '' : 'red'}
          className="col-span-2 lg:col-span-1"
        >
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Field label="Produit">
              <select className="sel" name="p">
                {data.products.map((product) => (
                  <option key={product.reference} value={product.reference}>
                    {product.nom} — {product.quantite} en stock
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quantité">
              <input className="inp inp-s" type="number" min="1" name="q" defaultValue="1" required />
            </Field>

            <button className="btn btn-p btn-lg full">
              {isIn ? <IconEntry /> : <IconExit />}
              {isIn ? "Enregistrer l'entrée" : 'Enregistrer la sortie'}
            </button>
          </form>
        </Card>

        <Card
          title="Historique"
          sub={`${movements.length} mouvement(s) enregistré(s)`}
          icon={<IconClock />}
          span={2}
          pad={false}
        >
          <FilterBar
            searchPlaceholder="Rechercher un produit, une date…"
            filters={filters}
            onSearch={setSearch}
            onSelect={() => {}}
            onReset={reset}
            shown={visible.length}
            total={entries.length}
          />
          <DataTable
            columns={['Date', 'Produit', 'Quantité']}
            rows={rows}
            icon={isIn ? <IconEntry /> : <IconExit />}
            empty="Aucun mouvement enregistré pour le moment."
          />
        </Card>
      </div>
    </>
  )
}
