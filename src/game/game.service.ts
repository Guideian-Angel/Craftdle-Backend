import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { fetchGameModesWithLastUnsolvedGame } from './utilities/gamemodesFetching';
import { IGamemode } from './interfaces/IGamemode';
import tokenValidation from '../shared/utilities/tokenValidation';
import { Game } from './classes/Game';
import { Riddle } from './classes/Riddle';
import { IItem } from './interfaces/IItem';
import { ICheckedTip } from './interfaces/ICheckedTip';
import { getCurrentDate } from 'src/shared/utilities/CurrentDate';

@Injectable()
export class GameService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getGameModesWithLastUnsolvedGame(authorization: string): Promise<IGamemode[]> {
        try {
            const user = await tokenValidation.validateBearerToken(authorization, this.prisma);
            if (!user) {
                throw new UnauthorizedException('Authorization header is required');
            }
            return await fetchGameModesWithLastUnsolvedGame(this.prisma, user.id);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }

    async changeGameStatus(gameId: number) {
        this.prisma.games.update({
            where: { id: gameId },
            data: {
                is_solved: true
            }
        })
    }

    async saveGame(game: Game) {
        const gameRecord = await this.prisma.games.create({
            data: {
                type: Number(game.riddle.gamemode),
                player: game.user.id,
                riddle: game.riddle.recipeGroup,
                date: new Date(),
                is_solved: game.riddle.solved,
            },
        });
        await this.saveHints(game.riddle, gameRecord.id);
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
                    item: item.dbId
                }
            })
        })
    }

    async saveTip(tip: ICheckedTip, gameId: number) {
        const tipRecord = await this.prisma.tips.create({
            data: {
                game: gameId,
                date: new Date(),
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
                        content: slot.item[0],
                        status: slot.status == "wrong" ? 3 : slot.status == "semi-correct" ? 2 : 1
                    }
                });
            };
        });
    }

    async getUsersGames(userId: number) {
        return await this.prisma.games.findMany({
            select: {
                date: true,
                is_solved: true,
                gamemodes: {
                    select: {
                        id: true,
                        name: true,
                        difficulties: {
                            select: {
                                id: true,
                                color_code: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        tips: true
                    }
                }
            },
            where: {
                player: userId
            }
        });
    }

    async sortGames(userId: number) {
        const games = {};
        const userGames = await this.getUsersGames(userId);
        userGames.forEach(game => {
            if (games[game.gamemodes.id]) {
                games[game.gamemodes.id].played++;
                if (game.is_solved) {
                    games[game.gamemodes.id].solved++;
                    if (game._count.tips > 0) {
                        if (
                            games[game.gamemodes.id].fastestSolve === null ||
                            game._count.tips < games[game.gamemodes.id].fastestSolve
                        ) {
                            games[game.gamemodes.id].fastestSolve = game._count.tips;
                        }
                    }
                }
            } else {
                games[game.gamemodes.id] = {
                    gamemodeName: game.gamemodes.name,
                    played: 1,
                    solved: game.is_solved ? 1 : 0,
                    fastestSolve: game.is_solved && game._count.tips > 0 ? game._count.tips : null,
                    color: game.gamemodes.difficulties.color_code
                };
            }
        });
        return Object.keys(games).sort().map(key => games[key]);
    }

    async getStreak(userId: number) {
        const playedDailyGames = await this.prisma.games.findMany({
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
        lastDate.setHours(0, 0, 0, 0);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        if (lastDate.getTime() > yesterday.getTime()) {
            for (let game of playedDailyGames) {
                const gameDate = new Date(game.date);
                gameDate.setHours(0, 0, 0, 0);
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
}