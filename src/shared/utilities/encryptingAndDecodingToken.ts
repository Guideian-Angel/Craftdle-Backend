import * as crypto from 'crypto';

const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV = crypto.randomBytes(16); // Inicializációs vektor

// Titkosítás
function encryptUuid(uuid: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(uuid, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Dekódolás
function decryptUuid(encryptedUuid: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedUuid, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const tokenEncryption = {
    encryptUuid,
    decryptUuid
}

export default tokenEncryption;