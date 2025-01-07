import { Injectable, OnModuleInit } from '@nestjs/common';
import * as NodeCache from 'node-cache';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CacheService implements OnModuleInit {
    private cache = new NodeCache();

    async onModuleInit() {
        const jsonFilePath = path.join(__dirname, './newRecipes.json');
        const jsonData = await this.loadJsonFile(jsonFilePath);
        this.cache.set('recipes', jsonData);
        console.log('JSON adatok betöltve a cache-be');
    }

    private async loadJsonFile(filePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(JSON.parse(data));
            });
        });
    };

    private convertRecipe(data){
        console.log(data)
    }

    getCachedData(key: string): any {
        return this.cache.get(key);
    }
}
