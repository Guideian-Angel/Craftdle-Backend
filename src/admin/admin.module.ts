import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketModule } from 'src/socket/socket.module';
import { UsersModule } from 'src/users/users.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    SocketModule,
    UsersModule,
    GameModule,
  ],
  controllers: [AdminController],
  providers: [PrismaService, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
