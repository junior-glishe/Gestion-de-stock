import Card from '../../components/ui/Card'
import Kpi from '../../components/ui/Kpi'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import PageHero from '../../components/ui/PageHero'
import { useStore } from '../../store/StoreContext'
import { useSpace } from '../../store/SpaceContext'
import { useUi } from '../../store/UiContext'
import { rowMatches, useFilters } from '../../lib/filters'
import { IconAlert, IconBell, IconCheck } from '../../lib/icons'

export default function Alerts() {
  const { data, treatAlert } = useStore()
  const { space } = useSpace()
  const { showToast } = useUi()
  const { filters, setSearch, setSelect, reset } = useFilters({ q: '', st: '' })

  const open = data.alerts.filter((alert) => !alert.traitee)
  const done = data.alerts.length - open.length

  const entries = data.alerts.map((alert) => ({
    alert,
    searchText: `${alert.message} ${alert.reference || ''} ${alert.date}`,
    st: alert.traitee ? 'done' : 'open',
  }))
  const visible = entries.filter((entry) => rowMatches(entry, filters))

  const rows = visible.map(({ alert }) => ({
    key: alert.id,
    cells: [
      <span className="num text-neutral-500">{alert.date}</span>,
      <span className="nm">
        <b>{alert.message}</b>
        <span>{alert.reference || ''}</span>
      </span>,
      <Badge tone={alert.traitee ? 'ok' : 'bad'}>
        {alert.traitee ? 'Traitée' : 'À traiter'}
      </Badge>,
      alert.traitee ? (
        <span className="text-xs text-neutral-400">Aucune action requise</span>
      ) : (
        <button
          type="button"
          className="btn btn-g btn-sm"
          onClick={async () => {
            const error = await treatAlert(alert.id)
            showToast(error || 'Alerte marquée comme traitée', { error: Boolean(error) })
          }}
        >
          <IconCheck />
          Marquer comme traitée
        </button>
      ),
    ],
  }))

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconBell />}
        title="Alertes de stock bas"
        description="Les produits passés sous leur seuil de sécurité, à réapprovisionner."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mb-5 stagger">
        <Kpi
          label="Alertes à traiter"
          value={open.length}
          icon={<IconAlert />}
          tone={open.length ? 'red' : ''}
          sub="Produits sous leur seuil"
        />
        <Kpi label="Alertes traitées" value={done} icon={<IconCheck />} sub="Historiquement résolues" />
        <Kpi
          label="Total"
          value={data.alerts.length}
          icon={<IconBell />}
          tone="blue"
          sub="Tous les événements"
        />
      </div>

      <Card title="Journal des alertes" icon={<IconBell />} pad={false}>
        <FilterBar
          searchPlaceholder="Rechercher une alerte, un produit…"
          filters={filters}
          onSearch={setSearch}
          onSelect={setSelect}
          onReset={reset}
          shown={visible.length}
          total={entries.length}
          selects={[
            {
              key: 'st',
              label: 'Statut',
              options: [
                { value: '', label: 'Toutes les alertes' },
                { value: 'open', label: 'À traiter' },
                { value: 'done', label: 'Traitées' },
              ],
            },
          ]}
        />
        <DataTable
          columns={['Date', 'Message', 'Statut', 'Action']}
          rows={rows}
          icon={<IconBell />}
          empty="Aucune alerte ne correspond à votre recherche."
        />
      </Card>
    </>
  )
}
