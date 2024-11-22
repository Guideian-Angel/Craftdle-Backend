import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './classes/user'
import { IUser, IUserData } from './interfaces/UserData.interface'
import { createGuestAccount } from './utilities/guestAccountCreation.util'
import { pairTokenWithUser } from './utilities/TokenPairingWithUser.util'
import { LoginDataDto } from './dtos/LoginData.dto';
import tokenValidation from '../shared/utilities/tokenValidation.util';
import userAuthorization from './utilities/userAuthorization.util'
import { createToken } from 'src/shared/utilities/tokenCreation.util';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    users: User[] = [];

    async loginWithGuestAccount(): Promise<IUserData> {
        const newGuest = await createGuestAccount(this.prisma);
        this.createNewUser(newGuest, true);
        const { id, ...userData } = newGuest; // A destruktúrálással eltávolítjuk az `id`-t
        return userData as IUserData; // Az `id` nélküli objektum visszatérése
    }

    async loginUser(authorization: string, userData: LoginDataDto) {
        // Ha van Bearer token a headerben, akkor azt validáljuk. és próbáljuk bejelentkeztetni a felhasználót
        const user = await tokenValidation.validateBearerToken(authorization, this.prisma); // Megnézzük van e token a headerben, majd validáljuk is
        if (user) { //Ha érvényes tokent találtunk, bejelentkeztetjük a felhasználót, és visszatérünk az adataival
            // további működés
        }

        // Ha nincs token, megpróbálunk a body tartalmával belépni
        return await this.handleBodyLogin(userData);
    }

    private async handleBodyLogin(userData: LoginDataDto){
        // Lekérdezzük a felhasználót felhasználónév, vagy emailcím alapján
        const user = await userAuthorization.findUserByUsernameOrEmail(this.prisma, userData.usernameOrEmail);
        if (!user) {
            throw new HttpException('Invalid username or email.', HttpStatus.UNAUTHORIZED);
        }

        // Jelszó validálása
        const isPasswordValid = await userAuthorization.validatePassword(userData.password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid password.', HttpStatus.UNAUTHORIZED);
        }

        // // Token generálása és párosítása a felhasználóval
        const newToken = await createToken(this.prisma);
        await pairTokenWithUser(this.prisma, user.id, newToken, !userData.stayLoggedIn);

        // // Válasz összeállítása
        // return generateLoginResponse(user, 'Login successful with username and password', newToken);
    }

    private sanitizeUser(user: any): Partial<IUserData> {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }


    private async createNewUser(newUser: IUser, isExpire: boolean) {
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
