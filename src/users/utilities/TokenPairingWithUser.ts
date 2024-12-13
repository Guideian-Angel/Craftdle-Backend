import { PrismaService } from '../../prisma/prisma.service';
import tokenEncryption from '../../shared/utilities/encryptingAndDecodingToken';

/**
 * Token párosítása a megadott felhasználóhoz az adatbázisban.
 * Biztosítja, hogy egy felhasználónak csak egy tokenje lehet.
 * @param prisma - A Prisma szolgáltatás példánya.
 * @param userId - A felhasználó azonosítója, akihez a tokent párosítani kell.
 * @param token - A generált belépési token.
 * @param isExpire - Megadja, hogy a token átmeneti vagy állandó.
 */
export async function pairTokenWithUser(
    prisma: PrismaService,
    userId: number,
    token: string,
    isExpire: boolean
): Promise<void> {
    try {
        // Ellenőrizzük, hogy van-e már meglévő token a felhasználónál, és ha van töröljük is
        await prisma.tokens.delete({
            where: { user: userId },
        });

        // Új token párosítása a felhasználóhoz
        await prisma.tokens.create({
            data: {
                user: userId,
                login_token: tokenEncryption.encryptUuid(token),
                is_expire: isExpire,
            },
        });
    } catch (error) {
        console.error("Failed to pair token with user:", error);
        throw new Error("Database error: Failed to pair the token.");
    }
}