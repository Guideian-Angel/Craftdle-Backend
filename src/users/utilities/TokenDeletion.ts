import { PrismaService } from '../../prisma/prisma.service';

export async function deleteToken(prisma: PrismaService, userId: number): Promise<boolean> {
    const deletedUser = await prisma.tokens.delete({
        where: { user: userId },
    });

    return deletedUser ? true : false;
}