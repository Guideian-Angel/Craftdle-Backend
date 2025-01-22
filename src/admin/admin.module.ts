import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { UsersService } from 'src/users/users.service';
import { Maintenance } from './classes/Maintenance';

@Module({
  controllers: [AdminController],
  providers: [PrismaService, AdminService, SocketGateway, UsersService, Maintenance, SocketGateway],
  exports: [AdminService, Maintenance, SocketGateway]
})
export class AdminModule {}
