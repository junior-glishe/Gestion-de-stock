"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalJson = exports.espaceDeRole = exports.roleVersBase = exports.roleVersFront = exports.inventaireJson = exports.alerteJson = exports.produitJson = exports.movementJson = exports.nomComplet = exports.formatDateTime = exports.formatDate = void 0;
const formatDate = (date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
exports.formatDate = formatDate;
const formatDateTime = (date) => `${(0, exports.formatDate)(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
exports.formatDateTime = formatDateTime;
const nomComplet = (user) => [user.prenom, user.nom].filter(Boolean).join(' ');
exports.nomComplet = nomComplet;
const movementJson = (m) => ({
    id: m.id,
    date: (0, exports.formatDate)(m.date),
    type: m.type === 'ENTREE' ? 'entree' : 'sortie',
    reference: m.produit.reference,
    nom: m.produit.nom,
    quantite: m.quantite,
});
exports.movementJson = movementJson;
const produitJson = (p) => ({
    reference: p.reference,
    nom: p.nom,
    description: p.description ?? '',
    categorie: p.categorie.nom,
    quantite: p.quantite,
    seuil: p.seuil,
    prix: Number(p.prix),
});
exports.produitJson = produitJson;
const alerteJson = (a) => ({
    id: a.id,
    date: (0, exports.formatDate)(a.date),
    reference: a.produit.reference,
    message: a.message,
    traitee: a.traitee,
});
exports.alerteJson = alerteJson;
const inventaireJson = (i) => ({
    id: i.id,
    date: (0, exports.formatDate)(i.date),
    checked: i.lignes.length,
    differences: i.lignes.filter((ligne) => ligne.quantiteReelle !== ligne.quantiteTheorique).length,
});
exports.inventaireJson = inventaireJson;
const roleVersFront = (role) => role === 'ADMINISTRATEUR' ? 'Administrateur' : role === 'SUPERVISEUR' ? 'Superviseur' : 'Gestionnaire';
exports.roleVersFront = roleVersFront;
const roleVersBase = (role) => {
    if (role === 'Administrateur')
        return 'ADMINISTRATEUR';
    if (role === 'Superviseur' || role === 'Propriétaire')
        return 'SUPERVISEUR';
    if (role === 'Gestionnaire')
        return 'GESTIONNAIRE';
    throw new Error('Profil inconnu');
};
exports.roleVersBase = roleVersBase;
const espaceDeRole = (role) => role === 'ADMINISTRATEUR' || role === 'Administrateur'
    ? 'admin'
    : role === 'SUPERVISEUR' || role === 'Superviseur' || role === 'Propriétaire'
        ? 'superviseur'
        : 'gestionnaire';
exports.espaceDeRole = espaceDeRole;
const journalJson = (ligne) => ({
    id: ligne.idAudit,
    dateHeure: (0, exports.formatDateTime)(ligne.dateHeure),
    action: ligne.action,
    module: ligne.module,
    typeObjet: ligne.typeObjet,
    idObjet: ligne.idObjet,
    description: ligne.description,
});
exports.journalJson = journalJson;
//# sourceMappingURL=format.js.map