import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { fetchGameModesWithLastUnsolvedGame } from './utilities/gamemode.util';

@Injectable()
export class GameService {
    constructor(private readonly prisma: PrismaService) {}

    async getGameModesWithLastUnsolvedGame(token: string) {
        try {
            return await fetchGameModesWithLastUnsolvedGame(this.prisma, token);
          } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.UNAUTHORIZED);
          }
    }
}
