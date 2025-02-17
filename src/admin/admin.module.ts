import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SocketModule } from 'src/socket/socket.module';
import { UsersModule } from 'src/users/users.module';
import { Maintenance } from './classes/Maintenance';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    SocketModule,
    UsersModule,
    PrismaModule
  ],
  controllers: [AdminController],
  providers: [AdminService, Maintenance],
  exports: [AdminService],
})
export class AdminModule {}
