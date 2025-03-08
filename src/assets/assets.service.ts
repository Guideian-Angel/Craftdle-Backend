import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { ProfileAssetsDataDto } from './dtos/profileAssets.dto';
import { IItem } from 'src/sharedComponents/interfaces/item.interface';
import { User } from 'src/users/classes/user.class';

@Injectable()
export class AssetsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tokenService: TokenService,
    ) { }

    //######################################################### BASIC FUNCTIONS #########################################################

    async getAchievementByReward(rewards: { id: number, name: string, src: string }[], rewardType: string) {
        return Promise.all(rewards.map(async (picture) => {
            const reward = await this.prisma.rewards.findFirst({
                where: {
                    reward: picture.id,
                    reward_types: {
                        name: rewardType
                    }
                },
            });
            if (!reward) return { ...picture, unlock: null };

            const achievement = await this.prisma.achievements.findUniqueOrThrow({
                where: { id: reward.achievement }
            });

            return {
                ...picture,
                unlock: achievement.is_secret ? "???" : `"${achievement.title}" achievement`
            };
        }));
    }

    async getAllProfilePictures() {
        try {
            const profile_pictures = await this.prisma.profile_pictures.findMany();
            return this.getAchievementByReward(profile_pictures, "profile_pictures");
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllProfileBorders() {
        try {
            const profile_borders = await this.prisma.profile_borders.findMany();
            return this.getAchievementByReward(profile_borders, "profile_borders");
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllInventoryItems() {
        try {
            return await this.prisma.collections.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllAchievements() {
        try {
            return await this.prisma.achievements.findMany({
                select: {
                    id: true,
                    icon: true,
                    title: true,
                    description: true,
                    goal: true,
                    is_secret: true,
                    child_achievement: true,
                    parent_achievement: true
                }
            });
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //######################################################### USER SPECIFIC FUNCTIONS #########################################################

    async getCollection(authHeader: string) {
        try {
            const userId = (await this.tokenService.validateBearerToken(authHeader));
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

    /**
     * Lekéri a felhasználó profilképét az adatbázisból.
     * @param userId - A felhasználó azonosítója.
     * @returns A felhasználó profilképeinek listája.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
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

    /**
     * Lekéri a felhasználó profilkép gyűjteményét.
     * @param userId - A felhasználó azonosítója.
     * @returns A felhasználó profilkép gyűjteménye.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async getProfilePicturesCollection(userId: number) {
        try {
            const allProfilePictures = await this.getAllProfilePictures();
            const ownedProfilePictures = await this.getUsersProfilePicture(userId);
            return allProfilePictures.map(picture => {
                const owned = ownedProfilePictures.find(owned => owned.profile_pictures.id === picture.id);
                return {
                    id: picture.id,
                    name: picture.name,
                    src: picture.src,
                    collected: !!owned,
                    active: owned?.is_set,
                    unlock: picture.unlock
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

    /**
     * Lekéri a felhasználó profilkereteit az adatbázisból.
     * @param userId - A felhasználó azonosítója.
     * @returns A felhasználó profilkereteinek listája.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
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

    /**
     * Lekéri a felhasználó profilkeret gyűjteményét.
     * @param userId - A felhasználó azonosítója.
     * @returns A felhasználó profilkeret gyűjteménye.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async getProfileBordersCollection(userId: number) {
        try {
            const allProfileBorders = await this.getAllProfileBorders();
            const ownedProfileBorders = await this.getUsersProfileBorders(userId);
            return allProfileBorders.map(border => {
                const owned = ownedProfileBorders.find(owned => owned.profile_borders.id === border.id);
                return {
                    id: border.id,
                    name: border.name,
                    src: border.src,
                    collected: !!owned,
                    active: owned?.is_set,
                    unlock: border.unlock
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

    /**
     * Lekéri a felhasználó tárgyait az adatbázisból.
     * @param userId - A felhasználó azonosítója.
     * @returns A felhasználó tárgyainak listája.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
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

    /**
     * Lekéri a felhasználó tárgy gyűjteményét.
     * @param userId - A felhasználó azonosítója.
     * @returns A felhasználó tárgy gyűjteménye.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async getInventoryCollection(userId: number) {
        try {
            const allItems = await this.getAllInventoryItems();
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

    /**
     * Lekéri a felhasználó achievementjeit az adatbázisból.
     * @param userId - A felhasználó azonosítója.
     * @returns A felhasználó achievementjeinek listája.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
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

    /**
     * Lekéri a felhasználó achievement gyűjteményét.
     * @param userId - A felhasználó azonosítója.
     * @returns A felhasználó achievement gyűjteménye.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async getAchievements(userId: number) {
        try {
            const allAchievements = await this.getAllAchievements();
            const ownedAchievements = await this.getUsersAchievements(userId);
            return allAchievements
                .map(achievement => {
                    const ownedAchievement = ownedAchievements.find(owned => owned.achievements.id === achievement.id);
                    if((
                        !ownedAchievement && achievement.parent_achievement
                    ) || (
                        achievement.child_achievement && achievement.goal <= ownedAchievement?.progress
                    ) || (
                        achievement.parent_achievement && achievement.parent_achievement.goal > ownedAchievements.find(owned => owned.achievements.id === achievement.parent_achievement.id)?.progress
                    )) return null;
                    if(achievement.parent_achievement){
                        achievement.title = achievement.parent_achievement.title
                    }
                    if(achievement.is_secret && (achievement.goal > ownedAchievement?.progress || !ownedAchievement)){
                        return {
                            id: null,
                            icon: "achievements/Secret.png",
                            title: "???",
                            description: "???",
                            goal: null,
                            rarity: 2,
                            progress: null,
                            collected: false
                        }
                    }
                    return {
                        id: achievement.id,
                        icon: `achievements/${achievement.icon}`,
                        title: achievement.title,
                        description: achievement.description,
                        goal: achievement.goal,
                        rarity: achievement.is_secret ? 2 : 1,
                        progress: ownedAchievement?.progress || 0,
                        collected: !!achievement.parent_achievement || achievement.goal <= ownedAchievement?.progress
                    }
                }).filter(Boolean).sort((a, b) => {
                    if (a.rarity === 2 && !a.collected) return 1;
                    if (b.rarity === 2 && !b.collected) return -1;
                
                    if (a.collected && !b.collected) return -1;
                    if (b.collected && !a.collected) return 1;
                
                    const aProgress = a.goal ? (a.progress / a.goal) : 0;
                    const bProgress = b.goal ? (b.progress / b.goal) : 0;
                
                    return bProgress - aProgress;
                });
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Frissíti a felhasználó profilját.
     * @param authHeader - Az autorizációs fejléc, amely tartalmazza a Bearer tokent.
     * @param profile - A frissítendő profil adatai.
     * @returns A frissített profil adatai.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async updateProfile(authHeader: string, profile: ProfileAssetsDataDto) {
        try {
            const userId = (await this.tokenService.validateBearerToken(authHeader));

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

    /**
     * Tárgy hozzáadása a felhasználó gyűjteményéhez.
     * @param userId - A felhasználó azonosítója.
     * @param item - A hozzáadandó tárgy.
     * @param clientId - A kliens azonosítója.
     * @returns A hozzáadás eredménye.
     * @throws HttpException - Ha hiba történik az adatlekérdezés során.
     */
    async addItemToCollection(user: User, item: IItem): Promise<{ added: boolean, event: { name: string, targets: Array<string> } }> {
        try {
            if (!user.isGuest) {
                // Utána használd fel a megtalált ID-t a create() hívásban
                const addedItem = await this.prisma.users_collections.create({
                    data: {
                        user: user.id,
                        collection: item.id  // Csak az ID-t adjuk át
                    }
                });

                let event;
                if (addedItem) {
                    event = {
                        name: "collect",
                        targets: ["any"]
                    };
                    if (item.name.split(" ")[1] === "Axe") {
                        event.targets.push("axe");
                    }
                }
                return { added: !!addedItem, event: event };
            }
        } catch (error) {
            console.log("Már megszerzett tárgy!");
        }
    }
}
