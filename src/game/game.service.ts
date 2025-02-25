import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { IGamemode } from './interfaces/gamemode.interface';
import { User } from 'src/users/classes/user.class';
import { IItem } from 'src/sharedComponents/interfaces/item.interface';
import { ICheckedTip } from 'src/tip/interfaces/tip.interface';
import { Game } from './classes/game.class';
import { Riddle } from 'src/riddles/classes/riddle.class';
import { UsersService } from 'src/users/users.service';
import { formatDate, getCurrentDate } from 'src/sharedComponents/utilities/date.util';

@Injectable()
export class GameService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService
    ) { }

    async getGameModesWithLastUnsolvedGame(authorization: string): Promise<IGamemode[]> {
        try {
            const user = await this.tokenService.validateBearerToken(authorization);
            if (!user) {
                throw new UnauthorizedException('Authorization header is required');
            }
            return await this.fetchGameModesWithLastUnsolvedGame(user);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }

    async getGameById(gameId: number) {
        return await this.prisma.games.findUnique({
            where: {
                id: gameId
            }
        });
    }

    //######################################################### LOAD GAME FUNCTIONS #########################################################

    async loadLastGame(user: User, gamemode: number) {
        const lastGames = await this.getLastGameByGamemode(user.id);
        return await this.getGameById(lastGames[gamemode].id);
    };

    async loadInventory(gameId: number): Promise<IItem[]> {
        const inventory = await this.prisma.inventories_items.findMany({
            where: {
                game: gameId
            },
            include: {
                items: true
            }
        });

        return inventory.map(entry => {
            const item = entry.items;
            if (!item) throw new Error("Item not found!");

            return {
                id: item.item_id,
                name: item.name,
                src: item.src
            };
        });
    }

    async loadHints(gameId: number): Promise<string[]> {
        const hints = await this.prisma.hints.findMany({
            where: {
                game: gameId
            },
            select: {
                content: true,
                number: true
            }
        });
        return hints.sort((a, b) => a.number - b.number).map(hint => hint.content);
    }

    async loadTips(gameId: number): Promise<ICheckedTip[]> {
        const tips = await this.prisma.tips.findMany({
            where: {
                game: gameId
            },
            include: {
                collections: true,
                crafting_table_slots: {
                    include: {
                        guess_types: true,
                    }
                }
            }
        });

        return tips.map(tip => {
            // Kezdetben létrehozzuk a table-t, ami 9 null értékű elem
            const table = new Array(9).fill(null);

            // A table feltöltése a megfelelő slot.position értékek alapján
            tip.crafting_table_slots.forEach(slot => {
                // Slot position alapján beállítjuk az itemet a megfelelő indexre
                if (slot.position >= 0 && slot.position < 9) {
                    table[slot.position] = {
                        item: slot.content,
                        status: slot.guess_types.type
                    };
                }
            });

            return {
                item: {
                    id: tip.item,
                    name: tip.collections.name,
                    src: tip.collections.src
                },
                table: table,  // A 9 elemű table, ami már tartalmazza a pozíciókat
                date: tip.date
            };
        });
    }

    //######################################################### SAVE GAME FUNCTIONS #########################################################

    async changeGameStatus(gameId: number) {
        this.prisma.games.update({
            where: { id: gameId },
            data: {
                is_solved: true
            }
        }).catch(error => {
            console.error("Hiba történt a játék állapotának frissítésekor:", error);
        });
    }

    async deleteAllUnnecessaryGamesDataByUser(userId: number) {
        const gamemodes = await this.prisma.gamemodes.findMany();
        gamemodes.forEach(async (gamemode) => {
            await this.deleteUnnecessaryGamesDataByUser(userId, gamemode.id)
        });
    }

    async deleteUnnecessaryGamesDataByUser(userId: number, gamemode: number) {
        const lastGame = await this.prisma.games.findFirst({
            select: {
                id: true,
                tips: { select: { id: true } },
                hints: { select: { id: true } },
                inventories_items: { select: { id: true } }
            },
            where: { player: userId, type: gamemode },
            orderBy: { date: 'desc' }
        });

        if (!lastGame) return;

        if (lastGame.tips.length === 0) {
            await this.prisma.games.delete({ where: { id: lastGame.id } });
        } else {
            for (const tip of lastGame.tips) {
                await this.prisma.crafting_table_slots.deleteMany({ where: { tip: tip.id } });
            }
            for (const hint of lastGame.hints) {
                await this.prisma.hints.delete({ where: { id: hint.id } });
            }
            for (const inventory of lastGame.inventories_items) {
                await this.prisma.inventories_items.delete({ where: { id: inventory.id } });
            }
        }
    }

    async saveGame(game: Game) {
        const gameRecord = await this.prisma.games.create({
            data: {
                type: Number(game.riddle.gamemode),
                player: game.user.id,
                riddle: game.riddle.recipeGroup,
                date: getCurrentDate(),
                is_solved: game.riddle.solved,
            },
        });
        if (game.riddle.gamemode != 7) {
            await this.saveHints(game.riddle, gameRecord.id);
        }
        if (game.riddle.gamemode == 6) {
            this.saveInventory(game.riddle.inventory, gameRecord.id);
        }
        return gameRecord.id;
    }

    async saveHints(riddle: Riddle, gameId: number) {
        riddle.hints.forEach(async (hint, index) => {
            await this.prisma.hints.create({
                data: {
                    game: gameId,
                    number: index,
                    content: hint
                }
            });
        });
    }

    saveInventory(items: IItem[], gameId: number) {
        items.forEach(async (item) => {
            await this.prisma.inventories_items.create({
                data: {
                    game: gameId,
                    item: item.id
                }
            })
        })
    }

    async saveTip(tip: ICheckedTip, gameId: number) {
        const tipRecord = await this.prisma.tips.create({
            data: {
                game: gameId,
                date: getCurrentDate(),
                item: tip.item.id
            }
        });
        await this.saveCraftingTableContent(tip, tipRecord.id);
    }

    async saveCraftingTableContent(tip: ICheckedTip, tipId: number) {
        tip.table.forEach(async (slot, index) => {
            if (slot) {
                await this.prisma.crafting_table_slots.create({
                    data: {
                        tip: tipId,
                        position: index,
                        content: slot.item,
                        status: slot.status == "wrong" ? 3 : slot.status == "semi-correct" ? 2 : 1
                    }
                });
            };
        });
    }



    //######################################################### GAMEMODE RELATED FUNCTIONS #########################################################



    async getGamemodes() {
        return await this.prisma.gamemodes.findMany({
            include: {
                difficulties: true
            }
        });
    }

    async getLastGameByGamemode(userId: number) {
        const games = await this.prisma.games.findMany({
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
                acc[game.type] = { id: game.id, solved: game.is_solved };
            }
            return acc;
        }, {} as Record<number, { id: number, solved: boolean }>);
    }

    async checkSolvedTutorialGame(userId: number) {
        const solvedTutorialGame = await this.prisma.games.findFirst({
            where: {
                player: userId,
                type: 1,
                is_solved: true
            }
        });
        return solvedTutorialGame ? true : false;
    }

    async fetchGameModesWithLastUnsolvedGame(
        userId: number
    ): Promise<IGamemode[]> {
        try {
            const [gamemodes, lastGameStatusByGamemode] = await Promise.all([
                this.getGamemodes(),
                this.getLastGameByGamemode(userId)
            ]);

            return await Promise.all(
                gamemodes.map(async (gamemode) => {
                    const lastGameUnsolved = !lastGameStatusByGamemode[gamemode.id]
                        ? false
                        : lastGameStatusByGamemode[gamemode.id].solved === false;

                    return {
                        id: gamemode.id,
                        icon: gamemode.icon,
                        name: gamemode.name,
                        description: gamemode.description,
                        difficulty: {
                            name: gamemode.difficulties.name,
                            color: gamemode.difficulties.color_code
                        },
                        continueGame: lastGameUnsolved,
                        playedBefore: gamemode.id == 1
                            ? await this.checkSolvedTutorialGame(userId)
                            : null
                    };
                })
            );
        } catch (error) {
            console.error("Error in fetchGameModesWithLastUnsolvedGame:", error);
            throw new Error("Failed to fetch game modes with the last unsolved game.");
        }
    }

    async getLastGameDate(userId: number) {
        const lastGame = await this.prisma.games.findFirst({
            where: {
                player: userId
            },
            orderBy: {
                date: 'desc'
            }
        });
        return lastGame ? lastGame.date : "This player did not play any games yet.";
    }

    async getFavoriteGamemode(userId: number) {
        const gamemodes = await this.usersService.sortGames(userId);
        return gamemodes.reduce((favorite, gamemode) =>
            gamemode.played > favorite.played ? gamemode : favorite, gamemodes[0]);
    }

    async getUserStatistics(userId: number) {
        const games = await this.usersService.getUsersGames(userId);
        const statistics: { [key: string]: { [key: string]: number } } = {};

        games.forEach(game => {
            const date = formatDate(game.date);
            if (!statistics[date]) {
                statistics[date] = {};
            }
            statistics[date][game.gamemodes.name] = (statistics[date][game.gamemodes.name] || 0) + 1;
        });

        return statistics;
    }
}