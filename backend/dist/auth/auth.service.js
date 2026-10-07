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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const format_1 = require("../common/format");
const password_1 = require("../common/password");
const audit_service_1 = require("../audit/audit.service");
const prisma_service_1 = require("../prisma/prisma.service");
const session_1 = require("./session");
let AuthService = class AuthService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async login(body) {
        const email = body.email?.trim() ?? '';
        const motDePasse = body.motDePasse ?? '';
        const espace = body.espace ?? '';
        if (!email || !motDePasse)
            throw new common_1.BadRequestException('E-mail et mot de passe requis');
        const user = await this.prisma.utilisateur.findUnique({ where: { email } });
        if (!user || !(0, password_1.verifyPassword)(motDePasse, user.motDePasse)) {
            throw new common_1.UnauthorizedException('E-mail ou mot de passe incorrect');
        }
        if (!user.statut)
            throw new common_1.ForbiddenException('Ce compte est désactivé');
        if (espace && (0, format_1.espaceDeRole)(user.role) !== espace) {
            throw new common_1.ForbiddenException("Ce compte n'a pas accès à cet espace");
        }
        const { token } = (0, session_1.creerSession)(user.id);
        await this.audit.enregistrer({
            action: 'CONNEXION',
            module: 'Authentification',
            typeObjet: 'Utilisateur',
            idObjet: user.id,
            description: `Connexion de ${user.email}`,
        });
        return {
            token,
            user: {
                nom: (0, format_1.nomComplet)(user),
                email: user.email,
                role: (0, format_1.roleVersFront)(user.role),
                espace: (0, format_1.espaceDeRole)(user.role),
            },
        };
    }
    async logout(token, user) {
        (0, session_1.supprimerSession)(token);
        if (user) {
            await this.audit.enregistrer({
                action: 'DECONNEXION',
                module: 'Authentification',
                typeObjet: 'Utilisateur',
                idObjet: user.id,
                description: `Déconnexion de ${user.email}`,
            });
        }
        return { ok: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map