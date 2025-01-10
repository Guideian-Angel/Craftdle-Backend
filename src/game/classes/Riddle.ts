import { Recipe } from './Recipe';
import { CacheService } from 'src/cache/cache.service';
import { shuffleArray } from 'src/shared/utilities/arrayFunctions';
import { IItem } from '../interfaces/IItem';
import { ITip } from '../interfaces/ITip';

export class Riddle {
    recipeGroup: string;
    recipe: Recipe[];
    templateRecipe: Recipe;
    hints: string[] = [];
    numberOfGuesses: number = 0;
    guessedRecipes: string[] = [];
    tips: ITip[] = [];
    gamemode: number;
    inventory: IItem[] | null;
    solved: boolean = false;

    constructor(newGame: boolean, gamemode: number, private readonly cacheService: CacheService) {
        this.gamemode = gamemode;

        const recipes = this.cacheService.getCachedData('recipe');

        if (newGame) {
            this.initializeNewGame(recipes);
        } else {
            //this.getLastGame();;
        }
    }

    private initializeNewGame(recipes: Record<string, any>): void {
        const validGroups = this.getValidGroups(recipes);

        if (validGroups.length === 0) {
            throw new Error('Nincs olyan group, amelyik támogatná ezt a gamemode-ot.');
        }

        const randomGroupKey = this.getRandomItem(validGroups);
        const selectedGroup = recipes[randomGroupKey];

        this.recipe = selectedGroup.map(recipeData => new Recipe(recipeData));
        this.templateRecipe = this.getRandomItem(this.recipe);
        this.recipeGroup = randomGroupKey;

        if(this.gamemode === 6){
            this.inventory = [];
        } else{
            this.inventory = this.cacheService.getCachedData('items')
        }

        if (this.gamemode !== 7) {
            this.hints = this.generateHints();
        }
    }

    private createItemConnectionTree(){

    }

    private getValidGroups(recipes: Record<string, any>): string[] {
        return Object.keys(recipes).filter(groupKey => {
            return recipes[groupKey].some(recipe => recipe.enableGamemodes.includes(this.gamemode));
        });
    }

    private getRandomItem<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    private generateHints(): string[] {
        const hint2result = this.findCommonItem();
        return [
            `This recipe requires minimum ${this.countRequiredSlots(this.templateRecipe.layout)} slots.`,
            hint2result? `At least 1 material is shared with this recipe: ${hint2result}` : `Materials used in this recipe are not included in any other recipe!`,
            `Random material from this recipe: ${this.selectRandomMaterial()}`,
            `The item you need to think about is ${this.templateRecipe.name}`
        ]
    }

    private countRequiredSlots(layout: any): number {
        if (layout.shapeless) {
            return layout.recipe.required.length;
        }
        return layout.recipe.filter(Boolean).length;
    }

    private findCommonItem(): string | null {
        const recipes = this.cacheService.getCachedData('recipe');
        let foundRecipe: string | null = null;

        for (const groupName of shuffleArray(Object.keys(recipes))) {
            if (groupName === this.recipeGroup) continue;

            for (const recipe of recipes[groupName]) {
                for (const mat in this.templateRecipe.materials){
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

    private selectRandomMaterial(){
        return this.templateRecipe.materials[Math.floor(Math.random() * this.templateRecipe.materials.length)];
    }

    toJSON() {
        return {
            items: this.inventory,
            recipes: this.cacheService.getCachedData('recipes'),
            tips: this.tips,
            hints: this.hints.map((hint, index) => (index * 5 <= this.numberOfGuesses ? hint : null)),
            hearts: this.gamemode === 7 ? 10 : null,
            result: this.solved
        };
    }
}