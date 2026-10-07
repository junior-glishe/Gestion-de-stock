import type { RoleUtilisateur, TypeMouvement } from '@prisma/client';

/* Formatage des données renvoyées au frontend React. */

/** Date au format français « 6/10/2026 », identique à toLocaleDateString('fr-FR'). */
export const formatDate = (date: Date): string =>
  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

/** Date et heure au format français « 6/10/2026 14:32 ». */
export const formatDateTime = (date: Date): string =>
  `${formatDate(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

/** Nom complet à partir des colonnes nom / prénom de la table utilisateur. */
export const nomComplet = (user: { nom: string; prenom: string }): string =>
  [user.prenom, user.nom].filter(Boolean).join(' ');

/** Mouvement de stock prêt à être affiché. */
export const movementJson = (m: {
  id: number;
  date: Date;
  quantite: number;
  type: TypeMouvement;
  produit: { reference: string; nom: string };
}) => ({
  id: m.id,
  date: formatDate(m.date),
  type: m.type === 'ENTREE' ? 'entree' : 'sortie',
  reference: m.produit.reference,
  nom: m.produit.nom,
  quantite: m.quantite,
});

/** Produit prêt à être affiché (catégorie résolue en nom, prix en nombre). */
export const produitJson = (p: {
  reference: string;
  nom: string;
  description?: string | null;
  quantite: number;
  seuil: number;
  prix: unknown;
  categorie: { nom: string };
}) => ({
  reference: p.reference,
  nom: p.nom,
  description: p.description ?? '',
  categorie: p.categorie.nom,
  quantite: p.quantite,
  seuil: p.seuil,
  prix: Number(p.prix),
});

/** Alerte de stock bas prête à être affichée. */export const alerteJson = (a: {
  id: number;
  date: Date;
  message: string;
  traitee: boolean;
  produit: { reference: string };
}) => ({
  id: a.id,
  date: formatDate(a.date),
  reference: a.produit.reference,
  message: a.message,
  traitee: a.traitee,
});

/** Inventaire prêt à être affiché. */
export const inventaireJson = (i: {
  id: number;
  date: Date;
  lignes: { quantiteTheorique: number; quantiteReelle: number }[];
}) => ({
  id: i.id,
  date: formatDate(i.date),
  checked: i.lignes.length,
  differences: i.lignes.filter((ligne) => ligne.quantiteReelle !== ligne.quantiteTheorique).length,
});

/** Libellé de profil attendu par le frontend. */
export const roleVersFront = (role: RoleUtilisateur): string =>
  role === 'ADMINISTRATEUR' ? 'Administrateur' : role === 'SUPERVISEUR' ? 'Superviseur' : 'Gestionnaire';

/** Valeur de champ « rôle » envoyée par le frontend, convertie en rôle de base. */
export const roleVersBase = (role: string): RoleUtilisateur => {
  if (role === 'Administrateur') return 'ADMINISTRATEUR';
  if (role === 'Superviseur' || role === 'Propriétaire') return 'SUPERVISEUR';
  if (role === 'Gestionnaire') return 'GESTIONNAIRE';
  throw new Error('Profil inconnu');
};

/** Espace (route) associé à un profil. */
export const espaceDeRole = (role: RoleUtilisateur | string): string =>
  role === 'ADMINISTRATEUR' || role === 'Administrateur'
    ? 'admin'
    : role === 'SUPERVISEUR' || role === 'Superviseur' || role === 'Propriétaire'
      ? 'superviseur'
      : 'gestionnaire';

/** Ligne du journal d'audit prête à être affichée. */
export const journalJson = (ligne: {
  idAudit: number;
  dateHeure: Date;
  action: string;
  module: string;
  typeObjet: string;
  idObjet: number | null;
  description: string;
}) => ({
  id: ligne.idAudit,
  dateHeure: formatDateTime(ligne.dateHeure),
  action: ligne.action,
  module: ligne.module,
  typeObjet: ligne.typeObjet,
  idObjet: ligne.idObjet,
  description: ligne.description,
});
