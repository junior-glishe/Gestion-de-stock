import { useState } from 'react'
import Card from '../../components/ui/Card'
import Kpi from '../../components/ui/Kpi'
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
  IconChart,
  IconCheck,
  IconClose,
  IconClipboard,
  IconPlus,
  IconShield,
  IconTag,
  IconTrash,
  IconTruck,
  IconUsers,
} from '../../lib/icons'

export default function Access() {
  const { data, addUser, toggleUser, deleteUser } = useStore()
  const { space } = useSpace()
  const { showToast, confirmAction } = useUi()
  const [panelOpen, setPanelOpen] = useState(true)
  const { filters, setSearch, setSelect, reset } = useFilters({ q: '', role: '', st: '' })

  const entries = data.users.map((user) => ({
    user,
    searchText: `${user.nom} ${user.email}`,
    role: user.role,
    st: user.actif ? 'on' : 'off',
  }))
  const visible = entries.filter((entry) => rowMatches(entry, filters))

  const rows = visible.map(({ user }) => ({
    key: user.email,
    cells: [
      <span className="nm">
        <b>{user.nom}</b>
        <span>{user.email}</span>
      </span>,
      <span className="tag">
        <span className="ic">
          {user.role === 'Superviseur' ? <IconShield /> : <IconUsers />}
        </span>
        {user.role}
      </span>,
      <Badge tone={user.actif ? 'ok' : 'off'}>{user.actif ? 'Actif' : 'Désactivé'}</Badge>,
      <div className="acts">
        <button
          type="button"
          className="btn btn-g btn-sm"
          onClick={async () => {
            const error = await toggleUser(user.email)
            showToast(
              error || `${user.nom} : accès ${user.actif ? 'désactivé' : 'activé'}`,
              { error: Boolean(error) },
            )
          }}
        >
          {user.actif ? <IconClose /> : <IconCheck />}
          {user.actif ? 'Désactiver' : 'Activer'}
        </button>
        <button
          type="button"
          className="btn btn-d btn-sm btn-ico"
          title="Supprimer"
          aria-label={`Supprimer le compte de ${user.nom}`}
          onClick={() => handleDelete(user)}
        >
          <IconTrash />
        </button>
      </div>,
    ],
  }))

  const handleAdd = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const error = await addUser({
      nom: form.nom.value.trim(),
      email: form.email.value,
      role: form.role.value,
      motDePasse: form.mdp.value,
    })
    if (error) return showToast(error, { error: true })

    showToast(`Compte créé pour ${form.nom.value.trim()}`)
    form.reset()
    return undefined
  }

  const handleDelete = (user) => {
    confirmAction({
      title: 'Supprimer le compte ?',
      message: `Le compte de ${user.nom} sera supprimé définitivement.`,
      ok: 'Supprimer',
      onConfirm: async () => {
        const error = await deleteUser(user.email)
        showToast(error || 'Compte supprimé', { error: Boolean(error) })
      },
    })
  }

  const activeAccounts = data.users.filter((user) => user.actif).length

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconUsers />}
        title="Gérer les accès"
        description="Créez des comptes et activez ou désactivez l'accès de chaque utilisateur."
        actions={
          <CollapseButton
            open={panelOpen}
            onToggle={() => setPanelOpen((open) => !open)}
            openLabel="Nouveau compte"
            closeLabel="Masquer le formulaire"
            icon={<IconUsers />}
          />
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5 stagger">
        <Kpi label="Comptes" value={data.users.length} icon={<IconUsers />} sub="Tous les profils" />
        <Kpi label="Accès actifs" value={activeAccounts} icon={<IconCheck />} sub="Comptes opérationnels" />
        <Kpi
          label="Accès suspendus"
          value={data.users.length - activeAccounts}
          icon={<IconClose />}
          tone="amber"
          sub="Comptes désactivés"
        />
        <Kpi
          label="Espaces gérés"
          value={data.users.filter((user) => user.role === 'Gestionnaire').length}
          icon={<IconShield />}
          tone="blue"
          sub="Comptes gestionnaire"
        />
      </div>

      <CollapsePanel open={panelOpen}>
        <Card
          title="Nouveau compte"
          sub="Le profil sert à répartir les responsabilités"
          icon={<IconUsers />}
        >
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Field label="Nom complet">
              <input className="inp" name="nom" required placeholder="Ex. Awa Dossou" />
            </Field>
            <Field label="Adresse e-mail">
              <input
                className="inp"
                type="email"
                name="email"
                required
                placeholder="utilisateur@stockpro.com"
              />
            </Field>
            <Field label="Profil">
              <select className="sel" name="role">
                <option>Gestionnaire</option>
                <option>Superviseur</option>
              </select>
            </Field>
            <Field label="Mot de passe">
              <input
                className="inp"
                type="password"
                name="mdp"
                required
                minLength={8}
                placeholder="8 caractères minimum"
              />
            </Field>
            <div className="sm:col-span-2 xl:col-span-3 flex justify-end pt-1">
              <button className="btn btn-p btn-lg">
                <IconPlus />
                Créer le compte
              </button>
            </div>
          </form>
        </Card>
      </CollapsePanel>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-5">
        <Card
          title="Comptes utilisateurs"
          sub={`${data.users.length} compte(s) enregistré(s)`}
          icon={<IconUsers />}
          pad={false}
          lift
          span={2}
        >
          <FilterBar
            searchPlaceholder="Rechercher un nom, un e-mail…"
            filters={filters}
            onSearch={setSearch}
            onSelect={setSelect}
            onReset={reset}
            shown={visible.length}
            total={entries.length}
            selects={[
              {
                key: 'role',
                label: 'Profil',
                options: [
                  { value: '', label: 'Tous les profils' },
                  { value: 'Gestionnaire', label: 'Gestionnaires' },
                  { value: 'Superviseur', label: 'Superviseurs' },
                ],
              },
              {
                key: 'st',
                label: 'Statut',
                options: [
                  { value: '', label: 'Tous les comptes' },
                  { value: 'on', label: 'Actifs' },
                  { value: 'off', label: 'Désactivés' },
                ],
              },
            ]}
          />
          <DataTable
            columns={['Utilisateur', 'Profil', 'Statut', '']}
            rows={rows}
            icon={<IconUsers />}
            empty="Aucun compte ne correspond à votre recherche."
          />
        </Card>

        <Card
          title="Activité de la plateforme"
          sub="Vue d'ensemble"
          icon={<IconChart />}
          className="col-span-2 lg:col-span-1"
        >
          <Kpi mini label="Produits" value={data.products.length} icon={<IconBox />} />
          <Kpi mini label="Catégories" value={data.categories.length} icon={<IconTag />} tone="blue" />
          <Kpi mini label="Fournisseurs" value={data.suppliers.length} icon={<IconTruck />} tone="amber" />
          <Kpi mini label="Mouvements" value={data.movements.length} icon={<IconClipboard />} tone="blue" />
        </Card>
      </div>
    </>
  )
}
