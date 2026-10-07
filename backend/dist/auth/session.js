"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerSession = creerSession;
exports.lireSession = lireSession;
exports.supprimerSession = supprimerSession;
const DUREE = 7 * 24 * 3600 * 1000;
const sessions = new Map();
function creerSession(userId) {
    const token = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${userId.toString(36)}`;
    const expireLe = new Date(Date.now() + DUREE);
    sessions.set(token, { userId, expireLe });
    return { token, expireLe };
}
function lireSession(token) {
    const session = sessions.get(token);
    if (!session)
        return undefined;
    if (session.expireLe < new Date()) {
        sessions.delete(token);
        return undefined;
    }
    return session;
}
function supprimerSession(token) {
    sessions.delete(token);
}
//# sourceMappingURL=session.js.map