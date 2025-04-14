import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SettingsModule } from 'src/settings/settings.module';
import { AssetsModule } from 'src/assets/assets.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { EmailModule } from 'src/email/email.module';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [SettingsModule, AssetsModule, PrismaModule, TokenModule, EmailModule, AuthorizationModule, CacheModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
