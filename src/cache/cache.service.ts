import { Injectable, OnModuleInit } from '@nestjs/common';
import * as NodeCache from 'node-cache';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CacheService implements OnModuleInit {
    private cache = new NodeCache();

    async onModuleInit() {
        const jsonFilePath = path.join(__dirname, '../../public/newRecipes.json');
        const jsonData = await this.loadJsonFile(jsonFilePath);
    
        const convertedData = this.convertRecipe(jsonData.data);
        this.cache.set('recipes', convertedData);
    
        console.log(convertedData);
        console.log("JSON sikeresen cachelve");
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

    private convertRecipe(data) {
        const convertedData = {};
    
        Object.keys(data).forEach(group => {
            if (!data[group][0].shapeless) {
                convertedData[group] = data[group].map(recipe => {
                    let matrix = [];
                    let row = [];
    
                    recipe.recipe.forEach((item, index) => {
                        row.push(item);
    
                        if ((index + 1) % 3 === 0 || index === recipe.recipe.length - 1) {
                            matrix.push(row);
                            row = [];
                        }
                    });
    
                    return matrix;
                });
            } else {
                convertedData[group] = data[group];
            }
        });
    
        return convertedData;
    }
    

    getCachedData(key: string): any {
        return this.cache.get(key);
    }
}
