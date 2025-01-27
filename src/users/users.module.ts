import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AssetsModule } from 'src/assets/assets.module';
import { GameModule } from 'src/game/game.module';
import { EmailService } from 'src/email/emailSender';

@Module({
  imports: [PrismaModule, AssetsModule, GameModule],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}

