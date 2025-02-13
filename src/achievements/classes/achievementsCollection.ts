import { PrismaService } from 'src/prisma/prisma.service';
import { IAchievement } from '../interfaces/achievement.interface';
import { Game } from 'src/game/classes/game.class';
import { ITip } from 'src/tip/interfaces/tip.interface';
import { getStreak } from 'src/users/utilities/user.util';

export class AchievementsCollection {

    achievementList: IAchievement[] = [];

    constructor(
        private readonly prisma: PrismaService
    ) {}

    addTemporalAchievementToList(title: string, description: string, src: string, rarity: number){
        this.achievementList.push(this.generateTemporalAchievement(title, description, src, rarity));
    }

    generateTemporalAchievement(title: string, description: string, src: string, rarity: number): IAchievement {
        return {
            title: title,
            description: description,
            icon: src,
            rarity: rarity
        }
    }

    async watchSpecialSolveCases(game: Game, userId: number): Promise<string[]> {
        let additionalTargets = []
        if (Number(game.riddle.gamemode) == 6) {
            const foods = ["cake0", "cookie0", "goldenApple0", "goldenCarrot0", "pumpkinPie0", "mushroomStew0", "rabbitStew0", "beetrootSoup0", "suspiciousStew0"]
            if (foods.includes(game.riddle.recipeGroup)) {
                additionalTargets.push("food");
            }
        } else if(Number(game.riddle.gamemode) == 3){
            if(await getStreak(userId, this.prisma) >= 365){
                additionalTargets.push("365");
            }
        }
        if (game.riddle.numberOfGuesses == 1) {
            additionalTargets.push("zero");
        }
        let chickenMaterialsCount = 0;
        const chickenMaterials = ["egg", "feather"]
        let notWaxedRecipesCount = 0;
        game.riddle.tips.forEach(tip => {
            if (!tip.item.id.includes("waxed")) {
                notWaxedRecipesCount++;
            }
            chickenMaterials.forEach(mat => {
                if (Object.keys(tip.table).includes(mat)) {
                    chickenMaterialsCount++;
                }
            })
        });
        if (chickenMaterialsCount >= 5) {
            additionalTargets.push("chicken")
        }
        if (notWaxedRecipesCount <= 1 && game.riddle.numberOfGuesses > 1) {
            additionalTargets.push("copper")
        }
        return additionalTargets;
    }

    watchSpecialCraftCases(tip: ITip): string[]{
        let additionalTargets = []
        // const gaRecipe: Recipe = this.cacheService.getCachedData('recipes')["gaLogo0"];
        // if(RecipeFunctions.compareShapedRecipes(gaRecipe.recipe, gaRecipe, createMatrixFromArray(tip.table), 3).solved){
        //     additionalTargets.push("ga");
        // }
        return additionalTargets
    }

    async achievementEventListener(userId: number, events: Array<{ name: string, targets: string[] }>, game?: Game, tip?: ITip) {

        for (const event of events) {
            switch (event.name) {
                case "solve":
                    event.targets = event.targets.concat(await this.watchSpecialSolveCases(game, userId));
                    break;
                case "craft":
                    event.targets = event.targets.concat(this.watchSpecialCraftCases(tip));
                    break;
            }
        }
    
        // Várjuk meg az összes updateAchievementProgress lefutását!
        await Promise.all(events.flatMap(event => 
            event.targets.map((target) => this.updateAchievementProgress(userId, event.name, target))
        ));
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
                    achievement.is_secret ? 1 : 2
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
            this.achievementList.push(this.generateTemporalAchievement("Reward collected!", rewardData.name, rewardData.src, 0));
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