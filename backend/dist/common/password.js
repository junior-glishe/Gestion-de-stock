"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = require("crypto");
const KEY_LENGTH = 64;
function hashPassword(plain) {
    const salt = (0, crypto_1.randomBytes)(16);
    const hash = (0, crypto_1.scryptSync)(plain, salt, KEY_LENGTH);
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
}
function verifyPassword(plain, stored) {
    const [saltHex, hashHex] = stored.split(':');
    if (!saltHex || !hashHex)
        return false;
    const hash = (0, crypto_1.scryptSync)(plain, Buffer.from(saltHex, 'hex'), KEY_LENGTH);
    return hash.toString('hex') === hashHex;
}
//# sourceMappingURL=password.js.map