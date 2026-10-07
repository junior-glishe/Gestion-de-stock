"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncAlerts = syncAlerts;
async function syncAlerts(prisma) {
    const produits = await prisma.produit.findMany({
        select: { id: true, nom: true, quantite: true, seuil: true },
    });
    for (const produit of produits) {
        if (produit.quantite <= produit.seuil) {
            const dejaOuverte = await prisma.alerte.findFirst({
                where: { idProduit: produit.id, traitee: false },
            });
            if (!dejaOuverte) {
                await prisma.alerte.create({
                    data: {
                        idProduit: produit.id,
                        message: `Stock faible pour le produit ${produit.nom} : ${produit.quantite} unite(s) restante(s)`,
                    },
                });
            }
        }
        else {
            await prisma.alerte.updateMany({
                where: { idProduit: produit.id, traitee: false },
                data: { traitee: true },
            });
        }
    }
}
//# sourceMappingURL=sync-alerts.js.map