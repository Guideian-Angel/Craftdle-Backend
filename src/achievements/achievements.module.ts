import { Module } from '@nestjs/common';
import { AchievementManager } from './AchievementManager';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AchievementManager],
    exports: [AchievementManager]
})
export class AchievementsModule {}
