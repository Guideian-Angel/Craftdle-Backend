import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
