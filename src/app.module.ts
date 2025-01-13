import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { SharedModule } from './shared/shared.module';
import { AssetsModule } from './assets/assets.module';
import { CacheModule } from './cache/cache.module';
import { SocketGateway } from './socket/socket.gateway';
import { UsersService } from './users/users.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, GameModule, SharedModule, AssetsModule, CacheModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, SocketGateway, UsersService],
})
export class AppModule {}
