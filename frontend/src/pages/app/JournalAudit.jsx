import Card from '../../components/ui/Card'
import Kpi from '../../components/ui/Kpi'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import PageHero from '../../components/ui/PageHero'
import { useStore } from '../../store/StoreContext'
import { useSpace } from '../../store/SpaceContext'
import { rowMatches, useFilters } from '../../lib/filters'
import { IconClock, IconList, IconShield } from '../../lib/icons'

const ACTION_TONE = {
  CREATION: 'ok',
  ENTREE: 'ok',
  MODIFICATION: 'warn',
  SORTIE: 'bad',
  SUPPRESSION: 'bad',
  ACTIVATION: 'info',
  DESACTIVATION: 'off',
}

const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort()

export default function JournalAudit() {
  const { data } = useStore()
  const { space } = useSpace()
  const { filters, setSearch, setSelect, reset } = useFilters({ q: '', mo: '', ac: '' })

  const journal = data.journal || []
  const modules = uniqueSorted(journal.map((entry) => entry.module))
  const actions = uniqueSorted(journal.map((entry) => entry.action))
  const last = journal[0]

  const entries = journal.map((entry) => ({
    entry,
    searchText: `${entry.description} ${entry.module} ${entry.action} ${entry.typeObjet} ${
      entry.idObjet ?? ''
    } ${entry.dateHeure}`,
    mo: entry.module,
    ac: entry.action,
  }))
  const visible = entries.filter((entry) => rowMatches(entry, filters))

  const rows = visible.map(({ entry }) => ({
    key: entry.id,
    cells: [
      <span className="num text-neutral-500">{entry.dateHeure}</span>,
      <Badge tone={ACTION_TONE[entry.action] || 'info'}>{entry.action}</Badge>,
      <span className="nm">
        <b>{entry.module}</b>
        <span>{entry.typeObjet}</span>
      </span>,
      entry.idObjet != null ? (
        <span className="num">#{entry.idObjet}</span>
      ) : (
        <span className="text-xs text-neutral-400">—</span>
      ),
      <span className="text-neutral-600">{entry.description}</span>,
    ],
  }))

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconShield />}
        title="Journal d'audit"
        description="Toutes les opérations enregistrées : créations, modifications, suppressions et mouvements."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mb-5 stagger">
        <Kpi
          label="Événements enregistrés"
          value={journal.length}
          icon={<IconList />}
          tone="blue"
          sub="500 dernières opérations"
        />
        <Kpi label="Modules tracés" value={modules.length} icon={<IconShield />} sub="Modules concernés" />
        <Kpi
          label="Dernière activité"
          value={last ? last.dateHeure : '—'}
          icon={<IconClock />}
          small
          sub="Opération la plus récente"
        />
      </div>

      <Card title="Historique des opérations" icon={<IconList />} pad={false}>
        <FilterBar
          searchPlaceholder="Rechercher une opération, un module, un objet…"
          filters={filters}
          onSearch={setSearch}
          onSelect={setSelect}
          onReset={reset}
          shown={visible.length}
          total={entries.length}
          selects={[
            {
              key: 'mo',
              label: 'Module',
              options: [
                { value: '', label: 'Tous les modules' },
                ...modules.map((module) => ({ value: module, label: module })),
              ],
            },
            {
              key: 'ac',
              label: 'Action',
              options: [
                { value: '', label: 'Toutes les actions' },
                ...actions.map((action) => ({ value: action, label: action })),
              ],
            },
          ]}
        />
        <DataTable
          columns={['Date & heure', 'Action', 'Module', 'Objet', 'Description']}
          rows={rows}
          icon={<IconShield />}
          empty="Aucune opération ne correspond à votre recherche."
        />
      </Card>
    </>
  )
}
