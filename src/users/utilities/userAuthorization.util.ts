import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

// Felhasználó keresése felhasználónév vagy email alapján.
export async function findUser(
    prisma: PrismaService, 
    criteria: { username?: string; email?: string }
) {
    return await prisma.users.findFirst({
        where: {
            OR: [
                criteria.username ? { username: criteria.username } : undefined,
                criteria.email ? { email: criteria.email } : undefined,
            ].filter(Boolean), // Eltávolítja az `undefined` értékeket
        },
    });
}


// Jelszó validálása (hash összehasonlítás).
export async function validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, storedPassword);
}

const userAuthorization = {
    findUser,
    validatePassword
}

export default userAuthorization;