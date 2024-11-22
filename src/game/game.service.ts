import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { fetchGameModesWithLastUnsolvedGame } from './utilities/GamemodesFetching';
import { IGamemode } from './interfaces/IGamemode';
import tokenValidation from '../shared/utilities/TokenValidation';

@Injectable()
export class GameService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getGameModesWithLastUnsolvedGame(authorization: string): Promise<IGamemode[]> {
        try {
            const user = await tokenValidation.validateBearerToken(authorization, this.prisma);
            return await fetchGameModesWithLastUnsolvedGame(this.prisma, user.id);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }
}