import { PrismaService } from '../../prisma/prisma.service';
import { IGamemode, IGamemodeWithDifficulties } from '../interfaces/IGamemode';

async function getGamemodes(prisma: PrismaService,): Promise<IGamemodeWithDifficulties[]> {
    return await prisma.gamemodes.findMany({
        include: {
            difficulties: true
        }
    });
}

async function getLastUnsolvedGame(prisma: PrismaService, userId: number) {
    return await prisma.games.findFirst({
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
}

export async function fetchGameModesWithLastUnsolvedGame(
    prisma: PrismaService,
    userId: number
): Promise<IGamemode[]> {
    try {
        const [gamemodes, lastUnsolvedGame] = await Promise.all([
            getGamemodes(prisma),
            getLastUnsolvedGame(prisma, userId)
        ]);

        console.log(lastUnsolvedGame);

        return gamemodes.map((gamemode) => ({
            id: gamemode.id,
            icon: gamemode.icon,
            name: gamemode.name,
            description: gamemode.description,
            difficulty: {
                name: gamemode.difficulties.name,
                color_code: gamemode.difficulties.color_code
            },
            continueGame: lastUnsolvedGame ? lastUnsolvedGame.type === gamemode.difficulties.id : false
        }));
    } catch (error) {
        console.error("Error in fetchGameModesWithLastUnsolvedGame:", error);
        throw new Error("Failed to fetch game modes with the last unsolved game.");
    }
}