import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { PasswordReset, User } from './classes/user.class';
import { PrismaService } from '../prisma/prisma.service';
import { AssetsService } from '../assets/assets.service';
import { IUser, IUserData } from './interfaces/user.interface';
import { RegistDataDto } from './dtos/regist.dto';
import { SettingsService } from '../settings/settings.service';
import { LoginDataDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { getCurrentDate } from '../sharedComponents/utilities/date.util';
import { v4 as uuidv4 } from 'uuid';
import { getStreak, getUserById } from './utilities/user.util';
import { CacheService } from '../cache/cache.service';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly assetsService: AssetsService,
        private readonly tokenService: TokenService,
        private readonly settingsService: SettingsService,
        private readonly authorizationService: AuthorizationService,
        private readonly cacheService: CacheService,
    ) { }

    private async createNewUser(newUser: IUser, isExpire: boolean) {
        try {
            const currentUser = this.cacheService.tokenToUser.get(newUser.loginToken);
            const socketId = currentUser ? currentUser.socketId : undefined;
            newUser.loginToken = await this.tokenService.pairTokenWithUser(newUser.id, newUser.loginToken, isExpire);
            const admin_rights = await this.authorizationService.getAdminRights(newUser.id);
            this.cacheService.tokenToUser.set(newUser.loginToken, new User(newUser.id, newUser.username, newUser.isGuest, newUser.loginToken, admin_rights, socketId));
        } catch (error) {
            throw new Error("Failed to pair token with user.");
        }
    };

    //######################################################### USER LOGIN/REGIST FUNCTIONS #########################################################

    /**
    * Új felhasználó regisztrálása.
    * Ellenőrzi a meglévő felhasználókat, és új rekordot hoz létre az adatbázisban.
    * @param userDto A regisztrációs adatok.
    * @returns Az új felhasználó adatai, vagy hibaüzenetek.
    */
    async register(userDto: RegistDataDto): Promise<IUserData | { [key: string]: string[] }> {
        const { username, email, password, stayLoggedIn } = userDto;

        const existingUser = await this.findUserByName({ username, email });
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

        const newUser = await this.createAccount({ username, email, password, stayLoggedIn });
        await this.createNewUser(newUser, !stayLoggedIn);
        await this.settingsService.createDefaultSettings(newUser.id);

        const { id, ...userData } = newUser;
        return userData as IUserData;
    }

    /**
     * Guest account létrehozása és token párosítása átmeneti felhasználók számára.
     * @returns {Promise<IUserData>} A guest account adatai azonosító nélkül.
     */
    async loginWithGuestAccount(): Promise<IUserData> {
        try {
            const newGuest = await this.createAccount();
            await this.createNewUser(newGuest, true);
            const { id, ...userData } = newGuest;
            return userData as IUserData;
        } catch (err) {
            throw new HttpException(
                { errors: err.response?.errors || { message: [err.message] } },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Bejelentkezési folyamat kezelése Bearer tokennel vagy felhasználónév/jelszó párossal.
     * @param authorization - A Bearer token, amely az `authorization` headerből érkezik.
     * @param userData - A `LoginDataDto` objektum, amely tartalmazza a felhasználó bejelentkezési adatait.
     */
    async autoLogin(authorization: string) {
        try {
            const userId = await this.tokenService.validateBearerToken(authorization);
            const formatedUser = await this.generateLoginResponse(
                await getUserById(userId, this.prisma),
                authorization.replace('Bearer ', ''),
                true
            );
            await this.createNewUser(formatedUser, false);
            return formatedUser;
        } catch (err) {
            throw new HttpException(
                { errors: err.response?.errors || { message: [err.message] } },
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    async generateLoginResponse(userData, token, stayLoggedIn) {
        return {
            id: userData.id,
            loginToken: token,
            username: userData.username,
            profilePicture: (await this.assetsService.getUsersProfilePicture(userData.id)).find(picture => picture.is_set).profile_pictures,
            profileBorder: (await this.assetsService.getUsersProfileBorders(userData.id)).find(border => border.is_set).profile_borders,
            isGuest: false,
            stayLoggedIn: stayLoggedIn
        };
    }

    /**
     * Bejelentkezés felhasználónév/jelszó párossal.
     * @param userData - A `LoginDataDto` objektum, amely tartalmazza a felhasználó adatait.
     */
    async loginUser(userData: LoginDataDto) {
        try {
            const user = await this.findUserByName({
                username: userData.usernameOrEmail,
                email: userData.usernameOrEmail,
            });
            if (!user) {
                throw new HttpException(
                    { errors: { username: ["Username or email is not correct!"] } },
                    HttpStatus.BAD_REQUEST
                );
            }
            const isPasswordValid = await this.validatePassword(userData.password, user.password);
            if (!isPasswordValid) {
                throw new HttpException(
                    { errors: { password: ["Password is not correct!"] } },
                    HttpStatus.BAD_REQUEST
                );
            }
            let newToken = await this.tokenService.createToken();
            newToken = await this.tokenService.pairTokenWithUser(user.id, newToken, !userData.stayLoggedIn);
            const formatedUser = await this.generateLoginResponse(user, newToken, userData.stayLoggedIn);
            await this.createNewUser(formatedUser, userData.stayLoggedIn);
            return formatedUser;
        } catch (err) {
            throw new HttpException(
                { errors: err.response?.errors || { message: [err.message] } },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
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
            const user = await this.tokenService.validateBasicToken(authHeader);
            const isDeleted = await this.tokenService.deleteToken(user);
            if (!isDeleted) {
                throw new HttpException(
                    { errors: { message: ['A token törlése nem sikerült.'] } },
                    HttpStatus.BAD_REQUEST
                );
            }
        } catch (err) {
            throw new HttpException(
                { errors: err.response?.errors || { message: [err.message] } },
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    // Felhasználó keresése felhasználónév vagy email alapján.
    async findUserByName(userData: { username?: string; email?: string }) {
        try {
            return await this.prisma.users.findFirst({
                where: {
                    OR: [
                        userData.username ? { username: userData.username } : undefined,
                        userData.email ? { email: userData.email } : undefined,
                    ].filter(Boolean),
                },
            });
        } catch (err) {
            throw new HttpException(
                { errors: err.response?.errors || { message: [err.message] } },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Jelszó validálása (hash összehasonlítás).
    async validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(inputPassword, storedPassword);
        } catch (err) {
            throw new HttpException(
                { errors: err.response?.errors || { message: [err.message] } },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    //######################################################### USER DATABASE MODIFY FUNCTIONS #########################################################

    async createAccount(
        accountData?: { username?: string; email?: string; password?: string; stayLoggedIn?: boolean }
    ): Promise<IUser> {
        try {
            // Döntés: vendég vagy normál felhasználó
            const isGuest = !accountData || !accountData.username || !accountData.email || !accountData.password;

            let userData;

            if (isGuest) {
                // Vendég felhasználó adatai
                userData = {
                    is_guest: true,
                    registration_date: getCurrentDate(),
                };
            } else {
                // Normál felhasználó adatai
                const hashedPassword = await bcrypt.hash(accountData.password, 2); // Jelszó hashelése
                userData = {
                    username: accountData.username,
                    email: accountData.email,
                    password: hashedPassword,
                    is_guest: false,
                    registration_date: getCurrentDate(),
                };
            }

            // Felhasználó létrehozása
            const createdUser = await this.prisma.users.create({
                data: userData
            });

            await this.prisma.users_profile_pictures.create({
                data: {
                    user: createdUser.id,
                    profile_picture: 15,
                    is_set: true
                }
            })

            await this.prisma.users_profile_borders.create({
                data: {
                    user: createdUser.id,
                    profile_border: 7,
                    is_set: true
                }
            })

            // Törzsadatok generálása
            return {
                id: createdUser.id,
                loginToken: await this.tokenService.createToken(),
                username: isGuest ? `Guest${createdUser.id}` : createdUser.username,
                profilePicture: {
                    id: 15,
                    name: "Desert Villager Base",
                    src: "Desert_Villager_Base.png"
                },
                isGuest: isGuest,
                profileBorder: {
                    id: 7,
                    name: "Grass",
                    src: "Grass.png"
                },
                stayLoggedIn: isGuest ? false : !!accountData?.stayLoggedIn,
            };
        } catch (error) {
            console.error("Error creating account:", error);
            throw new Error("Failed to create account.");
        }
    }

    //######################################################### PASSWORD RESET FUNCTIONS #########################################################

    /**
     * Ellenőrzi, hogy létezik-e a megadott email cím.
     * @param email - Az ellenőrizendő email cím.
     * @returns Igaz, ha az email cím létezik, egyébként hamis.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async findEmail(email: string) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    email: email
                }
            })
            return user ? true : false;
        } catch (error) {
            throw new HttpException(
                { errors: { email: ["Email does not registraed!"] } },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    /**
     * Jelszó visszaállítási kérelem kezelése.
     * @param authHeader - Az autorizációs fejléc, amely tartalmazza a Bearer tokent.
     * @param email - A felhasználó email címe.
     * @returns A jelszó visszaállítási kérelem eredménye.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async requestPasswordReset(authHeader: string, email: string) {
        try {
            const token = authHeader.replace('Bearer ', '');
            const verifyToken = uuidv4()
            if (await this.findEmail(email)) {
                const images = await this.RandomizePasswordResetImages();
                const paswordReset: PasswordReset = {
                    token: verifyToken,
                    expiration: new Date(getCurrentDate().setMinutes(getCurrentDate().getMinutes() + 10)),
                    images: images,
                    verified: false,
                    email: email
                }
                const user = this.cacheService.getUserByToken(token);
                user.passwordReset = paswordReset;
                this.cacheService.passwordChangeTokenToUser.set(verifyToken, user);
                return {
                    items: images,
                    token: verifyToken,
                    name: (await this.findUserByName({ email: email })).username
                };
            } else {
                throw new HttpException(
                    { errors: { email: ["Email does not registrated!"] } },
                    HttpStatus.BAD_REQUEST
                );
            }
        } catch (error) {
            throw new HttpException(
                { errors: error.response?.errors },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async RandomizePasswordResetImages() {
        const images = await this.prisma.collections.findMany();
        const randomImagesSrc = new Set()
        const randomIndexes = [];
        while (randomImagesSrc.size < 3) {
            const randomIndex = Math.floor(Math.random() * images.length);
            if (!randomImagesSrc.has(images[randomIndex].src)) {
                randomImagesSrc.add(images[randomIndex].src);
                randomIndexes.push(randomIndex);
            };
        }
        const correctIndex = Math.floor(Math.random() * 3);
        return randomIndexes.map((index, i) => ({
            id: images[index].id,
            item_id: images[index].item_id,
            name: images[index].name,
            src: images[index].src,
            isRight: i === correctIndex,
        }));
    }

    /**
     * Felhasználó ellenőrzése a jelszó visszaállítási token alapján.
     * @param token - A jelszó visszaállítási token.
     * @param id - Az ellenőrizendő kép azonosítója.
     * @returns Az ellenőrzés eredménye.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async verifyUser(token: string, id: string) {
        try {
            const user = this.cacheService.getUserByPasswordResetToken(token);
            if (user) {
                if (user.passwordReset.expiration > getCurrentDate()) {
                    if (user.passwordReset.images.find(image => image?.id === parseInt(id))?.isRight) {
                        user.passwordReset.verified = true;
                        return {
                            userId: user.socketId,
                            success: true,
                            token: token,
                            text: "Verification successful",
                            color: '#00aa00'
                        };
                    } else {
                        user.passwordReset = undefined;
                        this.cacheService.passwordChangeTokenToUser.delete(token);
                        return {
                            userId: user.socketId,
                            success: false,
                            token: null,
                            text: "Verification failed",
                            color: '#aa0000'
                        }
                    }
                } else {
                    user.passwordReset = undefined;
                    this.cacheService.passwordChangeTokenToUser.delete(token);
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

    /**
     * Jelszó visszaállítása.
     * @param authHeader - Az autorizációs fejléc, amely tartalmazza a Bearer tokent.
     * @param body - A jelszó visszaállítási adatok.
     * @returns A jelszó visszaállítás eredménye.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async resetPassword(authHeader: string, body: { token: string, password: string }) {
        try {
            const user = this.cacheService.getUserByPasswordResetToken(body.token);
            if (user && user.token === authHeader.replace('Bearer ', '')) {
                if (user.passwordReset.verified) {
                    await this.prisma.users.update({
                        where: {
                            email: user.passwordReset.email
                        },
                        data: {
                            password: await bcrypt.hash(body.password, 2)
                        }
                    })
                    user.passwordReset = undefined;
                    this.cacheService.passwordChangeTokenToUser.delete(body.token);
                    return { message: "Password reset successful" };
                } else {
                    return { message: "User not verified" };
                }
            } else {
                return { message: "User not found" };
            }
        } catch (error) {
            return { message: error.message };
        }
    }

    //######################################################### USER STATISTICS FUNCTIONS #########################################################

    /**
         * Lekéri a felhasználó statisztikáit.
         * @param authHeader - Az autorizációs fejléc, amely tartalmazza a Bearer tokent.
         * @returns A felhasználó statisztikái.
         * @throws HttpException - Ha hiba történik az adatlekérdezés során.
         */
    async getStats(authHeader: string) {
        try {
            const userId = (await this.tokenService.validateBearerToken(authHeader));
            const user = await getUserById(userId, this.prisma);
            const stats = {
                username: user.username,
                profilePicture: (await this.assetsService.getUsersProfilePicture(user.id)).find(picture => picture.is_set).profile_pictures,
                profileBorder: (await this.assetsService.getUsersProfileBorders(user.id)).find(border => border.is_set).profile_borders,
                streak: await getStreak(user.id, this.prisma),
                gamemodes: await this.sortGames(user.id),
                registrationDate: user.registration_date.toLocaleDateString(),
                performedAchievements: {
                    collected: (await this.assetsService.getUsersAchievements(user.id)).filter(achievement => achievement.progress >= achievement.achievements.goal).length,
                    collectable: (await this.assetsService.getAllAchievements()).length
                },
                collectedRecipes: {
                    collected: (await this.assetsService.getUsersInventory(user.id)).length,
                    collectable: (await this.assetsService.getAllInventoryItems()).length
                }
            }
            return stats;
        } catch (error) {
            return { message: error.message };
        }
    }

    async getUsersGames(userId: number) {
        return await this.prisma.games.findMany({
            select: {
                date: true,
                is_solved: true,
                gamemodes: {
                    select: {
                        id: true,
                        name: true,
                        difficulties: {
                            select: {
                                id: true,
                                color_code: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        tips: true
                    }
                }
            },
            where: {
                player: userId
            }
        });
    }

    async sortGames(userId: number) {
        const games = {};
        const userGames = await this.getUsersGames(userId);
        userGames.forEach(game => {
            if (games[game.gamemodes.id]) {
                games[game.gamemodes.id].played++;
                if (game.is_solved) {
                    games[game.gamemodes.id].solved++;
                    if (game._count.tips > 0) {
                        if (
                            games[game.gamemodes.id].fastestSolve === null ||
                            game._count.tips < games[game.gamemodes.id].fastestSolve
                        ) {
                            games[game.gamemodes.id].fastestSolve = game._count.tips;
                        }
                    }
                }
            } else {
                games[game.gamemodes.id] = {
                    gamemodeName: game.gamemodes.name,
                    played: 1,
                    solved: game.is_solved ? 1 : 0,
                    fastestSolve: game.is_solved && game._count.tips > 0 ? game._count.tips : null,
                    color: game.gamemodes.difficulties.color_code
                };
            }
        });
        return Object.keys(games).sort().map(key => games[key]);
    }

    async deleteUnnecessaryGuestsData(user: User) {
        if (user.isGuest) {
            const games = await this.prisma.games.findMany({
                where: {
                    player: user.id
                }
            })
            if (games.length === 0) {
                await this.prisma.users.delete({
                    where: {
                        id: user.id
                    }
                })
            } else {
                return true;
            }
        }
        return false;
    }
}