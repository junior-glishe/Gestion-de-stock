import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashPassword } from '../common/password';
import { nomComplet, roleVersBase, roleVersFront } from '../common/format';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';

const PROFILS = ['Gestionnaire', 'Superviseur', 'Administrateur'];

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async users() {
    const rows = await this.prisma.utilisateur.findMany({ orderBy: [{ nom: 'asc' }, { prenom: 'asc' }] });
    return rows.map((user) => ({
      nom: nomComplet(user),
      email: user.email,
      role: roleVersFront(user.role),
      actif: user.statut,
    }));
  }

  async createUser(body: Record<string, string>) {
    const nomCompletForm = body.nom?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const profil = body.role ?? 'Gestionnaire';
    const motDePasse = body.motDePasse ?? '';

    if (!nomCompletForm) throw new BadRequestException('Le nom est requis');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException("Cette adresse e-mail n'est pas valide");
    if (!PROFILS.includes(profil)) throw new BadRequestException('Profil inconnu');
    if (!motDePasse) throw new BadRequestException('Le mot de passe est requis');

    const existe = await this.prisma.utilisateur.findUnique({ where: { email } });
    if (existe) throw new ConflictException('Cette adresse e-mail est déjà utilisée');

    const parties = nomCompletForm.split(/\s+/);
    const nom = parties.length > 1 ? parties[parties.length - 1] : parties[0];
    const prenom = parties.length > 1 ? parties.slice(0, -1).join(' ') : parties[0];

    const cree = await this.prisma.utilisateur.create({
      data: { nom, prenom, email, role: roleVersBase(profil), motDePasse: hashPassword(motDePasse) },
    });
    await this.audit.enregistrer({
      action: 'CREATION',
      module: 'Acces',
      typeObjet: 'Utilisateur',
      idObjet: cree.id,
      description: `Compte ${email} (${profil}) créé`,
    });
    return { nom: nomCompletForm, email, role: profil, actif: true };
  }

  async toggleUser(email: string, actif?: boolean) {
    const user = await this.ensureUser(email);
    const nouvelEtat = actif ?? !user.statut;
    await this.prisma.utilisateur.update({ where: { email }, data: { statut: nouvelEtat } });
    await this.audit.enregistrer({
      action: nouvelEtat ? 'ACTIVATION' : 'DESACTIVATION',
      module: 'Acces',
      typeObjet: 'Utilisateur',
      idObjet: user.id,
      description: `Compte ${email} ${nouvelEtat ? 'activé' : 'désactivé'}`,
    });
    return { email, actif: nouvelEtat };
  }

  async deleteUser(email: string) {
    const user = await this.ensureUser(email);
    try {
      await this.prisma.utilisateur.delete({ where: { id: user.id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2003' || error.code === 'P2014')) {
        throw new BadRequestException('Cette opération ne peut pas être effectuée');
      }
      throw error;
    }
    await this.audit.enregistrer({
      action: 'SUPPRESSION',
      module: 'Acces',
      typeObjet: 'Utilisateur',
      idObjet: user.id,
      description: `Compte ${email} supprimé`,
    });
    return { ok: true };
  }

  private async ensureUser(email: string) {
    const user = await this.prisma.utilisateur.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Compte introuvable');
    return user;
  }
}
