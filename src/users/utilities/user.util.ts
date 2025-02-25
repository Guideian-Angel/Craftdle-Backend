import { HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { getCurrentDate } from "src/sharedComponents/utilities/date.util";

export async function getUserById(userId: number, prisma: PrismaService) {
    try {
        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) {
            throw new HttpException(`User with ID ${userId} not found.`, HttpStatus.NOT_FOUND);
        }
        return user;
    } catch (error) {
        throw new HttpException("Failed to retrieve user data.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function getStreak(userId: number, prisma: PrismaService) {
    const playedDailyGames = await prisma.games.findMany({
        where: {
            player: userId,
            is_solved: true,
            gamemodes: {
                name: "Daily"
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    let streak = 0;
    const uniqueDates = new Set<number>();
    let lastDate = new Date(playedDailyGames[0]?.date);
    lastDate.setHours(1, 0, 0, 0);
    const yesterday = getCurrentDate();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(1, 0, 0, 0);

    console.log(playedDailyGames);
    
    if (lastDate.getTime() >= yesterday.getTime()) {
        for (let game of playedDailyGames) {
            const gameDate = new Date(game.date);
            gameDate.setHours(1, 0, 0, 0);
            if (uniqueDates.has(gameDate.getTime())) {
                continue;
            }
            if (gameDate.getTime() !== lastDate.getTime()) {
                break;
            }
            uniqueDates.add(gameDate.getTime());
            streak++;
            lastDate.setDate(lastDate.getDate() - 1);
        }
    }
    return streak;
}