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
import { SettingsModule } from './settings/settings.module';
import { TipModule } from './tip/tip.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CliModule } from './cli/cli.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenAuthGuard } from './guards/token.guard';
import { AuthorizationModule } from './authorization/authorization.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    UsersModule, 
    SocketModule, 
    PrismaModule, 
    GameModule, 
    RiddlesModule, 
    RecipesModule, 
    TokenModule, 
    EmailModule, 
    CacheModule, 
    AssetsModule, 
    AdminModule, 
    AchievementsModule, 
    SettingsModule, 
    TipModule,
    StatisticsModule,
    CliModule,
    AuthorizationModule,
    MaintenanceModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: TokenAuthGuard,
    },
  ],
})
export class AppModule {}
