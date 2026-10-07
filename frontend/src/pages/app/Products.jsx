import { useState } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import Field from '../../components/ui/Field'
import FilterBar from '../../components/ui/FilterBar'
import PageHero from '../../components/ui/PageHero'
import { CollapseButton, CollapsePanel } from '../../components/ui/CollapsePanel'
import { useStore } from '../../store/StoreContext'
import { useSpace } from '../../store/SpaceContext'
import { useUi } from '../../store/UiContext'
import { rowMatches, useFilters } from '../../lib/filters'
import {
  IconBox,
  IconEdit,
  IconList,
  IconPlus,
  IconTag,
  IconTrash,
} from '../../lib/icons'
import { formatMoney, isLowStock } from '../../lib/format'

/* Champs du formulaire produit, réutilisés dans la fenêtre de modification. */
function ProductFormBody({ product, categories }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Référence">
        <input className="inp" name="ref" defaultValue={product.reference} required />
      </Field>
      <Field label="Nom du produit">
        <input className="inp" name="nom" defaultValue={product.nom} required />
      </Field>
      <Field label="Catégorie">
        <select className="sel" name="cat" defaultValue={product.categorie}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </Field>
      <Field label="Quantité en stock">
        <input
          className="inp inp-s"
          type="number"
          min="0"
          name="qte"
          defaultValue={product.quantite}
          required
        />
      </Field>
      <Field label="Seuil d'alerte">
        <input
          className="inp inp-s"
          type="number"
          min="0"
          name="seuil"
          defaultValue={product.seuil}
          required
        />
      </Field>
      <Field label="Prix unitaire (FCFA)">
        <input
          className="inp inp-s"
          type="number"
          min="0"
          name="prix"
          defaultValue={product.prix}
          required
        />
      </Field>
    </div>
  )
}

export default function Products() {
  const { data, addProduct, updateProduct, deleteProduct } = useStore()
  const { space } = useSpace()
  const { showToast, openModal, confirmAction } = useUi()
  const [panelOpen, setPanelOpen] = useState(false)
  const { filters, setSearch, setSelect, reset } = useFilters({ q: '', cat: '', st: '' })

  const entries = data.products.map((product) => ({
    product,
    searchText: `${product.reference} ${product.nom} ${product.categorie}`,
    cat: product.categorie,
    st: isLowStock(product) ? 'low' : 'ok',
  }))
  const visible = entries.filter((entry) => rowMatches(entry, filters))

  const rows = visible.map(({ product }) => ({
    key: product.reference,
    cells: [
      <span className="nm">
        <b>{product.nom}</b>
        <span>{product.reference}</span>
      </span>,
      <span className="tag">
        <span className="ic">
          <IconTag />
        </span>
        {product.categorie}
      </span>,
      <b className="num">{product.quantite}</b>,
      <span className="num">{product.seuil}</span>,
      <span className="num">{formatMoney(product.prix)}</span>,
      <Badge tone={isLowStock(product) ? 'bad' : 'ok'}>
        {isLowStock(product) ? 'Stock bas' : 'Disponible'}
      </Badge>,
      <div className="acts">
        <button
          type="button"
          className="btn btn-g btn-sm"
          onClick={() => openEdit(product)}
        >
          <IconEdit />
          Modifier
        </button>
        <button
          type="button"
          className="btn btn-d btn-sm btn-ico"
          title="Supprimer"
          aria-label={`Supprimer ${product.nom}`}
          onClick={() => handleDelete(product)}
        >
          <IconTrash />
        </button>
      </div>,
    ],
  }))

  const handleAdd = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const error = await addProduct({
      reference: form.ref.value.trim().toUpperCase(),
      nom: form.nom.value.trim(),
      categorie: form.cat.value,
      quantite: Number(form.qte.value),
      seuil: Number(form.seuil.value),
      prix: Number(form.prix.value),
    })
    if (error) return showToast(error, { error: true })

    showToast(`Produit « ${form.nom.value.trim()} » ajouté`)
    form.reset()
    return undefined
  }

  const openEdit = (product) => {
    openModal({
      title: 'Modifier le produit',
      sub: product.reference,
      ok: 'Enregistrer',
      body: (
        <ProductFormBody product={product} categories={data.categories} />
      ),
      onSubmit: async (form) => {
        const error = await updateProduct(product.reference, {
          reference: form.ref.value.trim().toUpperCase(),
          nom: form.nom.value.trim(),
          categorie: form.cat.value,
          quantite: Number(form.qte.value),
          seuil: Number(form.seuil.value),
          prix: Number(form.prix.value),
        })
        if (error) {
          showToast(error, { error: true })
          return false
        }
        showToast('Produit mis à jour')
        return true
      },
    })
  }

  const handleDelete = (product) => {
    confirmAction({
      title: 'Supprimer le produit ?',
      message: `« ${product.nom} » sera définitivement supprimé.`,
      ok: 'Supprimer',
      onConfirm: async () => {
        const error = await deleteProduct(product.reference)
        showToast(error || 'Produit supprimé', { error: Boolean(error) })
      },
    })
  }

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconBox />}
        title="Produits"
        description="Créez vos produits avec leur référence, leur prix et leur seuil d'alerte."
        actions={
          <CollapseButton
            open={panelOpen}
            onToggle={() => setPanelOpen((open) => !open)}
            openLabel="Nouveau produit"
            closeLabel="Masquer le formulaire"
          />
        }
      />

      <CollapsePanel open={panelOpen}>
        <Card
          title="Nouveau produit"
          sub="Référence unique, seuil d'alerte et prix unitaire"
          icon={<IconBox />}
        >
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Field label="Référence">
              <input className="inp" name="ref" required placeholder="INF-003" />
            </Field>
            <Field label="Nom du produit">
              <input className="inp" name="nom" required placeholder="Souris optique" />
            </Field>
            <Field label="Catégorie">
              <select className="sel" name="cat">
                {data.categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Quantité">
              <input className="inp inp-s" type="number" min="0" name="qte" defaultValue="0" required />
            </Field>
            <Field label="Seuil d'alerte">
              <input className="inp inp-s" type="number" min="0" name="seuil" defaultValue="5" required />
            </Field>
            <Field label="Prix unitaire (FCFA)">
              <input className="inp inp-s" type="number" min="0" name="prix" defaultValue="0" required />
            </Field>
            <div className="sm:col-span-2 xl:col-span-3 flex justify-end pt-1">
              <button className="btn btn-p btn-lg">
                <IconPlus />
                Ajouter le produit
              </button>
            </div>
          </form>
        </Card>
      </CollapsePanel>

      <Card
        title="Catalogue"
        sub={`${data.products.length} produit(s) au catalogue`}
        icon={<IconList />}
        pad={false}
      >
        <FilterBar
          searchPlaceholder="Rechercher un produit, une référence…"
          filters={filters}
          onSearch={setSearch}
          onSelect={setSelect}
          onReset={reset}
          shown={visible.length}
          total={entries.length}
          selects={[
            {
              key: 'cat',
              label: 'Catégorie',
              options: [
                { value: '', label: 'Toutes les catégories' },
                ...data.categories.map((category) => ({ value: category, label: category })),
              ],
            },
            {
              key: 'st',
              label: 'Statut',
              options: [
                { value: '', label: 'Tous les statuts' },
                { value: 'ok', label: 'Disponible' },
                { value: 'low', label: 'Stock bas' },
              ],
            },
          ]}
        />
        <DataTable
          columns={['Produit', 'Catégorie', 'Quantité', 'Seuil', 'Prix', 'Statut', '']}
          rows={rows}
          icon={<IconList />}
          empty="Aucun produit ne correspond à votre recherche."
        />
      </Card>
    </>
  )
}
