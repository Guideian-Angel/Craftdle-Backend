import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';
import { GameModule } from 'src/game/game.module';
import { AchievementsGateway } from './achievements.gateway';

@Module({
    imports: [PrismaModule, CacheModule],
    providers: [AchievementsGateway],
    exports: [AchievementsGateway]
})
export class AchievementsModule {}
