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
exports.OperationsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const operations_service_1 = require("./operations.service");
let OperationsController = class OperationsController {
    operations;
    constructor(operations) {
        this.operations = operations;
    }
    movements() {
        return this.operations.movements();
    }
    recordMovement(body, request) {
        return this.operations.recordMovement(body, request.user);
    }
    alerts() {
        return this.operations.alerts();
    }
    treatAlert(id) {
        return this.operations.treatAlert(id);
    }
    inventories() {
        return this.operations.inventories();
    }
    createInventory(body, request) {
        return this.operations.createInventory(body, request.user);
    }
};
exports.OperationsController = OperationsController;
__decorate([
    (0, common_1.Get)('mouvements'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "movements", null);
__decorate([
    (0, common_1.Post)('mouvements'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "recordMovement", null);
__decorate([
    (0, common_1.Get)('alertes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "alerts", null);
__decorate([
    (0, common_1.Post)('alertes/:id/traiter'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "treatAlert", null);
__decorate([
    (0, common_1.Get)('inventaires'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "inventories", null);
__decorate([
    (0, common_1.Post)('inventaires'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "createInventory", null);
exports.OperationsController = OperationsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [operations_service_1.OperationsService])
], OperationsController);
//# sourceMappingURL=operations.controller.js.map