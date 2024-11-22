import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './classes/user'
import { IUser } from './interfaces/IUserData'
import { createGuestAccount } from './utilities/GuestAccountCreation'
import { pairTokenWithUser } from './utilities/TokenPairingWithUser'
import { IUserData } from './interfaces/IUserData';
import tokenValidation from '../shared/utilities/TokenValidation';
import { deleteToken } from './utilities/TokenDeletion'

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

    async logoutUser(authHeader: string){
        try {
            const user = await tokenValidation.validateBasicToken(authHeader, this.prisma);

            if(await deleteToken(this.prisma, user.id)){
                //törölni kell a faszhasználót a users listából
            } else{
                throw new Error("Failed to delete token");
            }
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }
}
