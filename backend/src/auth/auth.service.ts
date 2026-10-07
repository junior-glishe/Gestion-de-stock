import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { espaceDeRole, nomComplet, roleVersFront } from '../common/format';
import { verifyPassword } from '../common/password';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { creerSession, supprimerSession } from './session';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async login(body: Record<string, string>) {
    const email = body.email?.trim() ?? '';
    const motDePasse = body.motDePasse ?? '';
    const espace = body.espace ?? '';
    if (!email || !motDePasse) throw new BadRequestException('E-mail et mot de passe requis');

    const user = await this.prisma.utilisateur.findUnique({ where: { email } });
    if (!user || !verifyPassword(motDePasse, user.motDePasse)) {
      throw new UnauthorizedException('E-mail ou mot de passe incorrect');
    }
    if (!user.statut) throw new ForbiddenException('Ce compte est désactivé');
    if (espace && espaceDeRole(user.role) !== espace) {
      throw new ForbiddenException("Ce compte n'a pas accès à cet espace");
    }

    const { token } = creerSession(user.id);
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
        nom: nomComplet(user),
        email: user.email,
        role: roleVersFront(user.role),
        espace: espaceDeRole(user.role),
      },
    };
  }

  async logout(token: string, user?: { id: number; email: string }) {
    supprimerSession(token);
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
}
