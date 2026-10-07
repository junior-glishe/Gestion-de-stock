import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Kpi from '../../components/ui/Kpi'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import ListRow from '../../components/ui/ListRow'
import Meter from '../../components/ui/Meter'
import EmptyState from '../../components/ui/EmptyState'
import PageHero from '../../components/ui/PageHero'
import { useStore } from '../../store/StoreContext'
import { useSpace } from '../../store/SpaceContext'
import { useUi } from '../../store/UiContext'
import {
  IconAlert,
  IconBell,
  IconBox,
  IconChart,
  IconCheck,
  IconChevron,
  IconClock,
  IconDatabase,
  IconEntry,
  IconExit,
  IconLayers,
} from '../../lib/icons'
import { firstName, formatNumber, greeting, isLowStock, today } from '../../lib/format'

export default function Dashboard() {
  const { data, treatAlert } = useStore()
  const { space, role } = useSpace()
  const { showToast } = useUi()

  const hasPage = (key) =>
    space.groups.some((group) => group.items.some((item) => item.key === key))

  const lowProducts = data.products.filter(isLowStock)
  const openAlerts = data.alerts.filter((alert) => !alert.traitee)
  const todayEntries = data.movements
    .filter((movement) => movement.type === 'entree' && movement.date === today())
    .reduce((sum, movement) => sum + movement.quantite, 0)
  const totalUnits = data.products.reduce((sum, product) => sum + product.quantite, 0)
  const categoriesUnits = data.categories.map((category) => ({
    category,
    units: data.products
      .filter((product) => product.categorie === category)
      .reduce((sum, product) => sum + product.quantite, 0),
  }))

  const stockRows = data.products.map((product) => ({
    key: product.reference,
    cells: [
      <span className="nm">
        <b>{product.nom}</b>
        <span>
          {product.reference} · {product.categorie}
        </span>
      </span>,
      <span className="text-neutral-500">{product.categorie}</span>,
      <b className="num">{product.quantite}</b>,
      <span className="num">{product.seuil}</span>,
      <Badge tone={isLowStock(product) ? 'bad' : 'ok'}>
        {isLowStock(product) ? 'Stock bas' : 'Disponible'}
      </Badge>,
    ],
  }))

  const handleTreat = async (id) => {
    const error = await treatAlert(id)
    showToast(error || 'Alerte marquée comme traitée', { error: Boolean(error) })
  }

  return (
    <>
      <PageHero
        spaceLabel={space.label}
        icon={<IconChart />}
        title={`${greeting()}${firstName(space.demoUser.nom) ? `, ${firstName(space.demoUser.nom)}` : ' !'}`}
        description="Voici votre tableau de bord : l’état de vos stocks, vos alertes et vos derniers mouvements."
        actions={
          <>
            {hasPage('entrees') ? (
              <Link className="btn btn-md" to={`/${role}/entrees`}>
                <IconEntry />
                Nouvelle entrée
              </Link>
            ) : null}
            {hasPage('sorties') ? (
              <Link className="btn btn-md" to={`/${role}/sorties`}>
                <IconExit />
                Nouvelle sortie
              </Link>
            ) : null}
            {hasPage('produits') ? (
              <Link className="btn btn-md" to={`/${role}/produits`}>
                <IconBox />
                Voir les produits
              </Link>
            ) : null}
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5 stagger">
        <Kpi
          label="Produits référencés"
          value={formatNumber(data.products.length)}
          icon={<IconBox />}
          sub={`${data.categories.length} catégorie(s) · ${data.suppliers.length} fournisseur(s)`}
        />
        <Kpi
          label="Unités en stock"
          value={formatNumber(totalUnits)}
          icon={<IconDatabase />}
          tone="blue"
          sub={<>Entrées du jour : <b>+{todayEntries}</b></>}
        />
        <Kpi
          label="Produits en stock bas"
          value={formatNumber(lowProducts.length)}
          icon={<IconAlert />}
          tone={lowProducts.length ? 'red' : 'amber'}
          sub={
            lowProducts.length ? (
              <b className="dn">{lowProducts.length} à réapprovisionner</b>
            ) : (
              'Aucune rupture en cours'
            )
          }
        />
        <Kpi
          label="Alertes à traiter"
          value={formatNumber(openAlerts.length)}
          icon={<IconBell />}
          tone={openAlerts.length ? 'red' : ''}
          sub={openAlerts.length ? <b className="dn">Action requise</b> : 'Tout est à jour'}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-5">
        <Card
          title="État du stock"
          sub="Quantités, seuils et statut de chaque produit"
          icon={<IconDatabase />}
          span={2}
          pad={false}
          right={
            hasPage('produits') ? (
              <Link className="link" to={`/${role}/produits`}>
                Tout voir <IconChevron />
              </Link>
            ) : null
          }
        >
          <DataTable
            columns={['Produit', 'Catégorie', 'Quantité', 'Seuil', 'Statut']}
            rows={stockRows}
            icon={<IconBox />}
            empty="Aucun produit enregistré."
          />
        </Card>

        <Card
          title="Alertes à traiter"
          sub={openAlerts.length ? `${openAlerts.length} alerte(s) en attente` : 'Votre stock est sous contrôle'}
          icon={<IconBell />}
          tone={openAlerts.length ? 'red' : ''}
          className="col-span-2 lg:col-span-1"
        >
          {openAlerts.length ? (
            <div className="lst">
              {openAlerts.slice(0, 5).map((alert) => (
                <ListRow
                  key={alert.id}
                  icon={<IconAlert />}
                  title={alert.message}
                  sub={alert.date}
                  right={
                    <button type="button" className="btn btn-g btn-sm" onClick={() => handleTreat(alert.id)}>
                      Traiter
                    </button>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={<IconCheck />}>Aucune alerte en cours.</EmptyState>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
        <Card
          title="Répartition par catégorie"
          sub="Unités en stock par catégorie"
          icon={<IconLayers />}
          className="col-span-2 lg:col-span-1"
        >
          {categoriesUnits.length ? (
            categoriesUnits.map(({ category, units }) => (
              <Meter key={category} label={category} value={`${units} unités`} />
            ))
          ) : (
            <EmptyState icon={<IconLayers />}>Aucune catégorie.</EmptyState>
          )}
        </Card>

        <Card
          title="Derniers mouvements"
          sub="5 dernières opérations"
          icon={<IconClock />}
          className="col-span-2 lg:col-span-1"
          right={
            hasPage('entrees') ? (
              <Link className="link" to={`/${role}/entrees`}>
                Historique <IconChevron />
              </Link>
            ) : null
          }
        >
          {data.movements.length ? (
            <div className="lst">
              {data.movements.slice(0, 5).map((movement) => (
                <ListRow
                  key={movement.id}
                  icon={movement.type === 'entree' ? <IconEntry /> : <IconExit />}
                  tone={movement.type === 'entree' ? 'up' : 'dn'}
                  title={movement.nom}
                  sub={`${movement.date} · ${movement.type === 'entree' ? 'Réception' : 'Sortie'}`}
                  right={
                    <span className={`qty ${movement.type === 'entree' ? 'up' : 'dn'}`}>
                      {movement.type === 'entree' ? '+' : '−'}
                      {movement.quantite}
                    </span>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={<IconClock />}>Aucun mouvement enregistré.</EmptyState>
          )}
        </Card>
      </div>
    </>
  )
}
