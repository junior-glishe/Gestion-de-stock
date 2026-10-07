import { randomBytes, scryptSync } from 'crypto';

/* Hachage des mots de passe avec scrypt (fonctionnalité native de Node.js). */

const KEY_LENGTH = 64;

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, KEY_LENGTH);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const hash = scryptSync(plain, Buffer.from(saltHex, 'hex'), KEY_LENGTH);
  return hash.toString('hex') === hashHex;
}
