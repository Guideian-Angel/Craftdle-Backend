import { Injectable, OnModuleInit } from '@nestjs/common';
import * as NodeCache from 'node-cache';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { Recipe } from 'src/recipes/classes/recipe.class';
import { RecipesService } from 'src/recipes/recipes.service';
import { IItem } from 'src/sharedComponents/interfaces/item.interface';
import { User } from 'src/users/classes/user.class';

@Injectable()
export class CacheService implements OnModuleInit {
    private cache = new NodeCache();

    public tokenToUser: Map<string, User> = new Map();
    public socketIdToUser: Map<string, User> = new Map();
    public passwordChangeTokenToUser: Map<string, User> = new Map();

    constructor(
        private readonly prisma: PrismaService,
        private readonly recipesService: RecipesService,
    ) { }

    //######################################################### DATA CACHING FUNCTIONS #########################################################

    async onModuleInit() {
        const recipesFilePath = path.join(__dirname, '../../../localData/recipes.json');
        const recipesData = await this.loadJsonFile(recipesFilePath);

        const convertedRecipes = this.convertRecipe(recipesData.data);
        this.cache.set('recipes', convertedRecipes);

        const itemsFromDb = await this.getItemsFromDatabase();
        this.cache.set('items', itemsFromDb);

        console.log('JSON és adatbázis adatok sikeresen cachelve');
    }

    async loadJsonFile(filePath: string): Promise<any> {
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
            let recipes = [];
            data[group].forEach(recipeData => {
                recipes.push(new Recipe(recipeData, this.recipesService))
            })
            convertedData[group] = recipes;
        });

        return convertedData;
    }

    private async getItemsFromDatabase() {
        const items = await this.prisma.items.findMany();
        let convertedItems = [];
        for (const item of items) {
            convertedItems.push({
                id: item.item_id,
                dbId: item.id,
                name: item.name,
                src: item.src,
            });
        }
        return convertedItems;
    }

    getItemById(id: string) {
        const items = this.cache.get('items') as Array<IItem>;
        return items.find(item => item.id === id);
    }

    getCachedData(key: string): any {
        return this.cache.get(key);
    }

    //######################################################### USER CACHING FUNCTIONS #########################################################

    /**
     * Társítja a socket ID-t a felhasználóhoz a token alapján.
     * @param token - A felhasználói token.
     * @param socketId - A socket ID.
     */
    associateSocketId(token: string, socketId: string) {
        const user = this.tokenToUser.get(token);
        if (user) {
            user.socketId = socketId;
            this.socketIdToUser.set(socketId, user);
        };
    };

    /**
     * Eltávolítja a felhasználót a socket ID alapján.
     * @param socketId - A socket ID.
     */
    removeUserBySocketId(socketId: string): void {
        const currentUser = this.socketIdToUser.get(socketId);
        const newUser = this.tokenToUser.get(currentUser.token);

        if (currentUser) {
            if (newUser.socketId === socketId) {
                this.tokenToUser.delete(currentUser.token);
            }
            this.socketIdToUser.delete(socketId);
        };
    };

    /**
     * Visszaadja a felhasználót a token alapján.
     * @param token - A felhasználói token.
     * @returns A felhasználó objektum, vagy undefined, ha nem található.
     */
    getUserByToken(token: string): User | undefined {
        return this.tokenToUser.get(token);
    }
    
    /**
     * Visszaadja a felhasználót a socket ID alapján.
     * @param socketId - A socket ID.
     * @returns A felhasználó objektum, vagy undefined, ha nem található.
     */
    getUserBySocketId(socketId: string): User | undefined {
        return this.socketIdToUser.get(socketId);
    }
    
    getUserByPasswordResetToken(token: string): User | undefined {
        return this.passwordChangeTokenToUser.get(token);
    }
}