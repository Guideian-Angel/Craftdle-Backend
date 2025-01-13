import { Recipe } from './Recipe';
import { CacheService } from 'src/cache/cache.service';
import { shuffleArray } from 'src/shared/utilities/arrayFunctions';
import { IItem } from '../interfaces/IItem';
import { ITip } from '../interfaces/ITip';

export class Riddle {
    recipeGroup: string;
    recipe: Recipe[];
    templateRecipe: Recipe;
    hints: string[] | null = null;
    numberOfGuesses: number = 0;
    guessedRecipes: string[] = [];
    tips: ITip[] = [];
    gamemode: number;
    inventory: IItem[] | null;
    solved: boolean = false;

    constructor(newGame: boolean, gamemode: number, private readonly cacheService: CacheService) {
        this.gamemode = gamemode;

        const recipes = cacheService.getCachedData('recipes');
        const items = cacheService.getCachedData('items');

        if (newGame) {
            this.initializeNewGame(recipes, items);
        } else {
            //this.getLastGame();
        }
    }

    private initializeNewGame(recipes: Record<string, any>, items): void {
        const validGroups = this.getValidGroups(recipes);

        if (validGroups.length === 0) {
            throw new Error('Nincs olyan group, amelyik támogatná ezt a gamemode-ot.');
        }

        const randomGroupKey = this.getRandomItem(validGroups);
        const selectedGroup = recipes[randomGroupKey];

        this.recipe = selectedGroup.map(recipeData => new Recipe(recipeData));
        this.templateRecipe = this.getRandomItem(this.recipe);
        this.recipeGroup = randomGroupKey;

        if (Number(this.gamemode) === 6) {
            this.inventory = this.collectMaterialsForGraph(recipes, items);
        } else {
            this.inventory = items
        }

        if (Number(this.gamemode) !== 7) {
            this.hints = this.generateHints(recipes);
        }
    }

    private gatherItems(items, itemIds: Set<string>) {
        let result = [];
        items.forEach(item => {
            if (itemIds.has(item.id)) {
                result.push(item);
                itemIds.delete(item.id);
            }
        });
        return result;
    }

    private collectMaterialsForGraph(recipes, items) {
        let graph = new Set(this.templateRecipe.materials);
        let elementAdded = true;
        while (elementAdded && graph.size < 20) {
            elementAdded = false;
            Object.keys(recipes).forEach(group => {
                recipes[group].forEach(recipe => {
                    const mats = recipe.shapeless ? recipe.recipe.required : recipe.recipe;
                    if (this.checkForSameMaterial(graph, mats)) {
                        let tempGraph = this.addMaterialsToSet(graph, mats);
                        if (tempGraph.size > graph.size) {
                            elementAdded = true;
                        }
                        graph = tempGraph;
                    }
                });
            });
        }
        return this.gatherItems(items, graph);
    }

    private checkForSameMaterial(set, mats) {
        return mats.some(mat =>
            Array.isArray(mat) ? mat.some(element => set.has(element)) : set.has(mat)
        );
    }

    private addMaterialsToSet(set, mats) {
        const processedMaterials = this.processMaterials(mats);
        processedMaterials.forEach(mat => set.add(mat));
        return set;
    }

    private isValidMaterial(material) {
        return material !== null && material !== undefined;
    }

    private processMaterials(materials, callback?) {
        let result = [];
        materials.forEach(material => {
            if (this.isValidMaterial(material)) {
                if (Array.isArray(material)) {
                    result.push(material[Math.floor(Math.random() * material.length)]);
                } else {
                    result.push(material);
                }
            }
        });
        return callback ? callback(result) : result;
    }

    private getValidGroups(recipes: Record<string, any>): string[] {
        return Object.keys(recipes).filter(groupKey => {
            return recipes[groupKey].some(recipe => recipe.enabledGamemodes.includes(Number(this.gamemode)));
        });
    }

    private getRandomItem<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    private generateHints(recipes): string[] {
        const hint2result = this.findCommonItem(recipes);
        return [
            `This recipe requires minimum ${this.countRequiredSlots(this.templateRecipe)} slots.`,
            hint2result ? `At least 1 material is shared with this recipe: ${hint2result}` : `Materials used in this recipe are not included in any other recipe!`,
            `Random material from this recipe: ${this.selectRandomMaterial()}`,
            `The item you need to think about is ${this.templateRecipe.name}`
        ]
    }

    private countRequiredSlots(recipe: any): number {
        if (recipe.shapeless) {
            return recipe.materials.length;
        }
        return recipe.layout.filter(Boolean).length;
    }

    private findCommonItem(recipes): string | null {
        let foundRecipe: string | null = null;

        for (const groupName of shuffleArray(Object.keys(recipes))) {
            if (groupName === this.recipeGroup) continue;

            for (const recipe of recipes[groupName]) {
                for (const mat in this.templateRecipe.materials) {
                    if (this.recipeMatchesTemplate(recipe, mat)) {
                        foundRecipe = recipe.name;
                        break;
                    }
                }
            }

            if (foundRecipe) break;
        }

        return foundRecipe;
    }

    private recipeMatchesTemplate(recipe: any, material: string): boolean {
        if (recipe.shapeless) {
            return recipe.recipe.required.some(element => this.matchesMaterial(element, material));
        }

        return recipe.recipe.some(row => row.some(element => this.matchesMaterial(element, material)));
    }

    private matchesMaterial(element: any, material: string): boolean {
        if (Array.isArray(element)) {
            return element.some(subElement => subElement === material);
        }
        return element === material;
    }

    private selectRandomMaterial() {
        return this.templateRecipe.materials[Math.floor(Math.random() * this.templateRecipe.materials.length)];
    }

    toJSON() {
        return {
            items: this.inventory,
            recipes: this.cacheService.getCachedData('recipes'),
            tips: this.tips,
            hints: this.hints? this.hints.map((hint, index) => ((index+1) * 5 <= this.numberOfGuesses ? hint : null)) : this.hints,
            hearts: Number(this.gamemode) === 7 ? 10 : null,
            result: this.solved
        };
    }
}