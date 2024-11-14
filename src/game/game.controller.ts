import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('singleplayer')
  async getGameModesWithLastUnsolvedGame(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    const response = await this.gameService.getGameModesWithLastUnsolvedGame(token);
    console.log(response);
    return response;
  }
}