import { CacheService } from "src/cache/cache.service";
import { GameService } from "src/game/game.service";
import { Recipe } from "src/recipes/classes/recipe.class";
import { RecipesService } from "src/recipes/recipes.service";
import { IItem } from "src/sharedComponents/interfaces/item.interface";
import { shuffleArray } from "src/sharedComponents/utilities/array.util";
import { ICheckedTip } from "src/tip/interfaces/tip.interface";
import { RiddlesService } from "src/riddles/riddles.service";
import { Game } from "src/game/classes/game.class";
import { Graph } from "src/sharedComponents/classes/graph.class";

export class Riddle {
    recipeGroup: string;
    recipe: Recipe[];
    templateRecipe: Recipe;
    hints: string[] | null = null;
    numberOfGuesses: number = 0;
    guessedRecipes: string[] = [];
    tips: ICheckedTip[] = [];
    gamemode: number;
    inventory: IItem[];
    solved: boolean = false;

    constructor(
        private readonly cacheService: CacheService,
        private readonly gameService: GameService,
        private readonly recipesService: RecipesService,
        private readonly riddlesService: RiddlesService
    ) { }

    async initializeExistingGame(game) {
        const recipes = this.cacheService.getCachedData('recipes');
        const items = this.cacheService.getCachedData('items');
        this.gamemode = game.type;
        this.recipeGroup = game.riddle;
        this.recipe = recipes[this.recipeGroup];
        this.templateRecipe = this.getRandomItem(this.recipe);
        this.inventory = Number(this.gamemode) === 6 ? await this.gameService.loadInventory(game.id) : items;
        this.hints = Number(this.gamemode) !== 7 ? await this.gameService.loadHints(game.id) : null;
        this.tips = await this.gameService.loadTips(game.id);
        this.guessedRecipes = this.tips.map(tip => `${tip.group}-${tip.item.id}`);
        this.numberOfGuesses = this.guessedRecipes.length;

        return game.id;
    }

    async initializeNewGame(gamemode: number, game: Game) {
        this.gamemode = gamemode;
        const recipes = this.cacheService.getCachedData('recipes');
        const items = this.cacheService.getCachedData('items');
        let randomGroupKey;

        // Daily gamemode esetén ellenőrizzük, játszottak-e ma már, ha igen, beállítjuk azt riddlenek, ha nem akkor újat sorsolunk
        if (gamemode == 3) {
            const existingDailyGame = await this.riddlesService.findPlayersDailyGameToday(game.user.id);
            if (existingDailyGame) {
                if (existingDailyGame.player == game.user.id) {
                    return await this.initializeExistingGame(existingDailyGame);
                }
                randomGroupKey = existingDailyGame.riddle;
            } else {
                randomGroupKey = this.drawNewRiddle(recipes);
            }
        } else {
            randomGroupKey = gamemode == 1 ? "axe0" : this.drawNewRiddle(recipes);
        }
        const selectedGroup = recipes[randomGroupKey];

        this.recipe = selectedGroup;
        this.templateRecipe = this.getRandomItem(this.recipe);
        this.recipeGroup = randomGroupKey;
        this.inventory = Number(this.gamemode) === 6 ? this.createResourceInventory(recipes, items) : items;
        this.hints = Number(this.gamemode) !== 7 ? this.generateHints(recipes) : null;

        await this.gameService.deleteUnnecessaryGamesDataByUser(game.user.id, Number(gamemode))
        return await this.gameService.saveGame(game);
    }

    private drawNewRiddle(recipes) {
        const validGroups = this.getValidGroups(recipes);

        if (validGroups.length === 0) {
            throw new Error('Nincs olyan group, amelyik támogatná ezt a gamemode-ot.');
        }
        const randomGroupKey = this.gamemode == 1 ? "axe0" : this.getRandomItem(validGroups);

        return randomGroupKey
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

    private convertGraphToSet(graph: Graph) {
        let result = new Set<string>();
        graph.content.forEach(element => {
            result.add(element[Math.floor(Math.random() * element.length)]);
        });
        return result;
    }

    private createSetFromMaterials(materials: Array<Array<string>>): Graph {
        let result: Graph = new Graph();
        materials.forEach(material => {
            result.add(material);
        });
        return result;
    }

    private createResourceInventory(recipes, items) {
        let graph = this.createSetFromMaterials(this.templateRecipe.required);
        while (graph.size() < 20) {
            for (const group of shuffleArray(Object.keys(recipes))) {
                if (group !== "gaLogo0") {
                    for (const recipe of shuffleArray(recipes[group])) {
                        const mats = recipe.required;
                        if (this.checkForSameMaterial(graph, mats)) {
                            this.addMaterialsToSet(graph, mats);
                            break;
                        }
                    };
                    if (graph.size() >= 20) {
                        break;
                    }
                }
            };
        }
        return this.gatherItems(items, this.convertGraphToSet(graph));
    }

    private checkForSameMaterial(set, mats) {
        return mats.some(mat =>
            mat.some(element => set.content.some(row => row.includes(element)))
        );
    }

    private addMaterialsToSet(set, materials) {
        materials.forEach(material => {
            set.add(material);
        })
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
            `Random material from this recipe: ${this.cacheService.getItemById(this.selectRandomMaterial()).name}`,
            `The item you need to think about is ${this.templateRecipe.name}`
        ]
    }

    private countRequiredSlots(recipe: any): number {
        if (recipe.shapeless) {
            return recipe.required.length;
        }
        return recipe.recipe.flat().filter(Boolean).length;
    }

    private findCommonItem(recipes): string | null {
        let foundRecipe: string | null = null;

        for (const groupName of shuffleArray(Object.keys(recipes))) {
            if (groupName === this.recipeGroup) continue;

            for (const recipe of recipes[groupName]) {
                for (const mat of this.templateRecipe.required) {
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

    private recipeMatchesTemplate(recipe: any, material: string[]): boolean {
        if (recipe.shapeless) {
            return recipe.required.some(element => element ? this.matchesMaterial(element, material) : false);
        }

        return recipe.recipe.some(row => row.some(element => element ? this.matchesMaterial(element, material) : false));
    }

    private matchesMaterial(element: string[], material: string[]): boolean {
        if (Array.isArray(element)) {
            return element.some(subElement => material.includes(subElement));
        }
        return element === material;
    }

    private selectRandomMaterial() {
        const randomMaterial: string[] = this.templateRecipe.required[Math.floor(Math.random() * this.templateRecipe.required.length)]
        return randomMaterial[Math.floor(Math.random() * randomMaterial.length)];
    }

    toJSON() {
        return {
            items: this.inventory,
            recipes: this.recipesService.convertRecipes(this.cacheService.getCachedData('recipes')),
            tips: this.tips,
            hints: this.hints ? this.hints.map((hint, index) => ((index + 1) * 5 <= this.numberOfGuesses ? hint : null)) : this.hints,
            hearts: Number(this.gamemode) === 7 ? 10 : null,
            result: this.solved
        };
    }
}