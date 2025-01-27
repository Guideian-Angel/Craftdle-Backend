// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "src/prisma/prisma.service"
// import { User } from "src/users/classes/user";

// @Injectable()
// export class AchievementManager {
//     constructor(private readonly prisma: PrismaService) { }

//     async getAvailableAchievements(ids: number[], userId: number){
//         const achievements = await this.prisma.achievements.findMany({
//             where: {
//                 id: {
//                     in: ids
//                 }
//             }
//         });
//         const achieved = await this.prisma.users_achievements.findMany({
//             select: achievement,
//             where: {user: userId}
//         })
//         return achievements.filter(achiement => !achieved.includes(achiement.id))
//     }

//     // async getAllAchievements(user: User){
//     //     const achievements = await this.prisma.achievements.findMany();
//     //     const achieved = await this.prisma.users_achievements.findMany({
//     //         where: {user: user.id}
//     //     })
//     //     let results = [];
//     //     achievements.forEach(achievement => {
//     //         const collected;
//     //         results.push({
//     //             title: achievement.title,
//     //             description: !achievement.is_secret || collected? achievement.description: "???",
//     //             icon: achievement.icon,
//     //             progress: calculateProgress(user),
//     //             goal: achievement.goal,
//     //             rarity: Boolean(achievement.is_secret)? 1: 2
//     //         })
//     //     })
//     // }

//     async calculateProgress(user: User){

//     }
// }