import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AssetsModule } from 'src/assets/assets.module';
import { GameModule } from 'src/game/game.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PrismaModule, AssetsModule, GameModule, EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

