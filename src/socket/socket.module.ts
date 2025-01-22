import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '../cache/cache.module';
import { GameModule } from '../game/game.module';

@Module({
    imports: [
        UsersModule,
        CacheModule,
        GameModule,
    ],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule { }

