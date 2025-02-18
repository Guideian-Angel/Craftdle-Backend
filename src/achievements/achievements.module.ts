import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';
import { AchievementsGateway } from './achievements.gateway';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
    imports: [PrismaModule, CacheModule, RecipesModule],
    providers: [AchievementsGateway],
    exports: [AchievementsGateway]
})
export class AchievementsModule {}
