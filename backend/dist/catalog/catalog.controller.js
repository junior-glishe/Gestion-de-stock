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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const catalog_service_1 = require("./catalog.service");
let CatalogController = class CatalogController {
    catalog;
    constructor(catalog) {
        this.catalog = catalog;
    }
    categories() {
        return this.catalog.categories();
    }
    addCategory(body, request) {
        return this.catalog.addCategory(body, request.user);
    }
    deleteCategory(nom) {
        return this.catalog.deleteCategory(nom);
    }
    fournisseurs() {
        return this.catalog.fournisseurs();
    }
    addSupplier(body, request) {
        return this.catalog.addSupplier(body, request.user);
    }
    updateSupplier(id, body) {
        return this.catalog.updateSupplier(id, body);
    }
    deleteSupplier(id) {
        return this.catalog.deleteSupplier(id);
    }
    produits() {
        return this.catalog.produits();
    }
    addProduct(body, request) {
        return this.catalog.addProduct(body, request.user);
    }
    updateProduct(reference, body, request) {
        return this.catalog.updateProduct(reference, body, request.user);
    }
    deleteProduct(reference) {
        return this.catalog.deleteProduct(reference);
    }
};
exports.CatalogController = CatalogController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "categories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:nom'),
    __param(0, (0, common_1.Param)('nom')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('fournisseurs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "fournisseurs", null);
__decorate([
    (0, common_1.Post)('fournisseurs'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "addSupplier", null);
__decorate([
    (0, common_1.Put)('fournisseurs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "updateSupplier", null);
__decorate([
    (0, common_1.Delete)('fournisseurs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "deleteSupplier", null);
__decorate([
    (0, common_1.Get)('produits'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "produits", null);
__decorate([
    (0, common_1.Post)('produits'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Put)('produits/:reference'),
    __param(0, (0, common_1.Param)('reference')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('produits/:reference'),
    __param(0, (0, common_1.Param)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "deleteProduct", null);
exports.CatalogController = CatalogController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [catalog_service_1.CatalogService])
], CatalogController);
//# sourceMappingURL=catalog.controller.js.map