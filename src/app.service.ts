import { Injectable } from '@nestjs/common';
import { CacheService } from './cache/cache.service';
import * as path from 'path';
import { version, snapshot, minecraftVersion, minecraftVersionName } from "../package.json";

@Injectable()
export class AppService {
  constructor(
    private readonly cacheService: CacheService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getVersion(){
    return {
      version: version,
      snapshot: snapshot,
      minecraftVersion: minecraftVersion,
      minecraftVersionName: minecraftVersionName
    }
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
