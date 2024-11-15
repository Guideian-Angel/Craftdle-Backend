import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenValidationService } from './utilities/token-validation.service';

@Module({
    imports: [PrismaModule],
    providers: [TokenValidationService],
    exports: [TokenValidationService, PrismaModule]
})
export class SharedModule {}
