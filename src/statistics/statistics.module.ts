import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule
  ],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}