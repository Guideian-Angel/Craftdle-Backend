import { PrismaService } from '../../prisma/prisma.service';
import { IUser } from '../interfaces/IUserData';
import { createToken } from '../../shared/utilities/tokenCreation';
import * as bcrypt from 'bcrypt';

export async function createAccount(
    prisma: PrismaService,
    accountData?: { username?: string; email?: string; password?: string; stayLoggedIn?: boolean }
): Promise<IUser> {
    try {
        // Döntés: vendég vagy normál felhasználó
        const isGuest = !accountData || !accountData.username || !accountData.email || !accountData.password;

        let userData;

        if (isGuest) {
            // Vendég felhasználó adatai
            userData = { is_guest: true };
        } else {
            // Normál felhasználó adatai
            const hashedPassword = await bcrypt.hash(accountData.password, 2); // Jelszó hashelése
            userData = {
                username: accountData.username,
                email: accountData.email,
                password: hashedPassword,
                is_guest: false,
            };
        }

        // Felhasználó létrehozása
        const createdUser = await prisma.users.create({
            data: userData
        });

        // Törzsadatok generálása
        return {
            id: createdUser.id,
            loginToken: await createToken(prisma),
            username: isGuest ? `Guest${createdUser.id}` : createdUser.username,
            profilePicture: {
                id: 0,
                name: "Unemployed Villager",
                src: "unemployed_villager.png"
            },
            profileBorder: {
                id: 0,
                name: "Grass Block",
                src: "grass_block.png"
            },
            stayLoggedIn: isGuest ? false : !!accountData?.stayLoggedIn,
        };
    } catch (error) {
        console.error("Error creating account:", error);
        throw new Error("Failed to create account.");
    }
}