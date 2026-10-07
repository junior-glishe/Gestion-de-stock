import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Utilisateur } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CatalogService } from './catalog.service';

type RequestAvecUtilisateur = { user: Utilisateur };

@Controller()
@UseGuards(AuthGuard)
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  /* Catégories */
  @Get('categories') categories() {
    return this.catalog.categories();
  }

  @Post('categories') addCategory(@Body() body: Record<string, string>, @Req() request: RequestAvecUtilisateur) {
    return this.catalog.addCategory(body, request.user);
  }

  @Delete('categories/:nom') deleteCategory(@Param('nom') nom: string) {
    return this.catalog.deleteCategory(nom);
  }

  /* Fournisseurs */
  @Get('fournisseurs') fournisseurs() {
    return this.catalog.fournisseurs();
  }

  @Post('fournisseurs') addSupplier(@Body() body: Record<string, string>, @Req() request: RequestAvecUtilisateur) {
    return this.catalog.addSupplier(body, request.user);
  }

  @Put('fournisseurs/:id') updateSupplier(@Param('id') id: string, @Body() body: Record<string, string>) {
    return this.catalog.updateSupplier(id, body);
  }

  @Delete('fournisseurs/:id') deleteSupplier(@Param('id') id: string) {
    return this.catalog.deleteSupplier(id);
  }

  /* Produits */
  @Get('produits') produits() {
    return this.catalog.produits();
  }

  @Post('produits') addProduct(@Body() body: Record<string, unknown>, @Req() request: RequestAvecUtilisateur) {
    return this.catalog.addProduct(body, request.user);
  }

  @Put('produits/:reference') updateProduct(
    @Param('reference') reference: string,
    @Body() body: Record<string, unknown>,
    @Req() request: RequestAvecUtilisateur,
  ) {
    return this.catalog.updateProduct(reference, body, request.user);
  }

  @Delete('produits/:reference') deleteProduct(@Param('reference') reference: string) {
    return this.catalog.deleteProduct(reference);
  }
}
