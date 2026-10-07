import { useState } from 'react'
import Card from '../../components/ui/Card'
import Kpi from '../../components/ui/Kpi'
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
  IconCheck,
  IconEdit,
  IconPin,
  IconPlus,
  IconTrash,
  IconTruck,
  IconUsers,
} from '../../lib/icons'

/* Champs du formulaire fournisseur, réutilisés dans la fenêtre de modification. */
function SupplierFormBody({ supplier }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Raison sociale">
        <input className="inp" name="nom" defaultValue={supplier.nom} required />
      </Field>
      <Field label="Code fournisseur">
        <input className="inp" value={supplier.id} disabled />
      </Field>
      <Field label="Personne à contacter">
        <input className="inp" name="contact" defaultValue={supplier.contact} placeholder="Ex. Aïcha Diallo" />
      </Field>
      <Field label="Téléphone">
        <input className="inp" name="tel" defaultValue={supplier.tel} placeholder="+229 97 00 00 00" />
      </Field>
      <Field label="E-mail">
        <input className="inp" type="email" name="mail" defaultValue={supplier.mail} placeholder="contact@fournisseur.com" />
      </Field>
      <Field label="Ville">
        <input className="inp" name="ville" defaultValue={supplier.ville} placeholder="Ex. Cotonou" />
      </Field>
    </div>
  )
}

export default function Suppliers() {
  const { data, addSupplier, updateSupplier, deleteSupplier, nextSupplierId } = useStore()
  const { space } = useSpace()
  const { showToast, openModal, confirmAction } = useUi()
  const [panelOpen, setPanelOpen] = useState(false)
  const { filters, setSearch, reset } = useFilters({ q: '' })

  const entries = data.suppliers.map((supplier) => ({
    supplier,
    searchText: `${supplier.id} ${supplier.nom} ${supplier.contact} ${supplier.mail} ${supplier.ville}`,
  }))
  const visible = entries.filter((entry) => rowMatches(entry, filters))

  const rows = visible.map(({ supplier }) => ({
      key: supplier.id,
      cells: [
        <span className="nm">
          <b>{supplier.nom}</b>
          <span>{supplier.id}</span>
        </span>,
        <span className="nm">
          <b>{supplier.contact || '—'}</b>
          <span>{supplier.mail || ''}</span>
        </span>,
        <span className="num text-neutral-600">{supplier.tel || '—'}</span>,
        <span className="tag">
          <span className="ic">
            <IconPin />
          </span>
          {supplier.ville || '—'}
        </span>,
        <div className="acts">
          <button type="button" className="btn btn-g btn-sm" onClick={() => openEdit(supplier)}>
            <IconEdit />
            Modifier
          </button>
          <button
            type="button"
            className="btn btn-d btn-sm btn-ico"
            title="Supprimer"
            aria-label={`Supprimer ${supplier.nom}`}
            onClick={() => handleDelete(supplier)}
          >
            <IconTrash />
          </button>
        </div>,
      ],
    }))

  const handleAdd = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const error = await addSupplier({
      nom: form.nom.value,
      contact: form.contact.value.trim(),
      tel: form.tel.value.trim(),
      mail: form.mail.value.trim(),
      ville: form.ville.value.trim(),
    })
    if (error) return showToast(error, { error: true })

    showToast(`Fournisseur « ${form.nom.value.trim()} » enregistré`)
    form.reset()
    return undefined
  }

  const openEdit = (supplier) => {
    openModal({
      title: 'Modifier le fournisseur',
      sub: supplier.id,
      ok: 'Enregistrer',
      body: <SupplierFormBody supplier={supplier} />,
      onSubmit: async (form) => {
        const error = await updateSupplier(supplier.id, {
          nom: form.nom.value,
          contact: form.contact.value.trim(),
          tel: form.tel.value.trim(),
          mail: form.mail.value.trim(),
          ville: form.ville.value.trim(),
        })
        if (error) {
          showToast(error, { error: true })
          return false
        }
        showToast('Fournisseur mis à jour')
        return true
      },
    })
  }

  const handleDelete = (supplier) => {
    confirmAction({
      title: 'Supprimer le fournisseur ?',
      message: `« ${supplier.nom} » sera supprimé du répertoire.`,
      ok: 'Supprimer',
      onConfirm: async () => {
        const error = await deleteSupplier(supplier.id)
        showToast(error || 'Fournisseur supprimé', { error: Boolean(error) })
      },
    })
    return undefined
  }

  const total = data.suppliers.length
  const avecContact = data.suppliers.filter((supplier) => supplier.contact).length
  const sansEmail = data.suppliers.filter((supplier) => !supplier.mail).length
  const villes = new Set(data.suppliers.map((supplier) => supplier.ville).filter(Boolean)).size

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconTruck />}
        title="Fournisseurs"
        description="Vos partenaires de réapprovisionnement et leurs coordonnées."
        actions={
          <CollapseButton
            open={panelOpen}
            onToggle={() => setPanelOpen((open) => !open)}
            openLabel="Nouveau fournisseur"
            closeLabel="Masquer le formulaire"
            icon={<IconTruck />}
          />
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5 stagger">
        <Kpi
          label="Fournisseurs"
          value={total}
          icon={<IconTruck />}
          sub="Partenaires enregistrés"
        />
        <Kpi label="Avec contact" value={avecContact} icon={<IconCheck />} tone="blue" sub="Personne à contacter" />
        <Kpi label="Villes" value={villes} icon={<IconPin />} tone="amber" sub="Implantations couvertes" />
        <Kpi label="Sans e-mail" value={sansEmail} icon={<IconUsers />} sub="À compléter" />
      </div>

      <CollapsePanel open={panelOpen}>
        <Card
          title="Nouveau fournisseur"
          sub="Les coordonnées servent au suivi des réapprovisionnements"
          icon={<IconTruck />}
        >
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Field label="Raison sociale">
              <input className="inp" name="nom" required placeholder="Ex. Sénèlec Tech" />
            </Field>
            <Field label="Code fournisseur">
              <input className="inp" value={nextSupplierId()} disabled />
            </Field>
            <Field label="Personne à contacter">
              <input className="inp" name="contact" placeholder="Ex. Aïcha Diallo" />
            </Field>
            <Field label="Téléphone">
              <input className="inp" name="tel" placeholder="+229 97 00 00 00" />
            </Field>
            <Field label="E-mail">
              <input className="inp" type="email" name="mail" placeholder="contact@fournisseur.com" />
            </Field>
            <Field label="Ville">
              <input className="inp" name="ville" placeholder="Ex. Cotonou" />
            </Field>
            <div className="sm:col-span-2 xl:col-span-3 flex justify-end pt-1">
              <button className="btn btn-p btn-lg">
                <IconPlus />
                Enregistrer le fournisseur
              </button>
            </div>
          </form>
        </Card>
      </CollapsePanel>

      <Card
        title="Répertoire des fournisseurs"
        sub="Répertoire de vos partenaires de réapprovisionnement"
        icon={<IconTruck />}
        pad={false}
      >
        <FilterBar
          searchPlaceholder="Rechercher un fournisseur, un contact, une ville…"
          filters={filters}
          onSearch={setSearch}
          onReset={reset}
          shown={visible.length}
          total={entries.length}
        />
        <DataTable
          columns={['Fournisseur', 'Contact', 'Téléphone', 'Ville', '']}
          rows={rows}
          icon={<IconTruck />}
          empty="Aucun fournisseur ne correspond à votre recherche."
        />
      </Card>
    </>
  )
}
