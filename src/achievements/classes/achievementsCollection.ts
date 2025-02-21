import { PrismaService } from 'src/prisma/prisma.service';
import { IAchievement } from '../interfaces/achievement.interface';
import { Game } from 'src/game/classes/game.class';
import { ITip } from 'src/tip/interfaces/tip.interface';
import { getStreak } from 'src/users/utilities/user.util';
import { User } from 'src/users/classes/user.class';
import { Recipe } from 'src/recipes/classes/recipe.class';
import { CacheService } from 'src/cache/cache.service';
import { RecipesService } from 'src/recipes/recipes.service';
import { createMatrixFromArray } from 'src/sharedComponents/utilities/array.util';
import { formatDate, getCurrentDate } from 'src/sharedComponents/utilities/date.util';

export class AchievementsCollection {

    achievementList: IAchievement[] = [];

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    addTemporalAchievementToList(title: string, description: string, src: string, rarity: number, route: number, user: User) {
        if(!user.isGuest || title == "Riddle solved!") {
            this.achievementList.push(this.generateTemporalAchievement(title, description, src, rarity, route));
        }
    }

    generateTemporalAchievement(title: string, description: string, src: string, rarity: number, route: number): IAchievement {
        const routeMap = {
            0: "achievements",
            1: "profilePictures",
            2: "profileBorders",
            3: "items",
        }
        return {
            title: title,
            description: description,
            icon: routeMap[route] + "/" + src,
            rarity: rarity
        }
    }

    async watchSpecialSolveCases(game: Game, userId: number): Promise<string[]> {
        let additionalTargets = [];
        
        // Ellenőrizzük, hogy az év első órájában történt-e a megoldás
        const solvedAt = getCurrentDate();
        if (solvedAt.getHours() === 0 && solvedAt.getDate() === 1 && solvedAt.getMonth() === 0) {
            additionalTargets.push("first");
        }

        if(game.riddle.gamemode == 3) {
            const today = getCurrentDate();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));
            
            const firstGame = await this.prisma.games.findFirst({
                where: {
                    is_solved: true,
                    type: 3,
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
                orderBy: {
                    date: 'asc',
                },
            });
            console.log(firstGame)
            if(firstGame?.player === userId){
                additionalTargets.push("number1");
            };
        }
    
        if (Number(game.riddle.gamemode) == 6) {
            const foods = ["cake0", "cookie0", "goldenApple0", "goldenCarrot0", "pumpkinPie0", "mushroomStew0", "rabbitStew0", "beetrootSoup0", "suspiciousStew0"];
            if (foods.includes(game.riddle.recipeGroup)) {
                additionalTargets.push("food");
            }
        } else if (Number(game.riddle.gamemode) == 3) {
            if (await getStreak(userId, this.prisma) >= 365) {
                additionalTargets.push("365");
            }
        }
        if (game.riddle.numberOfGuesses == 1) {
            additionalTargets.push("zero");
        }
        
        let chickenMaterialsCount = 0;
        const chickenMaterials = ["egg", "feather"];
        let notWaxedRecipesCount = 0;
        
        game.riddle.tips.forEach(tip => {
            if (!tip.item.id.includes("waxed")) {
                notWaxedRecipesCount++;
            }
            for (const slot of tip.table) {
                if (slot && chickenMaterials.includes(slot.item)) {
                    chickenMaterialsCount++;
                    break;
                }
            }
        });
        
        if (chickenMaterialsCount >= 5) {
            additionalTargets.push("chicken");
        }
        if (notWaxedRecipesCount <= 1 && game.riddle.numberOfGuesses > 1) {
            additionalTargets.push("copper");
        }
        
        return additionalTargets;
    }
    

    watchSpecialCraftCases(tip: ITip): string[] {
        let additionalTargets = []
        //későbbi egyedi esetek
        return additionalTargets
    }

    async achievementEventListener(user: User, events: Array<{ name: string, targets: string[] }>, game?: Game, tip?: ITip) {
        if (!user.isGuest) {
            for (const event of events) {
                switch (event.name) {
                    case "solve":
                        event.targets = event.targets.concat(await this.watchSpecialSolveCases(game, user.id));
                        break;
                    case "craft":
                        //event.targets = event.targets.concat(this.watchSpecialCraftCases(tip));
                        break;
                }
            }

            // Várjuk meg az összes updateAchievementProgress lefutását!
            await Promise.all(events.flatMap(event =>
                event.targets.map((target) => this.updateAchievementProgress(user.id, event.name, target))
            ));
        }
    }

    async updateAchievementProgress(userId: number, event: string, target: string | null, increment: number = 1) {
        // Achievementek lekérdezése a megadott event és target alapján
        const achievements = await this.prisma.achievements.findMany({
            where: {
                event: event,
                target: target
            }
        });

        for (const achievement of achievements) {
            // Felhasználói progressz lekérdezése vagy létrehozása
            const userAchievement = await this.prisma.users_achievements.findUnique({
                where: {
                    user_achievement: {
                        user: userId,
                        achievement: achievement.id
                    }
                }
            });

            // Ha a felhasználó már megszerezte az achievementet, skipeljük
            if (userAchievement && userAchievement.progress >= achievement.goal) {
                continue;
            }

            // Ha még nem teljesítette, akkor növeljük a progresszt
            await this.prisma.users_achievements.upsert({
                where: {
                    user_achievement: {
                        user: userId,
                        achievement: achievement.id
                    }
                },
                update: {
                    progress: {
                        increment: increment
                    }
                },
                create: {
                    user: userId,
                    achievement: achievement.id,
                    progress: increment
                }
            });

            // Ha a progressz elérte a célt, a felhasználó megkapja az achievementet
            if (userAchievement?.progress + increment >= achievement.goal || achievement.goal == 1) {
                // Adjunk hozzá a már megszerzett achievementek listájához
                this.achievementList.push(this.generateTemporalAchievement(
                    "Achievement unlocked!",
                    achievement.title,
                    achievement.icon,
                    achievement.is_secret ? 1 : 2,
                    0
                ));

                await this.giveRewards(achievement.id, userId);
            }
        }
    }

    async giveRewards(achievementId: number, userId: number) {
        const rewards = await this.prisma.rewards.findMany({
            where: {
                achievement: achievementId
            }
        });

        await Promise.all(rewards.map(async (reward) => {
            let result;
            if (reward.reward_type == 1) {
                // Profilkép hozzáadása
                result = this.prisma.users_profile_pictures.create({
                    data: {
                        user: userId,
                        profile_picture: reward.reward,
                        is_set: false
                    }
                });
            } else {
                // Profilkeret hozzáadása
                result = this.prisma.users_profile_borders.create({
                    data: {
                        user: userId,
                        profile_border: reward.reward,
                        is_set: false
                    }
                });
            }

            const rewardData = await this.findDataOfTemporaryAchievement(reward.reward, reward.reward_type);
            this.achievementList.push(this.generateTemporalAchievement("Reward collected!", rewardData.name, rewardData.src, 0, reward.reward_type));
            return result;
        }));
    }

    async findDataOfTemporaryAchievement(id: number, rewardType: number) {
        switch (rewardType) {
            case 0:
                return await this.prisma.items.findUnique({ where: { id: id } });
            case 1:
                return await this.prisma.profile_pictures.findUnique({ where: { id: id } });
            case 2:
                return await this.prisma.profile_borders.findUnique({ where: { id: id } });
            default:
                throw new Error('Invalid reward type');
        }
    }
}