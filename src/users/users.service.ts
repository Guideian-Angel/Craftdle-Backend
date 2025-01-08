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
import { deleteToken } from '../shared/utilities/TokenDeletion';
import userAuthorization, { findUser } from './utilities/userAuthorization.util';
import { createDefaultSettings } from './utilities/DefaultSettingsCreation';
import { modifySettings } from './utilities/SettingsModification';
import { geatherSettings } from './utilities/SettingsCollection';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    tokenToUser: Map<string, User> = new Map();
    socketIdToUser: Map<string, User> = new Map();

    /**
    * Új felhasználó létrehozása és token párosítása.
    * @param newUser - Az újonnan létrehozott felhasználói objektum.
    * @param isExpire - Megadja, hogy a token átmeneti-e.
    */
    private async createNewUser(newUser: IUser, isExpire: boolean) {
        try {
            await pairTokenWithUser(this.prisma, newUser.id, newUser.loginToken, isExpire);
            this.tokenToUser.set(newUser.loginToken, new User(newUser.id, newUser.username, newUser.isGuest, newUser.loginToken));
        } catch (error) {
            console.error("An error occurred in the createNewUser function:", error);
            throw new Error("Failed to pair token with user.");
        };
    };

    // Handshake-nél
    associateSocketId(token: string, socketId: string) {
        const user = this.tokenToUser.get(token);
        if (user) {
            user.socketId = socketId;
            this.socketIdToUser.set(socketId, user);
        };
    };

    removeUserBySocketId(socketId: string): void {
        const user = this.socketIdToUser.get(socketId);
        if (user) {
            this.tokenToUser.delete(user.token);
            this.socketIdToUser.delete(socketId);
        };
    };

    // User keresése token alapján
    getUserByToken(token: string): User | undefined {
        tokenValidation.validateToken(token, this.prisma);
        return this.tokenToUser.get(token);
    }

    // User keresése socket ID alapján
    getUserBySocketId(socketId: string): User | undefined {
        return this.socketIdToUser.get(socketId);
    }



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
        this.createNewUser(newUser, !stayLoggedIn);
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
        await this.createNewUser(newGuest, false);

        // Id eltávolítása a válaszból
        const { id, ...userData } = newGuest;
        return userData as IUserData;
    }


    /**
     * Bejelentkezési folyamat kezelése Bearer tokennel vagy felhasználónév/jelszó párossal.
     * @param authorization - A Bearer token, amely az `authorization` headerből érkezik.
     * @param userData - A `LoginDataDto` objektum, amely tartalmazza a felhasználó bejelentkezési adatait.
     */
    async loginUser(authorization: string, userData: LoginDataDto) {
        // Próbálkozás token alapú bejelentkezéssel
        const user = await tokenValidation.validateBearerToken(authorization, this.prisma, true);
        if (user) {
            return this.generateLoginResponse(user, authorization.replace('Bearer ', ''), true); // Token sikeres validációja
        }
        // Ha tokennel nem sikerült, a body tartalmát használjuk a bejelentkezéshez
        return await this.handleBodyLogin(userData);
    }

    generateLoginResponse(userData, token, stayLoggedIn) {
        return {
            id: userData.id,
            loginToken: token,
            username: userData.username,
            profilePicture: {
                id: 15,
                name: "Desert Villager Base",
                src: "Desert_Villager_Base.png"
            },
            profileBorder: {
                id: 7,
                name: "Grass",
                src: "Grass.png"
            },
            isGuest: false,
            stayLoggedIn: stayLoggedIn
        };
    }

    /**
     * Bejelentkezés felhasználónév/jelszó párossal.
     * @param userData - A `LoginDataDto` objektum, amely tartalmazza a felhasználó adatait.
     */
    private async handleBodyLogin(userData: LoginDataDto) {
        // Felhasználó keresése felhasználónév vagy email alapján
        const user = await userAuthorization.findUser(this.prisma, {
            username: userData.usernameOrEmail,
            email: userData.usernameOrEmail,
        });

        if (!user) {
            throw new HttpException('Érvénytelen felhasználónév vagy email.', HttpStatus.UNAUTHORIZED);
        }

        // Jelszó ellenőrzése
        const isPasswordValid = await userAuthorization.validatePassword(userData.password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Érvénytelen jelszó.', HttpStatus.UNAUTHORIZED);
        }

        // Token generálása és párosítása
        const newToken = await createToken(this.prisma);
        await pairTokenWithUser(this.prisma, user.id, newToken, !userData.stayLoggedIn);

        // Válasz generálása
        return this.generateLoginResponse(user, newToken, userData.stayLoggedIn);
    }

    /**
     * Kijelentkezési folyamatot kezelő függvény.
     * 1. Validálja a felhasználót Basic Auth token alapján.
     * 2. Törli a felhasználóhoz tartozó tokent az adatbázisból.
     * A felhasználó rekordja a `users` táblában változatlan marad.
     * @param authHeader - Az `authorization` fejléc tartalma.
     * @throws HttpException, ha a token validálása vagy törlése nem sikerül.
     */
    async logoutUser(authHeader: string) {
        try {
            // Felhasználó validálása Basic tokennel
            const user = await tokenValidation.validateBasicToken(authHeader, this.prisma);

            // Token törlése az adatbázisból
            const isDeleted = await deleteToken(this.prisma, user.id);
            if (!isDeleted) {
                throw new Error('A token törlése nem sikerült.');
            }

            console.log(`Token törölve: Felhasználó ID = ${user.id}`);
        } catch (error) {
            console.error('LogoutUser error:', error.message);
            throw new HttpException(error.message || 'Szerverhiba történt.', HttpStatus.UNAUTHORIZED);
        }
    }


    //######################################################### SETTINGS FUNCTIONS #########################################################

    /**
     * A felhasználó beállításainak összegyűjtése.
     * @param {string} authHeader - Az Authorization fejléc tartalma.
     * @returns {Promise<ISettings[]>} - A felhasználó beállításainak listája.
     * @throws {HttpException} - Ha hiba történik az azonosítás vagy adatlekérdezés során.
     */
    async collectSettings(authHeader: string): Promise<ISettings[]> {
        try {
            // Felhasználó azonosítása Bearer token alapján
            const userId = (await tokenValidation.validateBearerToken(authHeader, this.prisma)).id;

            // Beállítások lekérdezése
            return geatherSettings(userId, this.prisma);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Felhasználói beállítások módosításása az azonosító alapján.
     * @param {number} settingsId - A módosítandó beállítás egyedi azonosítója.
     * @param {string} authHeader - Az autorizációs fejléc, amely tartalmazza a Bearer tokent.
     * @param {UpdateSettingsDto} settingsData - Az új beállításokat tartalmazó adatok.
     * @throws {HttpException} - Ha a token érvénytelen, vagy a beállítások nem találhatók.
     */
    async updateSettings(settingsId: number, authHeader: string, settingsData: UpdateSettingsDto) {
        try {
            const userId = (await tokenValidation.validateBearerToken(authHeader, this.prisma)).id;
            modifySettings(settingsId, userId, settingsData, this.prisma);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }
}
