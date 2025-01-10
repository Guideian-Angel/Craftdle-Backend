import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { SharedModule } from './shared/shared.module';
import { RiddleModule } from './riddle/riddle.module';
import { AssetsModule } from './assets/assets.module';
import { CacheService } from './cache/cache.service';
import { SocketGateway } from './socket/socket.gateway';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [UsersModule, GameModule, SharedModule, RiddleModule, AssetsModule, CacheService, CacheModule],
  controllers: [AppController],
  providers: [AppService, CacheService, SocketGateway],
})
export class AppModule {}
