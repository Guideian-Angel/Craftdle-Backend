import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './classes/user'
import { IUser } from './interfaces/UserData.interface'
import { createGuestAccount } from './utilities/guestAccountCreation.util'
import { pairTokenWithUser } from './utilities/TokenPairingWithUser.util'
import { IUserData } from './interfaces/UserData.interface';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    users: User[] = [];

    async createGuestAccount(): Promise<IUserData>{
        const newGuest = await createGuestAccount(this.prisma);
        this.createNewUser(newGuest, true);
        const { id, ...userData } = newGuest; // A destruktúrálással eltávolítjuk az `id`-t
        return userData as IUserData; // Az `id` nélküli objektum visszatérése
    }

    async createNewUser(newUser: IUser, isExpire: boolean) {
        try {
            await pairTokenWithUser(this.prisma, newUser.id, newUser.loginToken, isExpire);
            // További logika, pl. User objektum létrehozása
        } catch (error) {
            console.error("Error in createNewUser:", error);
            throw new Error("Failed to pair token with user in createNewUser.");
        }
    }
}
