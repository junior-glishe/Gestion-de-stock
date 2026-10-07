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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const password_1 = require("../common/password");
const format_1 = require("../common/format");
const audit_service_1 = require("../audit/audit.service");
const prisma_service_1 = require("../prisma/prisma.service");
const PROFILS = ['Gestionnaire', 'Superviseur', 'Administrateur'];
let UsersService = class UsersService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async users() {
        const rows = await this.prisma.utilisateur.findMany({ orderBy: [{ nom: 'asc' }, { prenom: 'asc' }] });
        return rows.map((user) => ({
            nom: (0, format_1.nomComplet)(user),
            email: user.email,
            role: (0, format_1.roleVersFront)(user.role),
            actif: user.statut,
        }));
    }
    async createUser(body) {
        const nomCompletForm = body.nom?.trim() ?? '';
        const email = body.email?.trim() ?? '';
        const profil = body.role ?? 'Gestionnaire';
        const motDePasse = body.motDePasse ?? '';
        if (!nomCompletForm)
            throw new common_1.BadRequestException('Le nom est requis');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            throw new common_1.BadRequestException("Cette adresse e-mail n'est pas valide");
        if (!PROFILS.includes(profil))
            throw new common_1.BadRequestException('Profil inconnu');
        if (!motDePasse)
            throw new common_1.BadRequestException('Le mot de passe est requis');
        const existe = await this.prisma.utilisateur.findUnique({ where: { email } });
        if (existe)
            throw new common_1.ConflictException('Cette adresse e-mail est déjà utilisée');
        const parties = nomCompletForm.split(/\s+/);
        const nom = parties.length > 1 ? parties[parties.length - 1] : parties[0];
        const prenom = parties.length > 1 ? parties.slice(0, -1).join(' ') : parties[0];
        const cree = await this.prisma.utilisateur.create({
            data: { nom, prenom, email, role: (0, format_1.roleVersBase)(profil), motDePasse: (0, password_1.hashPassword)(motDePasse) },
        });
        await this.audit.enregistrer({
            action: 'CREATION',
            module: 'Acces',
            typeObjet: 'Utilisateur',
            idObjet: cree.id,
            description: `Compte ${email} (${profil}) créé`,
        });
        return { nom: nomCompletForm, email, role: profil, actif: true };
    }
    async toggleUser(email, actif) {
        const user = await this.ensureUser(email);
        const nouvelEtat = actif ?? !user.statut;
        await this.prisma.utilisateur.update({ where: { email }, data: { statut: nouvelEtat } });
        await this.audit.enregistrer({
            action: nouvelEtat ? 'ACTIVATION' : 'DESACTIVATION',
            module: 'Acces',
            typeObjet: 'Utilisateur',
            idObjet: user.id,
            description: `Compte ${email} ${nouvelEtat ? 'activé' : 'désactivé'}`,
        });
        return { email, actif: nouvelEtat };
    }
    async deleteUser(email) {
        const user = await this.ensureUser(email);
        try {
            await this.prisma.utilisateur.delete({ where: { id: user.id } });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && (error.code === 'P2003' || error.code === 'P2014')) {
                throw new common_1.BadRequestException('Cette opération ne peut pas être effectuée');
            }
            throw error;
        }
        await this.audit.enregistrer({
            action: 'SUPPRESSION',
            module: 'Acces',
            typeObjet: 'Utilisateur',
            idObjet: user.id,
            description: `Compte ${email} supprimé`,
        });
        return { ok: true };
    }
    async ensureUser(email) {
        const user = await this.prisma.utilisateur.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Compte introuvable');
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map