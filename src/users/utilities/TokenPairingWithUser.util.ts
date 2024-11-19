import { PrismaService } from '../../prisma/prisma.service';

export async function pairTokenWithUser(
    prisma: PrismaService,
    userId: number,
    token: string,
    isExpire: boolean
): Promise<void> {
    // Ellenőrzi, van-e már token ehhez a felhasználóhoz
    const existingToken = await prisma.tokens.findFirst({
        where: { user: userId }
    });

    if (existingToken) {
        throw new Error("User already has a token!");
    }

    // Ha nincs meglévő token, párosítsuk
    try {
        await prisma.tokens.create({
            data: {
                user: userId,
                login_token: token,
                is_expire: isExpire,
            },
        });
    } catch (error) {
        console.error("Failed to pair token with user:", error);
        throw new Error("Database error: Unable to pair token with user.");
    }
}