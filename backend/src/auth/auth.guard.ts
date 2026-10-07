import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Utilisateur } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { lireSession } from './session';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header: string = request.headers['authorization'] ?? '';
    const token = header.replace(/^Bearer\s+/i, '').trim();
    if (!token) throw new UnauthorizedException('Authentification requise');

    const session = lireSession(token);
    if (!session) throw new UnauthorizedException('Session expirée ou jeton invalide');

    const user: Utilisateur | null = await this.prisma.utilisateur.findUnique({
      where: { id: session.userId },
    });
    if (!user) throw new UnauthorizedException('Session expirée ou jeton invalide');
    if (!user.statut) throw new ForbiddenException('Ce compte est désactivé');

    request.user = user;
    return true;
  }
}
