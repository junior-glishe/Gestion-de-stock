import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Utilisateur } from '@prisma/client';
import { alerteJson, inventaireJson, movementJson } from '../common/format';
import { syncAlerts } from '../common/sync-alerts';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';

export type MouvementBody = {
  type?: string;
  reference?: string;
  quantite?: number;
};

export type InventaireBody = {
  entries?: { reference: string; realQuantity: string | number }[];
};

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  /* ---------- Mouvements (entrées / sorties) ---------- */

  async movements() {
    const rows = await this.prisma.mouvementStock.findMany({
      include: { produit: true },
      orderBy: { id: 'desc' },
    });
    return rows.map(movementJson);
  }

  async recordMovement(body: MouvementBody, user: Utilisateur) {
    const type = body.type === 'sortie' ? 'SORTIE' : 'ENTREE';
    const reference = body.reference ?? '';
    const quantite = Number(body.quantite);
    const produit = await this.prisma.produit.findUnique({ where: { reference } });

    if (!produit) throw new BadRequestException('Choisissez un produit');
    if (!Number.isInteger(quantite) || quantite < 1) throw new BadRequestException('Quantité invalide');
    if (type === 'SORTIE' && quantite > produit.quantite) {
      throw new BadRequestException(`Stock insuffisant (${produit.quantite} disponible(s))`);
    }

    try {
      const mouvement = await this.prisma.mouvementStock.create({
        data: { type, quantite, idProduit: produit.id, idGestionnaire: user.id },
        include: { produit: true },
      });
      await this.audit.enregistrer({
        action: type === 'ENTREE' ? 'ENTREE' : 'SORTIE',
        module: 'Mouvements',
        typeObjet: 'Mouvement',
        idObjet: mouvement.id,
        description: `${type === 'ENTREE' ? 'Entrée' : 'Sortie'} de ${quantite} unité(s) — ${produit.reference}`,
      });
      return movementJson(mouvement);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2004') {
        throw new BadRequestException('Stock insuffisant pour effectuer cette sortie');
      }
      throw error;
    }
  }

  /* ---------- Alertes ---------- */

  async alerts() {
    const rows = await this.prisma.alerte.findMany({
      include: { produit: true },
      orderBy: [{ traitee: 'asc' }, { id: 'desc' }],
    });
    return rows.map(alerteJson);
  }

  async treatAlert(id: number) {
    const alerte = await this.prisma.alerte.findUnique({ where: { id }, include: { produit: true } });
    if (!alerte) throw new NotFoundException('Alerte introuvable');
    const miseAJour = await this.prisma.alerte.update({
      where: { id },
      data: { traitee: true },
      include: { produit: true },
    });
    await this.audit.enregistrer({
      action: 'TRAITEMENT',
      module: 'Alertes',
      typeObjet: 'Alerte',
      idObjet: id,
      description: `Alerte traitée pour ${alerte.produit.reference}`,
    });
    return alerteJson(miseAJour);
  }

  /* ---------- Inventaires ---------- */

  async inventories() {
    const rows = await this.prisma.inventaire.findMany({
      include: { lignes: true },
      orderBy: { id: 'desc' },
    });
    return rows.map(inventaireJson);
  }

  async createInventory(body: InventaireBody, user: Utilisateur) {
    if (user.role !== 'SUPERVISEUR') {
      throw new ForbiddenException('Seul un superviseur peut réaliser un inventaire');
    }

    const saisis = (body.entries ?? []).filter(
      (entry) => entry.realQuantity !== '' && entry.realQuantity !== null && entry.realQuantity !== undefined,
    );
    if (saisis.length === 0) throw new BadRequestException('Saisissez au moins une quantité réelle');

    const uniques = new Map<string, string | number>();
    for (const entry of saisis) uniques.set(entry.reference, entry.realQuantity);

    const lignes: { idProduit: number; quantiteTheorique: number; quantiteReelle: number }[] = [];
    for (const [reference, realQuantity] of uniques) {
      const produit = await this.prisma.produit.findUnique({ where: { reference } });
      if (!produit) throw new NotFoundException(`Produit introuvable : ${reference}`);

      const reel = Number(realQuantity);
      if (!Number.isInteger(reel) || reel < 0) throw new BadRequestException('Quantité invalide');
      lignes.push({ idProduit: produit.id, quantiteTheorique: produit.quantite, quantiteReelle: reel });
    }

    const inventaire = await this.prisma.$transaction(async (tx) => {
      const cree = await tx.inventaire.create({ data: { idSuperviseur: user.id } });
      await tx.ligneInventaire.createMany({
        data: lignes.map((ligne) => ({ ...ligne, idInventaire: cree.id })),
      });
      for (const ligne of lignes) {
        if (ligne.quantiteReelle !== ligne.quantiteTheorique) {
          await tx.produit.update({
            where: { id: ligne.idProduit },
            data: { quantite: ligne.quantiteReelle },
          });
        }
      }
      return tx.inventaire.findUniqueOrThrow({ where: { id: cree.id }, include: { lignes: true } });
    });

    await syncAlerts(this.prisma);
    const ecarts = inventaire.lignes.filter((ligne) => ligne.quantiteReelle !== ligne.quantiteTheorique).length;
    await this.audit.enregistrer({
      action: 'CREATION',
      module: 'Inventaire',
      typeObjet: 'Inventaire',
      idObjet: inventaire.id,
      description: `Inventaire de ${inventaire.lignes.length} produit(s), ${ecarts} écart(s)`,
    });
    return inventaireJson(inventaire);
  }
}
