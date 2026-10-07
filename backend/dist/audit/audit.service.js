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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const format_1 = require("../common/format");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enregistrer(entree) {
        try {
            await this.prisma.journalAudit.create({
                data: {
                    action: entree.action.slice(0, 50),
                    module: entree.module.slice(0, 50),
                    typeObjet: entree.typeObjet.slice(0, 50),
                    idObjet: entree.idObjet ?? null,
                    description: entree.description.slice(0, 255),
                },
            });
        }
        catch (error) {
            console.error('journal_audit :', error instanceof Error ? error.message : error);
        }
    }
    async journal() {
        const rows = await this.prisma.journalAudit.findMany({
            orderBy: { idAudit: 'desc' },
            take: 500,
        });
        return rows.map(format_1.journalJson);
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map