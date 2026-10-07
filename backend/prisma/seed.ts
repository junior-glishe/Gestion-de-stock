import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/password';

/* Le script SQL Docs/files/gestion_stock.sql fournit les comptes de test avec
   des mots de passe factices. Ce seed les remplace par un hachage scrypt
   réutilisable (mot de passe : demo1234) sans toucher aux autres données. */

const prisma = new PrismaClient();

const MDP = 'demo1234';

async function main() {
  const comptes = await prisma.utilisateur.findMany();
  if (comptes.length === 0) {
    throw new Error('Base vide : exécutez d’abord Docs/files/gestion_stock.sql');
  }

  let misAJour = 0;
  for (const compte of comptes) {
    if (!/^[0-9a-f]{32}:[0-9a-f]+$/.test(compte.motDePasse)) {
      await prisma.utilisateur.update({
        where: { id: compte.id },
        data: { motDePasse: hashPassword(MDP) },
      });
      misAJour += 1;
    }
  }

  const alertes = await prisma.alerte.count();
  const produits = await prisma.produit.count();
  console.log(
    `${comptes.length} compte(s), ${produits} produit(s), ${alertes} alerte(s) — ` +
      `${misAJour} mot de passe(s) initialisé(s) à « ${MDP} »`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
