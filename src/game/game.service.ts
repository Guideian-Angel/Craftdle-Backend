import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamemodeFunctions } from './classes/GamemodeFunctions';
import { IGamemode } from './interfaces/IGamemode';
import tokenValidation from '../shared/utilities/tokenValidation';
import { Game } from './classes/Game';
import { Riddle } from './classes/Riddle';
import { IItem } from './interfaces/IItem';
import { ICheckedTip } from './interfaces/ICheckedTip';
import { getCurrentDate } from 'src/shared/utilities/CurrentDate';
import { User } from 'src/users/classes/user';
import { get } from 'http';

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
}