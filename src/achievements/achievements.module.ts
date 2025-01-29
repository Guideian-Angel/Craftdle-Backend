import { Module } from '@nestjs/common';
import { AchievementManager } from './AchievementManager';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';
import { GameModule } from 'src/game/game.module';
import { AchievementsGateway } from './achievements.gateway';

@Module({
    imports: [PrismaModule, CacheModule, GameModule],
    providers: [AchievementManager, AchievementsGateway],
    exports: [AchievementManager, AchievementsGateway]
})
export class AchievementsModule {}
