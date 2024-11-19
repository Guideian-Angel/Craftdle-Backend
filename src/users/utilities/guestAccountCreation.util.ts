import { PrismaService } from '../../prisma/prisma.service';
import { IUser } from '../interfaces/UserData.interface';
import { createToken } from '../../shared/utilities/tokenCreation.util';
import tokenEncryption from '../../shared/utilities/encryptingAndDecodingToken.util'

export async function createGuestAccount(prisma: PrismaService): Promise<IUser> {
    try {
        const guestAccount = await prisma.users.create({
            data: { is_guest: true }
        });
        
        return {
            id: guestAccount.id,
            loginToken: tokenEncryption.encryptUuid(await createToken(prisma)),
            username: "Guest" + guestAccount.id,
            profilePicture: {
                id: 0,
                name: "Unemployed Villager",
                src: "unemployed_villager.png"
            },
            profileBoarder: {
                id: 0,
                name: "Grass Block",
                src: "grass_block.png"
            },
            stayLoggedIn: false
        }
    } catch (error) {
        console.error("Error creating guest account:", error);
        throw new Error("Failed to create guest account.");
    }
}