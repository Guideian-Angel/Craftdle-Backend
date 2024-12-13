import * as crypto from 'crypto';

const ENCRYPTION_KEY = crypto.randomBytes(32);

// IV generálása a UUID alapján (pl. az első 16 byte egy hash-ből)
function getIVFromUuid(uuid: string): Buffer {
    return crypto.createHash('sha256').update(uuid).digest().slice(0, 16);
}

// Titkosítás
function encryptUuid(uuid: string): string {
    const iv = getIVFromUuid(uuid);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(uuid, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Dekódolás
function decryptUuid(encryptedUuid: string, uuid: string): string {
    const iv = getIVFromUuid(uuid);
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedUuid, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


const tokenEncryption = {
    encryptUuid,
    decryptUuid
}

export default tokenEncryption;