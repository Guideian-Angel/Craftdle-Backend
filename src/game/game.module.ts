// game/game.module.ts
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { SharedModule } from '../shared/shared.module';
import { GameController } from './game.controller';

@Module({
    imports: [SharedModule],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService],
})
export class GameModule {}
