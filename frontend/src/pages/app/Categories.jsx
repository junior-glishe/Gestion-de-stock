import { useState } from 'react'
import Card from '../../components/ui/Card'
import DataTable from '../../components/ui/DataTable'
import Field from '../../components/ui/Field'
import FilterBar from '../../components/ui/FilterBar'
import Meter from '../../components/ui/Meter'
import EmptyState from '../../components/ui/EmptyState'
import PageHero from '../../components/ui/PageHero'
import { CollapseButton, CollapsePanel } from '../../components/ui/CollapsePanel'
import { useStore } from '../../store/StoreContext'
import { useSpace } from '../../store/SpaceContext'
import { useUi } from '../../store/UiContext'
import { rowMatches, useFilters } from '../../lib/filters'
import { IconBox, IconChart, IconLayers, IconPlus, IconTag, IconTrash } from '../../lib/icons'

export default function Categories() {
  const { data, addCategory, deleteCategory } = useStore()
  const { space } = useSpace()
  const { showToast, confirmAction } = useUi()
  const [panelOpen, setPanelOpen] = useState(false)
  const { filters, setSearch, reset } = useFilters({ q: '' })

  const entries = data.categories.map((category) => ({
    category,
    searchText: category,
    count: data.products.filter((product) => product.categorie === category).length,
  }))
  const visible = entries.filter((entry) => rowMatches(entry, filters))

  const rows = visible.map(({ category, count }) => ({
    key: category,
    cells: [
      <span className="nm">
        <b>{category}</b>
        <span>{count} produit(s) rattaché(s)</span>
      </span>,
      <span className="tag">
        <span className="ic">
          <IconBox />
        </span>
        {count}
      </span>,
      <div className="acts">
        <button
          type="button"
          className="btn btn-d btn-sm btn-ico"
          title="Supprimer"
          aria-label={`Supprimer la catégorie ${category}`}
          onClick={() => handleDelete(category)}
        >
          <IconTrash />
        </button>
      </div>,
    ],
  }))

  const handleAdd = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.nom.value.trim()
    const error = await addCategory(name)
    if (error) return showToast(error, { error: true })

    showToast(`Catégorie « ${name} » ajoutée`)
    form.reset()
    return undefined
  }

  const handleDelete = (category) => {
    const used = data.products.filter((product) => product.categorie === category).length
    if (used > 0) return showToast(`${used} produit(s) utilisent « ${category} »`, { error: true })

    confirmAction({
      title: 'Supprimer la catégorie ?',
      message: `La catégorie « ${category} » sera supprimée.`,
      ok: 'Supprimer',
      onConfirm: async () => {
        const error = await deleteCategory(category)
        showToast(error || 'Catégorie supprimée', { error: Boolean(error) })
      },
    })
    return undefined
  }

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconTag />}
        title="Catégories"
        description="Classez vos produits pour les retrouver facilement."
        actions={
          <CollapseButton
            open={panelOpen}
            onToggle={() => setPanelOpen((open) => !open)}
            openLabel="Nouvelle catégorie"
            closeLabel="Masquer le formulaire"
            icon={<IconTag />}
          />
        }
      />

      <CollapsePanel open={panelOpen}>
        <Card
          title="Nouvelle catégorie"
          sub="Une catégorie peut regrouper autant de produits que nécessaire"
          icon={<IconTag />}
        >
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <Field label="Nom de la catégorie">
                <input
                  className="inp"
                  name="nom"
                  required
                  placeholder="Ex. Mobilier de bureau"
                />
              </Field>
            </div>
            <button className="btn btn-p btn-lg">
              <IconPlus />
              Ajouter
            </button>
          </form>
        </Card>
      </CollapsePanel>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card
          title="Catégories"
          sub={`${data.categories.length} catégorie(s) au total`}
          icon={<IconLayers />}
          pad={false}
          lift
          span={2}
        >
          <FilterBar
            searchPlaceholder="Rechercher une catégorie…"
            filters={filters}
            onSearch={setSearch}
            onSelect={() => {}}
            onReset={reset}
            shown={visible.length}
            total={entries.length}
          />
          <DataTable
            columns={['Catégorie', 'Produits', '']}
            rows={rows}
            icon={<IconLayers />}
            empty="Aucune catégorie."
          />
        </Card>

        <Card
          title="Répartition"
          sub="Part des produits par catégorie"
          icon={<IconChart />}
          className="col-span-2 lg:col-span-1"
        >
          {data.categories.length ? (
            data.categories.map((category) => (
              <Meter
                key={category}
                label={category}
                value={`${data.products.filter((p) => p.categorie === category).length} produit(s)`}
                tone="blue"
              />
            ))
          ) : (
            <EmptyState icon={<IconChart />}>Aucune catégorie.</EmptyState>
          )}
        </Card>
      </div>
    </>
  )
}
