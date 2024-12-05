// *** NestJS könyvtárak ***
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

// *** Shared modulok ***
import tokenValidation from 'src/shared/utilities/tokenValidation';
import { createToken } from 'src/shared/utilities/tokenCreation';

// *** Prisma ***
import { PrismaService } from 'src/prisma/prisma.service';

// *** DTO-k ***
import { LoginDataDto } from './dtos/LoginData.dto';
import { RegistDataDto } from './dtos/RegistData.dto';
import { UpdateSettingsDto } from './dtos/SettingsData.dto';

// *** Interfészek és osztályok ***
import { IUser, IUserData } from './interfaces/IUserData';
import { ISettings } from './interfaces/ISettings';
import { User } from './classes/user';

// *** Utility funkciók ***
import { createAccount } from './utilities/AccountCreation';
import { pairTokenWithUser } from './utilities/TokenPairingWithUser';
import { deleteToken } from './utilities/TokenDeletion';
import userAuthorization, { findUser } from './utilities/userAuthorization.util';
import { createDefaultSettings } from './utilities/DefaultSettingsCreation';
import { modifySettings } from './utilities/SettingsModification';
import { geatherSettings } from './utilities/SettingsCollection';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    users: { [key: string]: User } = {};


    //######################################################### USER LOGIN/REGIST FUNCTIONS #########################################################

    /**
    * Új felhasználó regisztrálása.
    * Ellenőrzi a meglévő felhasználókat, és új rekordot hoz létre az adatbázisban.
    * @param userDto A regisztrációs adatok.
    * @returns Az új felhasználó adatai, vagy hibaüzenetek.
    */
    async register(userDto: RegistDataDto): Promise<IUserData | { [key: string]: string[] }> {
        const { username, email, password, stayLoggedIn } = userDto;

        const existingUser = await findUser(this.prisma, { username, email });
        const errors: { username?: string[]; email?: string[] } = {};

        if (existingUser) {
            if (existingUser.username === username) {
                errors.username = ['Username already exists.'];
            }
            if (existingUser.email === email) {
                errors.email = ['Email already exists.'];
            }

            if (Object.keys(errors).length > 0) {
                return errors; // Hiba esetén hibatömböt adunk vissza.
            }
        }

        const newUser = await createAccount(this.prisma, { username, email, password, stayLoggedIn });
        await createDefaultSettings(this.prisma, newUser.id);

        const { id, ...userData } = newUser;
        return userData as IUserData;
    }

    /**
     * Guest account létrehozása és token párosítása átmeneti felhasználók számára.
     * @returns {Promise<IUserData>} A guest account adatai azonosító nélkül.
     */
    async loginWithGuestAccount(): Promise<IUserData> {
        const newGuest = await createAccount(this.prisma);

        // Token párosítása a felhasználóhoz, átmeneti státusszal
        await this.createNewUser(newGuest, true);

        // Id eltávolítása a válaszból
        const { id, ...userData } = newGuest;
        return userData as IUserData;
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

    private async handleBodyLogin(userData: LoginDataDto) {
        // Lekérdezzük a felhasználót felhasználónév, vagy emailcím alapján
        const user = await userAuthorization.findUser(this.prisma, { username: userData.usernameOrEmail, email: userData.usernameOrEmail });
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


    /**
     * Új felhasználó létrehozása és token párosítása.
     * @param newUser - Az újonnan létrehozott felhasználói objektum.
     * @param isExpire - Megadja, hogy a token átmeneti-e.
     */
    private async createNewUser(newUser: IUser, isExpire: boolean) {
        try {
            await pairTokenWithUser(this.prisma, newUser.id, newUser.loginToken, isExpire);
            // További logika, például felhasználói objektum inicializálása
        } catch (error) {
            console.error("An error occurred in the createNewUser function:", error);
            throw new Error("Failed to pair token with user.");
        }
    }

    async logoutUser(authHeader: string) {
        try {
            const user = await tokenValidation.validateBasicToken(authHeader, this.prisma);

            if (await deleteToken(this.prisma, user.id)) {
                //törölni kell a faszhasználót a users listából
            } else {
                throw new Error("Failed to delete token");
            }
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }


    //######################################################### SETTINGS FUNCTIONS #########################################################

    async collectSettings(authHeader: string): Promise<ISettings[]> {
        try {
            const userId = (await tokenValidation.validateBearerToken(authHeader, this.prisma)).id;

            return geatherSettings(userId, this.prisma);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }

    async updateSettings(settingsId: number, authHeader: string, settingsData: UpdateSettingsDto) {
        try {
            const userId = (await tokenValidation.validateBearerToken(authHeader, this.prisma)).id;

            modifySettings(settingsId, userId, settingsData, this.prisma);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }
}
