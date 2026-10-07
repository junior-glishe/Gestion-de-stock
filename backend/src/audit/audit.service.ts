import { Injectable } from '@nestjs/common';
import { journalJson } from '../common/format';
import { PrismaService } from '../prisma/prisma.service';

export type EntreeAudit = {
  action: string;
  module: string;
  typeObjet: string;
  idObjet?: number | null;
  description: string;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /** JournalAudit::Enregistrer() — trace l'opération sans jamais bloquer la requête. */
  async enregistrer(entree: EntreeAudit): Promise<void> {
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
    } catch (error) {
      console.error('journal_audit :', error instanceof Error ? error.message : error);
    }
  }

  /** Journal des opérations, du plus récent au plus ancien. */
  async journal() {
    const rows = await this.prisma.journalAudit.findMany({
      orderBy: { idAudit: 'desc' },
      take: 500,
    });
    return rows.map(journalJson);
  }
}
