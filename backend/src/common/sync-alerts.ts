import { PrismaClient } from '@prisma/client';

/* Ouvre ou clôt les alertes de stock bas en fonction des quantités.
   Les entrées de stock ouvrent déjà une alerte via le trigger SQL,
   cette fonction synchronise les alertes après une modification de produit
   ou une correction d'inventaire. */

export async function syncAlerts(prisma: PrismaClient): Promise<void> {
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
    } else {
      await prisma.alerte.updateMany({
        where: { idProduit: produit.id, traitee: false },
        data: { traitee: true },
      });
    }
  }
}
