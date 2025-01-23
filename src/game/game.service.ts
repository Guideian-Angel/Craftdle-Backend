import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { fetchGameModesWithLastUnsolvedGame } from './utilities/gamemodesFetching';
import { IGamemode } from './interfaces/IGamemode';
import tokenValidation from '../shared/utilities/tokenValidation';
import { Game } from './classes/Game';
import { Riddle } from './classes/Riddle';
import { IItem } from './interfaces/IItem';
import { ICheckedTip } from './interfaces/ICheckedTip';

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

    async changeGameStatus(gameId: number){
        this.prisma.games.update({
            where: {id: gameId},
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
        if(game.riddle.gamemode == 6){
            this.saveInventory(game.riddle.inventory, gameRecord.id);
        }
        return gameRecord.id;
    }

    async saveHints(riddle: Riddle, gameId: number){
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

    saveInventory(items: IItem[], gameId: number){
        items.forEach(async (item) => {
            await this.prisma.inventories_items.create({
                data: {
                    game: gameId,
                    item: item.dbId
                }
            })
        })
    }

    async saveTip(tip: ICheckedTip, gameId: number){
        const tipRecord = await this.prisma.tips.create({
            data: {
                game: gameId,
                date: new Date(),
                item: tip.item.id
            }
        });
        await this.saveCraftingTableContent(tip, tipRecord.id);
    }

    async saveCraftingTableContent(tip: ICheckedTip, tipId: number){
        tip.table.forEach(async (slot, index) => {
            if(slot){
                await this.prisma.crafting_table_slots.create({
                    data: {
                        tip: tipId,
                        position: index,
                        content: slot.item,
                        status: slot.status == "wrong"? 3: slot.status == "semi-correct"? 2: 1
                    }
                });
            };
        });
    }
}