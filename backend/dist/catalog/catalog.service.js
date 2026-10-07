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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const sync_alerts_1 = require("../common/sync-alerts");
const format_1 = require("../common/format");
const audit_service_1 = require("../audit/audit.service");
let CatalogService = class CatalogService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async categories() {
        const rows = await this.prisma.categorie.findMany({ orderBy: { nom: 'asc' } });
        return rows.map((row) => row.nom);
    }
    async addCategory(body, user) {
        const nom = body.nom?.trim() ?? '';
        if (!nom)
            throw new common_1.BadRequestException('Le nom de la catégorie est requis');
        const existe = await this.prisma.categorie.findFirst({ where: { nom } });
        if (existe)
            throw new common_1.ConflictException('Catégorie déjà existante');
        const creee = await this.prisma.categorie.create({ data: { nom, idGestionnaire: user.id } });
        await this.audit.enregistrer({
            action: 'CREATION',
            module: 'Catalogue',
            typeObjet: 'Categorie',
            idObjet: creee.id,
            description: `Catégorie « ${nom} » créée`,
        });
        return nom;
    }
    async deleteCategory(nom) {
        const categorie = await this.prisma.categorie.findUnique({ where: { nom } });
        if (!categorie)
            throw new common_1.NotFoundException('Catégorie introuvable');
        const nbProduits = await this.prisma.produit.count({ where: { idCategorie: categorie.id } });
        if (nbProduits > 0)
            throw new common_1.ConflictException(`${nbProduits} produit(s) utilisent « ${nom} »`);
        await this.prisma.categorie.delete({ where: { id: categorie.id } });
        await this.audit.enregistrer({
            action: 'SUPPRESSION',
            module: 'Catalogue',
            typeObjet: 'Categorie',
            idObjet: categorie.id,
            description: `Catégorie « ${nom} » supprimée`,
        });
        return { ok: true };
    }
    fournisseurs() {
        return this.prisma.fournisseur.findMany({ orderBy: { raisonSociale: 'asc' } }).then((rows) => rows.map((fournisseur) => ({
            id: fournisseur.codeFournisseur,
            nom: fournisseur.raisonSociale,
            contact: fournisseur.personneContact ?? '',
            tel: fournisseur.telephone ?? '',
            mail: fournisseur.email ?? '',
            ville: fournisseur.ville ?? '',
        })));
    }
    async fournisseurData(body, codeCourant = '') {
        const nom = body.nom?.trim() ?? '';
        if (!nom)
            throw new common_1.BadRequestException('La raison sociale est requise');
        const existe = await this.prisma.fournisseur.findFirst({
            where: { raisonSociale: nom, NOT: { codeFournisseur: codeCourant } },
        });
        if (existe)
            throw new common_1.ConflictException('Ce fournisseur existe déjà');
        return {
            raisonSociale: nom,
            personneContact: body.contact?.trim() || null,
            telephone: body.tel?.trim() || null,
            email: body.mail?.trim() || null,
            ville: body.ville?.trim() || null,
        };
    }
    async prochainCodeFournisseur() {
        const codes = await this.prisma.fournisseur.findMany({ select: { codeFournisseur: true } });
        let prefixe = 'FOUR-';
        let max = 0;
        for (const { codeFournisseur } of codes) {
            const match = codeFournisseur.match(/^(.*?)(\d+)$/);
            if (match && Number(match[2]) >= max) {
                max = Number(match[2]);
                prefixe = match[1];
            }
        }
        return `${prefixe}${String(max + 1).padStart(3, '0')}`;
    }
    async addSupplier(body, user) {
        const data = await this.fournisseurData(body);
        const codeFournisseur = await this.prochainCodeFournisseur();
        const cree = await this.prisma.fournisseur.create({
            data: { codeFournisseur, ...data, idGestionnaire: user.id },
        });
        await this.audit.enregistrer({
            action: 'CREATION',
            module: 'Catalogue',
            typeObjet: 'Fournisseur',
            idObjet: cree.id,
            description: `Fournisseur « ${cree.raisonSociale} » (${codeFournisseur}) créé`,
        });
        return cree;
    }
    async updateSupplier(codeFournisseur, body) {
        const fournisseur = await this.prisma.fournisseur.findUnique({ where: { codeFournisseur } });
        if (!fournisseur)
            throw new common_1.NotFoundException('Fournisseur introuvable');
        const data = await this.fournisseurData(body, codeFournisseur);
        const modifie = await this.prisma.fournisseur.update({ where: { codeFournisseur }, data });
        await this.audit.enregistrer({
            action: 'MODIFICATION',
            module: 'Catalogue',
            typeObjet: 'Fournisseur',
            idObjet: modifie.id,
            description: `Fournisseur « ${modifie.raisonSociale} » (${codeFournisseur}) modifié`,
        });
        return modifie;
    }
    async deleteSupplier(codeFournisseur) {
        const fournisseur = await this.prisma.fournisseur.findUnique({ where: { codeFournisseur } });
        if (!fournisseur)
            throw new common_1.NotFoundException('Fournisseur introuvable');
        await this.prisma.fournisseur.delete({ where: { codeFournisseur } });
        await this.audit.enregistrer({
            action: 'SUPPRESSION',
            module: 'Catalogue',
            typeObjet: 'Fournisseur',
            idObjet: fournisseur.id,
            description: `Fournisseur « ${fournisseur.raisonSociale} » (${codeFournisseur}) supprimé`,
        });
        return { ok: true };
    }
    produits() {
        return this.prisma.produit
            .findMany({ include: { categorie: true }, orderBy: { nom: 'asc' } })
            .then((rows) => rows.map(format_1.produitJson));
    }
    async produitData(body, referenceCourante = '') {
        const reference = String(body.reference ?? '').trim().toUpperCase();
        const nom = String(body.nom ?? '').trim();
        if (!reference)
            throw new common_1.BadRequestException('La référence est requise');
        if (!nom)
            throw new common_1.BadRequestException('Le nom du produit est requis');
        const existe = await this.prisma.produit.findFirst({
            where: { reference, NOT: { reference: referenceCourante } },
        });
        if (existe)
            throw new common_1.ConflictException('Cette référence existe déjà');
        const nomCategorie = String(body.categorie ?? '').trim();
        const categorie = await this.prisma.categorie.findUnique({ where: { nom: nomCategorie } });
        if (!categorie)
            throw new common_1.BadRequestException('Catégorie introuvable');
        const quantite = Number(body.quantite ?? 0);
        const seuil = Number(body.seuil ?? 0);
        const prix = Number(body.prix ?? 0);
        if (!Number.isInteger(quantite) || quantite < 0)
            throw new common_1.BadRequestException('La quantité doit être un entier positif');
        if (!Number.isInteger(seuil) || seuil < 0)
            throw new common_1.BadRequestException('Le seuil doit être un entier positif');
        if (!Number.isFinite(prix) || prix < 0)
            throw new common_1.BadRequestException('Le prix doit être positif');
        return {
            reference,
            nom,
            description: String(body.description ?? '').trim() || null,
            quantite,
            seuil,
            prix,
            idCategorie: categorie.id,
        };
    }
    async addProduct(body, user) {
        const data = await this.produitData(body);
        const { quantite, ...champs } = data;
        const produit = await this.prisma.$transaction(async (tx) => {
            const cree = await tx.produit.create({
                data: { ...champs, quantite: 0, idGestionnaire: user.id },
            });
            if (quantite > 0) {
                await tx.mouvementStock.create({
                    data: { type: 'ENTREE', quantite, idProduit: cree.id, idGestionnaire: user.id },
                });
            }
            return tx.produit.findUniqueOrThrow({ where: { id: cree.id }, include: { categorie: true } });
        });
        await (0, sync_alerts_1.syncAlerts)(this.prisma);
        await this.audit.enregistrer({
            action: 'CREATION',
            module: 'Catalogue',
            typeObjet: 'Produit',
            idObjet: produit.id,
            description: `Produit ${produit.reference} (${produit.nom}) créé`,
        });
        return (0, format_1.produitJson)(produit);
    }
    async updateProduct(reference, body, user) {
        const produit = await this.prisma.produit.findUnique({ where: { reference } });
        if (!produit)
            throw new common_1.NotFoundException('Produit introuvable');
        const data = await this.produitData(body, reference);
        const { quantite, description, ...champs } = data;
        const delta = quantite - produit.quantite;
        const misAJour = await this.prisma.$transaction(async (tx) => {
            await tx.produit.update({
                where: { id: produit.id },
                data: { ...champs, ...(body.description === undefined ? {} : { description }) },
            });
            if (delta > 0) {
                await tx.mouvementStock.create({
                    data: { type: 'ENTREE', quantite: delta, idProduit: produit.id, idGestionnaire: user.id },
                });
            }
            else if (delta < 0) {
                await tx.mouvementStock.create({
                    data: { type: 'SORTIE', quantite: -delta, idProduit: produit.id, idGestionnaire: user.id },
                });
            }
            return tx.produit.findUniqueOrThrow({ where: { id: produit.id }, include: { categorie: true } });
        });
        await (0, sync_alerts_1.syncAlerts)(this.prisma);
        await this.audit.enregistrer({
            action: 'MODIFICATION',
            module: 'Catalogue',
            typeObjet: 'Produit',
            idObjet: misAJour.id,
            description: `Produit ${misAJour.reference} (${misAJour.nom}) modifié`,
        });
        return (0, format_1.produitJson)(misAJour);
    }
    async deleteProduct(reference) {
        const produit = await this.prisma.produit.findUnique({ where: { reference } });
        if (!produit)
            throw new common_1.NotFoundException('Produit introuvable');
        try {
            await this.prisma.produit.delete({ where: { id: produit.id } });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && (error.code === 'P2003' || error.code === 'P2014')) {
                throw new common_1.BadRequestException('Cette opération ne peut pas être effectuée');
            }
            throw error;
        }
        await (0, sync_alerts_1.syncAlerts)(this.prisma);
        await this.audit.enregistrer({
            action: 'SUPPRESSION',
            module: 'Catalogue',
            typeObjet: 'Produit',
            idObjet: produit.id,
            description: `Produit ${produit.reference} (${produit.nom}) supprimé`,
        });
        return { ok: true };
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map