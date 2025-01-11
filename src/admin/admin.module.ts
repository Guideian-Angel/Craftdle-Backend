import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [AdminController],
  providers: [PrismaService, AdminService, SocketGateway, UsersService],
  exports: [AdminService]
})
export class AdminModule {}
