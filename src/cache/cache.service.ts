import { Injectable, OnModuleInit } from '@nestjs/common';
import * as NodeCache from 'node-cache';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service'; // A PrismaService helyes útvonalát használd

@Injectable()
export class CacheService implements OnModuleInit {
    private cache = new NodeCache();

    constructor(private readonly prisma: PrismaService) { } // Prisma injektálása

    async onModuleInit() {
        const recipesFilePath = path.join(__dirname, '../../recipes.json');
        const recipesData = await this.loadJsonFile(recipesFilePath);

        const convertedRecipes = this.convertRecipe(recipesData.data);
        this.cache.set('recipes', convertedRecipes);

        const itemsFilePath = path.join(__dirname, '../../items.json');
        const itemsData = await this.loadJsonFile(itemsFilePath);

        this.cache.set('items', itemsData.data);

        // Adatok betöltése adatbázisból
        const itemsFromDb = await this.getItemsFromDatabase();
        this.cache.set('dbItems', itemsFromDb);

        console.log('JSON és adatbázis adatok sikeresen cachelve');
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
    }

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
                    recipe.recipe = matrix;
                    return recipe;
                });
            } else {
                convertedData[group] = data[group];
            }
        });

        return convertedData;
    }

    private async getItemsFromDatabase() {
        return await this.prisma.items.findMany();
    }

    getCachedData(key: string): any {
        return this.cache.get(key);
    }
}