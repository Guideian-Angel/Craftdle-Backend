import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RandomizePasswordResetImages } from './users/utilities/RandomizePasswordResetImages';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getEmailOverView() {
    return await RandomizePasswordResetImages(this.prisma);
  }
}
