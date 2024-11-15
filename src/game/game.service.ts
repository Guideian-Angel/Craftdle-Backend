// game/game.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokenValidationService } from '../shared/utilities/token-validation.service';
import { fetchGameModesWithLastUnsolvedGame } from './utilities/gamemode.util';

@Injectable()
export class GameService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tokenValidation: TokenValidationService
    ) {}

    async getGameModesWithLastUnsolvedGame(token: string) {
        try {
            const user = await this.tokenValidation.validateToken(token);
            console.log(user)
            if (!user) {
                throw new HttpException("Invalid token.", HttpStatus.UNAUTHORIZED);
            }

            return await fetchGameModesWithLastUnsolvedGame(this.prisma, user.id);
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
        }
    }
}
