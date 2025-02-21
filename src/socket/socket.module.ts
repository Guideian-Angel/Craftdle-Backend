import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '../cache/cache.module';
import { GameModule } from '../game/game.module';
import { Maintenance } from 'src/admin/classes/Maintenance';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
    imports: [
        UsersModule,
        CacheModule,
        GameModule,
        AchievementsModule,
        PrismaModule,
        CacheModule,
        RecipesModule
    ],
    providers: [SocketGateway, Maintenance],
    exports: [SocketGateway],
})
export class SocketModule { }