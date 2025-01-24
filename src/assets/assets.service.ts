import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaService) { }

    getPicture(type: string, src: string) {

    }

    async getAllProfilePictures() {
        try {
            return await this.prisma.profile_pictures.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
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
            const allProfilePictures = await this.getAllProfilePictures();
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
            });
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

    async getAllProfileBorders() {
        try {
            return await this.prisma.profile_borders.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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
                    active: owned?.is_set
                }
            });
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

    async getAllInventoryItems() {
        try {
            return await this.prisma.collections.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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
            });
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

    getAllAchievements() {
        try {
            return this.prisma.achievements.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAchievements(userId: number) {
        try {
            const allAchievements = await this.getAllAchievements();
            const ownedAchievements = await this.getUsersAchievements(userId);
            return allAchievements
                .map(achievement => {
                    const owned = ownedAchievements.find(owned => owned.achievements.id === achievement.id);
                    const progress = owned?.progress || 0;

                    // Ha titkos az achievement, helyettesítő adatokat állítunk be
                    if (achievement.is_secret && !owned) {
                        return {
                            id: achievement.id,
                            icon: "Secret.png",
                            title: "???",
                            description: "???",
                            goal: null,
                            progress: null,
                            rarity: 2,
                            is_owned: true
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
                        is_owned: false
                    };
                })
                .sort((a, b) => {
                    // Titkos achievementek kerüljenek a lista végére
                    if (a.is_owned && b.is_owned) return 0; // Mindkettő titkos
                    if (a.is_owned) return 1; // `a` titkos, tehát mögé kerül
                    if (b.is_owned) return -1; // `b` titkos, tehát elé kerül

                    // Normál achievementeknél a progress alapján rendezünk
                    const aProgress = a.goal ? (a.progress / a.goal) : 0;
                    const bProgress = b.goal ? (b.progress / b.goal) : 0;
                    return bProgress - aProgress; // Csökkenő sorrendben
                });

        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
