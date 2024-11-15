import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { GameService } from './game.service';
import { TokenValidationService } from '../shared/utilities/token-validation.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService,
              private readonly tokenValidation: TokenValidationService
  ) {}

  @Get('singleplayer')
  async getGameModesWithLastUnsolvedGame(@Headers('authorization') authorization: string) {
    try{
      const user = await this.tokenValidation.bearerTokenValidation(authorization);
      
      return await this.gameService.getGameModesWithLastUnsolvedGame(user.id);
    }catch(err){
      throw new UnauthorizedException();
    }
  }
}