import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IAchievement } from "./interfaces/IAchievement";

@Injectable()
export class AchievementManager {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    generateTemporalAchievement(title: string, description: string, src: string, rarity: number) : IAchievement{
        return {
            title: title,
            description:description,
            icon: src,
            rarity: rarity
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
    
        let unlockedAchievements: IAchievement[] = []; // Ide fogjuk gyűjteni a már megszerzett achievementeket.
    
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
            if (userAchievement?.progress + increment >= achievement.goal) {
                // Achievment unlocked logika
                await this.giveRewards(achievement.id, userId);
                console.log(`Achievement unlocked: ${achievement.title}`);
    
                // Adjunk hozzá a már megszerzett achievementek listájához
                unlockedAchievements.push(this.generateTemporalAchievement(
                    achievement.title,
                    achievement.description,
                    achievement.icon,
                    achievement.is_secret ? 1 : 2
                ));
            }
        }
    
        // Ha voltak megszerzett achievementek, küldjük vissza őket
        if (unlockedAchievements.length > 0) {
            return unlockedAchievements;
        }
    
        // Ha nem volt új achievement, visszaadhatsz valami mást vagy semmit
        return null;
    }

    async giveRewards(achievementId: number, userId: number){
        const rewards = await this.prisma.rewards.findMany({
            where: {
                achievement: achievementId
            }
        });
        rewards.map((reward) => {
            if (reward.reward_type === 1) {
                // Profilkép hozzáadása
                return this.prisma.users_profile_pictures.create({
                    data: {
                        user: userId,
                        profile_picture: reward.reward,
                        is_set: false
                    }
                });
            } else {
                // Profilkeret hozzáadása
                return this.prisma.users_profile_borders.create({
                    data: {
                        user: userId,
                        profile_border: reward.reward,
                        is_set: false
                    }
                });
            }
        })
    }
}