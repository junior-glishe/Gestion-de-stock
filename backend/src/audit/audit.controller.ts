import { Controller, ForbiddenException, Get, Req, UseGuards } from '@nestjs/common';
import { Utilisateur } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { AuditService } from './audit.service';

type RequestAvecUtilisateur = { user: Utilisateur };

@Controller('journal-audit')
@UseGuards(AuthGuard)
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(@Req() request: RequestAvecUtilisateur) {
    if (request.user.role !== 'SUPERVISEUR') {
      throw new ForbiddenException('Seul un superviseur peut consulter le journal d’audit');
    }
    return this.audit.journal();
  }
}
