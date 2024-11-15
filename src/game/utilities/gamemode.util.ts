import { PrismaService } from '../../prisma/prisma.service';
import { IGamemode } from '../interfaces/game-gamemode';

export async function fetchGameModesWithLastUnsolvedGame(
    prisma: PrismaService,
    userId: number
): Promise<IGamemode[]> {
    try {
        const gamemodes = await prisma.gamemodes.findMany({
            include: {
                difficulties: true
            }
        });

        const lastUnsolvedGame = await prisma.games.findFirst({
            where: {
                player: userId,
                is_solved: false
            },
            orderBy: {
                date: 'desc'
            },
            select: {
                type: true
            }
        });

        return gamemodes.map((gamemode) => ({
            id: gamemode.id,
            icon: gamemode.icon,
            name: gamemode.name,
            description: gamemode.description,
            difficulty: {
                name: gamemode.difficulties.name,
                color_code: gamemode.difficulties.color_code
            },
            continueGame: lastUnsolvedGame ? lastUnsolvedGame.type === gamemode.difficulty : false
        }));
    } catch (error) {
        console.error("Error in fetchGameModesWithLastUnsolvedGame:", error);
        throw new Error("Failed to fetch game modes with the last unsolved game.");
    }
}