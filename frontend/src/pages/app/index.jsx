import Dashboard from './Dashboard'
import Products from './Products'
import Categories from './Categories'
import Suppliers from './Suppliers'
import Alerts from './Alerts'
import Inventory from './Inventory'
import Statistics from './Statistics'
import Access from './Access'
import Movements from './Movements'
import JournalAudit from './JournalAudit'

/* Pages d'espace, associées à leur clé de route. */

const EntriesPage = () => <Movements type="entree" />
const ExitsPage = () => <Movements type="sortie" />

export const PAGE_COMPONENTS = {
  'tableau-de-bord': Dashboard,
  produits: Products,
  categories: Categories,
  fournisseurs: Suppliers,
  entrees: EntriesPage,
  sorties: ExitsPage,
  alertes: Alerts,
  inventaire: Inventory,
  statistiques: Statistics,
  acces: Access,
  'journal-audit': JournalAudit,
}
