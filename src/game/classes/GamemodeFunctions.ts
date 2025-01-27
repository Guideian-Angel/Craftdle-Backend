import { PrismaService } from '../../prisma/prisma.service';
import { IGamemode } from '../interfaces/IGamemode';

export class GamemodeFunctions {
    private static async getGamemodes(prisma: PrismaService) {
        return await prisma.gamemodes.findMany({
            include: {
                difficulties: true
            }
        });
    }

    static async getLastGameByGamemode(prisma: PrismaService, userId: number) {
        const games = await prisma.games.findMany({
            where: {
                player: userId
            },
            orderBy: {
                date: 'desc'
            },
            select: {
                id: true,
                type: true,
                is_solved: true
            },
        });

        return games.reduce((acc, game) => {
            if (!acc[game.type]) {
                acc[game.type] = {id: game.id ,solved: game.is_solved};
            }
            return acc;
        }, {} as Record<number, {id: number, solved: boolean}>);
    }

    static async fetchGameModesWithLastUnsolvedGame(
        prisma: PrismaService,
        userId: number
    ): Promise<IGamemode[]> {
        try {
            const [gamemodes, lastGameStatusByGamemode] = await Promise.all([
                this.getGamemodes(prisma),
                this.getLastGameByGamemode(prisma, userId)
            ]);

            return gamemodes.map((gamemode) => {
                const lastGameUnsolved = !lastGameStatusByGamemode[gamemode.id]? false: lastGameStatusByGamemode[gamemode.id].solved === false;

                return {
                    id: gamemode.id,
                    icon: gamemode.icon,
                    name: gamemode.name,
                    description: gamemode.description,
                    difficulty: {
                        name: gamemode.difficulties.name,
                        color: gamemode.difficulties.color_code
                    },
                    continueGame: lastGameUnsolved
                };
            })
        } catch (error) {
            console.error("Error in fetchGameModesWithLastUnsolvedGame:", error);
            throw new Error("Failed to fetch game modes with the last unsolved game.");
        }
    }
}