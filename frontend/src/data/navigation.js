/* Configuration des espaces : menus, pages et textes par rôle. */

import {
  IconBell,
  IconBox,
  IconChart,
  IconClipboard,
  IconDashboard,
  IconEntry,
  IconExit,
  IconShield,
  IconTag,
  IconTruck,
  IconUsers,
} from '../lib/icons'

export const SPACES = {
  gestionnaire: {
    label: 'Espace gestionnaire',
    demoUser: { nom: 'Marc DOSSOU', email: 'gestionnaire@stockpro.local' },
    defaultPage: 'tableau-de-bord',
    groups: [
      {
        label: 'Pilotage',
        items: [
          { key: 'tableau-de-bord', label: 'Tableau de bord', icon: IconDashboard },
          { key: 'alertes', label: 'Alertes', icon: IconBell },
        ],
      },
      {
        label: 'Stock',
        items: [
          { key: 'produits', label: 'Produits', icon: IconBox },
          { key: 'categories', label: 'Catégories', icon: IconTag },
          { key: 'fournisseurs', label: 'Fournisseurs', icon: IconTruck },
        ],
      },
      {
        label: 'Mouvements',
        items: [
          { key: 'entrees', label: 'Entrée de stock', icon: IconEntry },
          { key: 'sorties', label: 'Sortie de stock', icon: IconExit },
        ],
      },
    ],
  },

  superviseur: {
    label: 'Espace superviseur',
    demoUser: { nom: 'Awa HOUNSOU', email: 'superviseur@stockpro.local' },
    defaultPage: 'tableau-de-bord',
    groups: [
      {
        label: 'Pilotage',
        items: [
          { key: 'tableau-de-bord', label: 'Tableau de bord', icon: IconDashboard },
          { key: 'statistiques', label: 'Statistiques', icon: IconChart },
          { key: 'alertes', label: 'Alertes', icon: IconBell },
          { key: 'journal-audit', label: "Journal d'audit", icon: IconShield },
        ],
      },
      {
        label: 'Stock',
        items: [
          { key: 'produits', label: 'Produits', icon: IconBox },
          { key: 'categories', label: 'Catégories', icon: IconTag },
          { key: 'inventaire', label: 'Inventaire', icon: IconClipboard },
          { key: 'fournisseurs', label: 'Fournisseurs', icon: IconTruck },
        ],
      },
      {
        label: 'Mouvements',
        items: [
          { key: 'entrees', label: 'Entrée de stock', icon: IconEntry },
          { key: 'sorties', label: 'Sortie de stock', icon: IconExit },
        ],
      },
    ],
  },

  admin: {
    label: 'Administration',
    demoUser: { nom: 'Systeme ADMIN', email: 'admin@stockpro.local' },
    defaultPage: 'acces',
    groups: [
      {
        label: 'Administration',
        items: [{ key: 'acces', label: 'Gérer les accès', icon: IconUsers }],
      },
    ],
  },
}

export const PAGE_META = {
  'tableau-de-bord': {
    title: 'Tableau de bord',
    description: "L'état de votre stock, mis à jour à chaque mouvement.",
  },
  produits: {
    title: 'Produits',
    description: "Créez vos produits avec leur référence, leur prix et leur seuil d'alerte.",
  },
  categories: {
    title: 'Catégories',
    description: 'Classez vos produits pour les retrouver facilement.',
  },
  fournisseurs: {
    title: 'Fournisseurs',
    description: 'Vos partenaires de réapprovisionnement et leurs coordonnées.',
  },
  entrees: {
    title: 'Entrée de stock',
    description: 'Enregistrez chaque réception de marchandise.',
  },
  sorties: {
    title: 'Sortie de stock',
    description: 'Enregistrez les ventes et les consommations.',
  },
  alertes: {
    title: 'Alertes de stock bas',
    description: 'Les produits passés sous leur seuil de sécurité, à réapprovisionner.',
  },
  inventaire: {
    title: 'Inventaire',
    description: "Comparez la quantité théorique à la quantité réelle comptée, puis générez l'inventaire.",
  },
  statistiques: {
    title: 'Statistiques',
    description: "Une vue d'ensemble de la valeur et de l'activité de votre stock.",
  },
  acces: {
    title: 'Gérer les accès',
    description: "Créez des comptes et activez ou désactivez l'accès de chaque utilisateur.",
  },
  'journal-audit': {
    title: "Journal d'audit",
    description: 'Toutes les opérations enregistrées : créations, modifications, suppressions et mouvements.',
  },
}

export const findSpaceItem = (spaceKey, pageKey) =>
  SPACES[spaceKey]
    .groups.flatMap((group) => group.items)
    .find((item) => item.key === pageKey)
