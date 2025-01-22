import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { UsersService } from 'src/users/users.service';
import { Maintenance } from './classes/Maintenance';

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
