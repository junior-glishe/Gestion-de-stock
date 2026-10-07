"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const format_1 = require("../common/format");
const sync_alerts_1 = require("../common/sync-alerts");
const audit_service_1 = require("../audit/audit.service");
const prisma_service_1 = require("../prisma/prisma.service");
let OperationsService = class OperationsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async movements() {
        const rows = await this.prisma.mouvementStock.findMany({
            include: { produit: true },
            orderBy: { id: 'desc' },
        });
        return rows.map(format_1.movementJson);
    }
    async recordMovement(body, user) {
        const type = body.type === 'sortie' ? 'SORTIE' : 'ENTREE';
        const reference = body.reference ?? '';
        const quantite = Number(body.quantite);
        const produit = await this.prisma.produit.findUnique({ where: { reference } });
        if (!produit)
            throw new common_1.BadRequestException('Choisissez un produit');
        if (!Number.isInteger(quantite) || quantite < 1)
            throw new common_1.BadRequestException('Quantité invalide');
        if (type === 'SORTIE' && quantite > produit.quantite) {
            throw new common_1.BadRequestException(`Stock insuffisant (${produit.quantite} disponible(s))`);
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
            return (0, format_1.movementJson)(mouvement);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2004') {
                throw new common_1.BadRequestException('Stock insuffisant pour effectuer cette sortie');
            }
            throw error;
        }
    }
    async alerts() {
        const rows = await this.prisma.alerte.findMany({
            include: { produit: true },
            orderBy: [{ traitee: 'asc' }, { id: 'desc' }],
        });
        return rows.map(format_1.alerteJson);
    }
    async treatAlert(id) {
        const alerte = await this.prisma.alerte.findUnique({ where: { id }, include: { produit: true } });
        if (!alerte)
            throw new common_1.NotFoundException('Alerte introuvable');
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
        return (0, format_1.alerteJson)(miseAJour);
    }
    async inventories() {
        const rows = await this.prisma.inventaire.findMany({
            include: { lignes: true },
            orderBy: { id: 'desc' },
        });
        return rows.map(format_1.inventaireJson);
    }
    async createInventory(body, user) {
        if (user.role !== 'SUPERVISEUR') {
            throw new common_1.ForbiddenException('Seul un superviseur peut réaliser un inventaire');
        }
        const saisis = (body.entries ?? []).filter((entry) => entry.realQuantity !== '' && entry.realQuantity !== null && entry.realQuantity !== undefined);
        if (saisis.length === 0)
            throw new common_1.BadRequestException('Saisissez au moins une quantité réelle');
        const uniques = new Map();
        for (const entry of saisis)
            uniques.set(entry.reference, entry.realQuantity);
        const lignes = [];
        for (const [reference, realQuantity] of uniques) {
            const produit = await this.prisma.produit.findUnique({ where: { reference } });
            if (!produit)
                throw new common_1.NotFoundException(`Produit introuvable : ${reference}`);
            const reel = Number(realQuantity);
            if (!Number.isInteger(reel) || reel < 0)
                throw new common_1.BadRequestException('Quantité invalide');
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
        await (0, sync_alerts_1.syncAlerts)(this.prisma);
        const ecarts = inventaire.lignes.filter((ligne) => ligne.quantiteReelle !== ligne.quantiteTheorique).length;
        await this.audit.enregistrer({
            action: 'CREATION',
            module: 'Inventaire',
            typeObjet: 'Inventaire',
            idObjet: inventaire.id,
            description: `Inventaire de ${inventaire.lignes.length} produit(s), ${ecarts} écart(s)`,
        });
        return (0, format_1.inventaireJson)(inventaire);
    }
};
exports.OperationsService = OperationsService;
exports.OperationsService = OperationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], OperationsService);
//# sourceMappingURL=operations.service.js.map