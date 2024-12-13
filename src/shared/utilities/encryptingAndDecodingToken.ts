import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

function getIVFromUuid(uuid: string): Buffer {
    return crypto.createHash('sha256').update(uuid).digest().slice(0, 16);
}

function encryptUuid(uuid: string): string {
    const iv = getIVFromUuid(uuid);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(uuid, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decryptUuid(encryptedUuid: string, uuid: string): string {
    const iv = getIVFromUuid(uuid);
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedUuid, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export default {
    encryptUuid,
    decryptUuid,
};