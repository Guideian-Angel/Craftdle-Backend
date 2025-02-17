import { Module } from '@nestjs/common';
import { CliService } from './cli.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule
  ],
  providers: [CliService],
  exports: [CliService],
})
export class CliModule {}