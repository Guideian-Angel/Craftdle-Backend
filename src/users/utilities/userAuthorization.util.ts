import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

// Felhasználó keresése felhasználónév vagy email alapján.
export async function findUserByUsernameOrEmail(prisma: PrismaService, usernameOrEmail: string) {
    return await prisma.users.findFirst({
        where: {
            OR: [
                { username: usernameOrEmail },
                { email: usernameOrEmail },
            ],
        },
    });
}

// Jelszó validálása (hash összehasonlítás).
export async function validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, storedPassword);
}

const userAuthorization = {
    findUserByUsernameOrEmail,
    validatePassword
}

export default userAuthorization;