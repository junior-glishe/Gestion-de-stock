type Session = {
  userId: number;
  expireLe: Date;
};

const DUREE = 7 * 24 * 3600 * 1000;

const sessions = new Map<string, Session>();

export function creerSession(userId: number): { token: string; expireLe: Date } {
  const token = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${userId.toString(36)}`;
  const expireLe = new Date(Date.now() + DUREE);
  sessions.set(token, { userId, expireLe });
  return { token, expireLe };
}

export function lireSession(token: string): Session | undefined {
  const session = sessions.get(token);
  if (!session) return undefined;
  if (session.expireLe < new Date()) {
    sessions.delete(token);
    return undefined;
  }
  return session;
}

export function supprimerSession(token: string): void {
  sessions.delete(token);
}
