import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule
  ],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}