// *** NestJS könyvtárak ***
import { Injectable, HttpException, HttpStatus, Scope } from '@nestjs/common';

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
import { deleteToken } from '../shared/utilities/tokenDeletion';
import userAuthorization, { findUser } from './utilities/userAuthorization.util';
import { createDefaultSettings } from './utilities/DefaultSettingsCreation';
import { modifySettings } from './utilities/SettingsModification';
import { geatherSettings } from './utilities/SettingsCollection';
import { AssetsService } from 'src/assets/assets.service';
import { ProfileDto } from './dtos/Profile.dto';
import { GameService } from 'src/game/game.service';
import { RandomizePasswordResetImages } from './utilities/RandomizePasswordResetImages';
import { getCurrentDate } from 'src/shared/utilities/CurrentDate';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';
import { AchievementManager } from 'src/achievements/AchievementManager';
import { AchievementsGateway } from 'src/achievements/achievements.gateway';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    private static tokenToUser: Map<string, User> = new Map();
    private static socketIdToUser: Map<string, User> = new Map();
    private static passwordChangeTokenToUser: Map<string, User> = new Map();

    constructor(
        private readonly prisma: PrismaService,
        private readonly assetsService: AssetsService,
        private readonly gameService: GameService,
        private readonly emailService: EmailService,
    ) { }

    private async createNewUser(newUser: IUser, isExpire: boolean) {
        try {
            await pairTokenWithUser(this.prisma, newUser.id, newUser.loginToken, isExpire);
            UsersService.tokenToUser.set(newUser.loginToken, new User(newUser.id, newUser.username, newUser.isGuest, newUser.loginToken));
            //console.log("MAP TARTALMA (createNewUser): ", UsersService.tokenToUser);
        } catch (error) {
            //console.error("Hiba a createNewUser-ben:", error);
            throw new Error("Failed to pair token with user.");
        }
    };

    /**
     * Társítja a socket ID-t a felhasználóhoz a token alapján.
     * @param token - A felhasználói token.
     * @param socketId - A socket ID.
     */
    associateSocketId(token: string, socketId: string) {
        const user = UsersService.tokenToUser.get(token);
        if (user) {
            user.socketId = socketId;
            UsersService.socketIdToUser.set(socketId, user);
        };
    };

    /**
     * Eltávolítja a felhasználót a socket ID alapján.
     * @param socketId - A socket ID.
     */
    removeUserBySocketId(socketId: string): void {
        const user = UsersService.socketIdToUser.get(socketId);
        if (user) {
            UsersService.tokenToUser.delete(user.token);
            UsersService.socketIdToUser.delete(socketId);
        };
    };

    /**
     * Visszaadja a felhasználót a token alapján.
     * @param token - A felhasználói token.
     * @returns A felhasználó objektum, vagy undefined, ha nem található.
     */
    getUserByToken(token: string): User | undefined {
        return UsersService.tokenToUser.get(token);
    }

    /**
     * Visszaadja a felhasználót a socket ID alapján.
     * @param socketId - A socket ID.
     * @returns A felhasználó objektum, vagy undefined, ha nem található.
     */
    getUserBySocketId(socketId: string): User | undefined {
        return UsersService.socketIdToUser.get(socketId);
    }

    getUserByPasswordResetToken(token: string): User | undefined {
        return UsersService.passwordChangeTokenToUser.get(token);
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
        await this.createNewUser(newUser, !stayLoggedIn);
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
        //console.log(newGuest)
        await this.createNewUser(newGuest, true);

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
        if (user) { // Token sikeres validációja
            const formatedUser = await this.generateLoginResponse(user, authorization.replace('Bearer ', ''), true);
            await this.createNewUser(formatedUser, false)
            return formatedUser
        }
        // Ha tokennel nem sikerült, a body tartalmát használjuk a bejelentkezéshez
        return await this.handleBodyLogin(userData);
    }

    async generateLoginResponse(userData, token, stayLoggedIn) {
        return {
            id: userData.id,
            loginToken: token,
            username: userData.username,
            profilePicture: (await this.getUsersProfilePicture(userData.id)).find(picture => picture.is_set).profile_pictures,
            profileBorder: (await this.getUsersProfileBorders(userData.id)).find(border => border.is_set).profile_borders,
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
            return {errors: {username: ["Username or email is not correct!"]}};
        }

        // Jelszó ellenőrzése
        const isPasswordValid = await userAuthorization.validatePassword(userData.password, user.password);
        if (!isPasswordValid) {
            return {errors: {username: ["Password is not correct!"]}};
        }

        // Token generálása és párosítása
        const newToken = await createToken(this.prisma);
        await pairTokenWithUser(this.prisma, user.id, newToken, !userData.stayLoggedIn);

        // Válasz generálása, objektum generálása
        const formatedUser = await this.generateLoginResponse(user, newToken, userData.stayLoggedIn);
        await this.createNewUser(formatedUser, userData.stayLoggedIn);
        return formatedUser;
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

    async getCollection(authHeader: string) {
        try {
            const user = (await tokenValidation.validateBearerToken(authHeader, this.prisma));
            const userId = user.id
            if (user.is_guest) {
                throw new HttpException('No No Collection', HttpStatus.UNAUTHORIZED);
            }
            return {
                profilePictures: await this.getProfilePicturesCollection(userId),
                profileBorders: await this.getProfileBordersCollection(userId),
                inventory: await this.getInventoryCollection(userId),
                achievements: await this.getAchievements(userId)
            }
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }

    async getUsersProfilePicture(userId: number) {
        try {
            const ownedProfilePictures = await this.prisma.users_profile_pictures.findMany({
                where: {
                    user: userId
                },
                select: {
                    profile_pictures: {
                        select: {
                            id: true,
                            name: true,
                            src: true
                        }
                    },
                    is_set: true
                }
            })
            return ownedProfilePictures;
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProfilePicturesCollection(userId: number) {
        try {
            const allProfilePictures = await this.assetsService.getAllProfilePictures();
            const ownedProfilePictures = await this.getUsersProfilePicture(userId);
            return allProfilePictures.map(picture => {
                const owned = ownedProfilePictures.find(owned => owned.profile_pictures.id === picture.id);
                return {
                    id: picture.id,
                    name: picture.name,
                    src: picture.src,
                    collected: !!owned,
                    active: owned?.is_set
                }
            })
                .sort((a, b) => {
                    if (a.collected && !b.collected) return -1;
                    return 0;
                })
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUsersProfileBorders(userId: number) {
        try {
            const ownedProfileBorders = await this.prisma.users_profile_borders.findMany({
                where: {
                    user: userId
                },
                select: {
                    profile_borders: {
                        select: {
                            id: true,
                            name: true,
                            src: true
                        }
                    },
                    is_set: true
                }
            })
            return ownedProfileBorders;
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProfileBordersCollection(userId: number) {
        try {
            const allProfileBorders = await this.assetsService.getAllProfileBorders();
            const ownedProfileBorders = await this.getUsersProfileBorders(userId);
            return allProfileBorders.map(border => {
                const owned = ownedProfileBorders.find(owned => owned.profile_borders.id === border.id);
                return {
                    id: border.id,
                    name: border.name,
                    src: border.src,
                    collected: !!owned,
                    active: owned?.is_set
                }
            })
                .sort((a, b) => {
                    if (a.collected && !b.collected) return -1;
                    return 0;
                })
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUsersInventory(userId: number) {
        try {
            const ownedItems = await this.prisma.users_collections.findMany({
                where: {
                    user: userId
                },
                select: {
                    collections: {
                        select: {
                            id: true,
                            name: true,
                            src: true
                        }
                    },
                }
            })
            return ownedItems;
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getInventoryCollection(userId: number) {
        try {
            const allItems = await this.assetsService.getAllInventoryItems();
            const ownedItems = await this.getUsersInventory(userId);
            return allItems.map(item => {
                const owned = ownedItems.find(owned => owned.collections.id === item.id);
                return {
                    id: item.id,
                    name: item.name,
                    src: item.src,
                    collected: !!owned
                }
            })
                .sort((a, b) => {
                    if (a.collected && !b.collected) return -1;
                    return 0;
                })
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUsersAchievements(userId: number) {
        try {
            const ownedAchievements = await this.prisma.users_achievements.findMany({
                where: {
                    user: userId
                },
                select: {
                    achievements: {
                        select: {
                            id: true,
                            icon: true,
                            title: true,
                            description: true,
                            goal: true,
                            is_secret: true
                        },
                    },
                    progress: true,
                }
            })
            return ownedAchievements;
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAchievements(userId: number) {
        try {
            const allAchievements = await this.assetsService.getAllAchievements();
            const ownedAchievements = await this.getUsersAchievements(userId);
            return allAchievements
                .map(achievement => {
                    const owned = ownedAchievements.find(owned => owned.achievements.id === achievement.id);
                    const progress = owned?.progress || 0;

                    // Ha titkos az achievement, helyettesítő adatokat állítunk be
                    if (achievement.is_secret && achievement.goal > progress) {
                        return {
                            id: achievement.id,
                            icon: "Secret.png",
                            title: "???",
                            description: "???",
                            goal: null,
                            progress: null,
                            rarity: 2,
                            collected: false,
                        };
                    }

                    return {
                        id: achievement.id,
                        icon: achievement.icon,
                        title: achievement.title,
                        description: achievement.description,
                        goal: achievement.goal,
                        progress: progress,
                        rarity: achievement.is_secret ? 2 : 1,
                        collected: owned ? true : false,
                    };
                })
                .sort((a, b) => {
                    // Titkos achievementek kerüljenek a lista végére
                    if (a.rarity === 2 && b.rarity === 2 && !a.collected && !b.collected) return 0; // Mindkettő titkos
                    if (a.rarity === 2 && !a.collected) return 1; // `a` titkos, tehát mögé kerül
                    if (b.rarity === 2 && !b.collected) return -1; // `b` titkos, tehát elé kerül

                    // Normál achievementeknél a progress alapján rendezünk
                    const aProgress = a.goal ? (a.progress / a.goal) : 0;
                    const bProgress = b.goal ? (b.progress / b.goal) : 0;
                    return bProgress - aProgress; // Csökkenő sorrendben
                });

        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProfile(authHeader: string, profile: ProfileDto) {
        try {
            const userId = (await tokenValidation.validateBearerToken(authHeader, this.prisma)).id;

            // Helper function for updating is_set fields
            const updateIsSet = async (model: any, identifierField: string, identifierValue: number | null) => {
                await model.updateMany({
                    where: { user: userId },
                    data: { is_set: false },
                });

                if (identifierValue) {
                    await model.updateMany({
                        where: { user: userId, [identifierField]: identifierValue },
                        data: { is_set: true },
                    });
                }
            };

            // Update profile pictures
            const profilePictureUpdate = await updateIsSet(this.prisma.users_profile_pictures, 'profile_picture', profile.profilePicture);

            // Update profile borders
            const profileBorderUpdate = await updateIsSet(this.prisma.users_profile_borders, 'profile_border', profile.profileBorder);

            return {
                profilePicture: profilePictureUpdate,
                profileBorder: profileBorderUpdate
            }
        } catch (error) {
            return { message: error.message };
        }
    }

    async getStats(authHeader: string){
        try {
            const user = (await tokenValidation.validateBearerToken(authHeader, this.prisma));
            const stats = {
                username: user.username,
                profilePicture: (await this.getUsersProfilePicture(user.id)).find(picture => picture.is_set).profile_pictures,
                profileBorder: (await this.getUsersProfileBorders(user.id)).find(border => border.is_set).profile_borders,
                streak: await this.gameService.getStreak(user.id),
                gamemodes: await this.gameService.sortGames(user.id),
                registrationDate: user.registration_date.toLocaleDateString(),
                performedAchievements: {
                    collected: (await this.getUsersAchievements(user.id)).filter(achievement => achievement.progress === achievement.achievements.goal).length,
                    collectable: (await this.assetsService.getAllAchievements()).length
                },
                collectedRecipes: {
                    collected: (await this.getUsersInventory(user.id)).length,
                    collectable: (await this.assetsService.getAllInventoryItems()).length
                }
            }
            return stats;
        } catch (error) {
            return { message: error.message };
        }
    }

    async findEmail(email: string) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    email: email
                }
            })
            return user ? true : false;
        } catch (error) {
            return { message: error.message };
        }
    }

    async requestPasswordReset(authHeader: string, email: string) {
        const errors: { email?: string[] } = {};
        try {
            const token = authHeader.replace('Bearer ', '');
            const verifyToken = uuidv4()
            const images = await RandomizePasswordResetImages(this.prisma);
            if (await this.findEmail(email)) {
                const paswordReset = {
                    token: verifyToken,
                    expiration: new Date(getCurrentDate().setMinutes(getCurrentDate().getMinutes() + 10)),
                    images: images,
                    verified: false,
                    email: email
                }
                const user = this.getUserByToken(token);
                user.passwordReset = paswordReset;
                UsersService.passwordChangeTokenToUser.set(verifyToken, user);
                return { 
                    items: images,
                    token: verifyToken
                };
            } else {
                errors.email = ['Email does not exists.'];
                return { message: errors };
            }
        } catch (error) {
            return { message: error.message };
        }
    }

    async verifyUser(token: string, id: string) {
        try {
            const user = this.getUserByPasswordResetToken(token);
            if (user) {
                if(user.passwordReset.expiration > getCurrentDate()){
                    if(user.passwordReset.images.find(image => image?.id === parseInt(id))?.isRight){
                        user.passwordReset.verified = true;
                        return {
                            userId: user.socketId,
                            success: true,
                            token: token,
                            text: "Verification successful",
                            color: '#00aa00'
                        };
                    }else{
                        user.passwordReset = undefined;
                        UsersService.passwordChangeTokenToUser.delete(token);
                        return {
                            userId: user.socketId,
                            success: false,
                            token: null,
                            text: "Verification failed",
                            color: '#aa0000'
                        }
                    }
                }else{
                    user.passwordReset = undefined;
                    UsersService.passwordChangeTokenToUser.delete(token);
                    return {
                        userId: user.socketId,
                        success: false,
                        token: null,
                        text: "Verification token expired",
                        color: '#aa0000'
                    }
                }
            } else {
                return {
                    success: false,
                    token: null,
                    text: "Verification failed",
                    color: '#aa0000'
                }
            }
        } catch (error) {
            return { message: error.message };
        }
    }

    async resetPassword(authHeader: string, body: { token: string, password: string }) {
        try {
            const user = this.getUserByPasswordResetToken(body.token);
            if (user && user.token === authHeader.replace('Bearer ', '')) {
                if(user.passwordReset.verified){
                    await this.prisma.users.update({
                        where: {
                            email: user.passwordReset.email
                        },
                        data: {
                            password: await bcrypt.hash(body.password, 2)
                        }
                    })
                    user.passwordReset = undefined;
                    UsersService.passwordChangeTokenToUser.delete(body.token);
                    return {}
                }else{
                    return { message: "User not verified" };
                }
            } else {
                return { message: "User not found" };
            }
        } catch (error) {
            return { message: error.message };
        }
    }

    async addItemToCollection(userId: number, itemId: number) {
        try {
            await this.prisma.users_collections.create({
                data: {
                    user: userId,
                    collection: itemId
                }
            })
        } catch (error) {
            return { message: error.message };
        }
    }
}