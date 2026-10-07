import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Utilisateur } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { InventaireBody, MouvementBody, OperationsService } from './operations.service';

type RequestAvecUtilisateur = { user: Utilisateur };

@Controller()
@UseGuards(AuthGuard)
export class OperationsController {
  constructor(private readonly operations: OperationsService) {}

  /* Mouvements */
  @Get('mouvements') movements() {
    return this.operations.movements();
  }

  @Post('mouvements') recordMovement(@Body() body: MouvementBody, @Req() request: RequestAvecUtilisateur) {
    return this.operations.recordMovement(body, request.user);
  }

  /* Alertes */
  @Get('alertes') alerts() {
    return this.operations.alerts();
  }

  @Post('alertes/:id/traiter') treatAlert(@Param('id', ParseIntPipe) id: number) {
    return this.operations.treatAlert(id);
  }

  /* Inventaires */
  @Get('inventaires') inventories() {
    return this.operations.inventories();
  }

  @Post('inventaires') createInventory(@Body() body: InventaireBody, @Req() request: RequestAvecUtilisateur) {
    return this.operations.createInventory(body, request.user);
  }
}
