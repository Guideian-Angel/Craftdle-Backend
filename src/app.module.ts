import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SocketModule } from './socket/socket.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { RiddlesModule } from './riddles/riddles.module';
import { RecipesModule } from './recipes/recipes.module';
import { TokenModule } from './token/token.module';
import { EmailModule } from './email/email.module';
import { CacheModule } from './cache/cache.module';
import { AssetsModule } from './assets/assets.module';
import { AdminModule } from './admin/admin.module';
import { AchievementsModule } from './achievements/achievements.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CliModule } from './cli/cli.module';

@Module({
  imports: [
    UsersModule,
    GameModule,
    CacheModule,
    AdminModule,
    SocketModule,
    AssetsModule,
    PrismaModule,
    EmailModule,
    AchievementsModule,
    StatisticsModule,
    CliModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
