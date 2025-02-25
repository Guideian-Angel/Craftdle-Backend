import { Injectable } from '@nestjs/common';
import { CacheService } from './cache/cache.service';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor(
    private readonly cacheService: CacheService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getVersion(){
    const filePath = path.join(__dirname, '../../localData/version.json');
    return await this.cacheService.loadJsonFile(filePath)
  }

  async getPatchNotes(){
    const filePath = path.join(__dirname, '../../localData/patchNotes.json');
    return await this.cacheService.loadJsonFile(filePath)
  }

  async getCredits(){
    const filePath = path.join(__dirname, '../../localData/credits.json');
    return await this.cacheService.loadJsonFile(filePath)
  }
}
