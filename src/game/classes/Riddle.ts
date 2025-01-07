import { Recipe } from './Recipe';

export class Riddle {
    recipe: Recipe[];
    hints: string[];
    numberOfGuesses: number;
    guessedRecipes: string[];
    gamemode: number;

    constructor(newGame: boolean, gamemode: number, allGroups: any) {
        this.gamemode = gamemode;
        this.numberOfGuesses = 0;
        this.guessedRecipes = [];

        if (newGame) {
            // Válassz egy random groupot, amely támogatja a megadott gamemode-ot
            const validGroups = Object.keys(allGroups).filter(groupKey => {
                return allGroups[groupKey].some(recipe => recipe.enableGamemodes.includes(gamemode));
            });

            if (validGroups.length === 0) {
                throw new Error('Nincs olyan group, amelyik támogatná ezt a gamemode-ot.');
            }

            const randomGroupKey = validGroups[Math.floor(Math.random() * validGroups.length)];
            const selectedGroup = allGroups[randomGroupKey];

            // Állítsd be a recipe adattagot Recipe osztály példányokkal
            this.recipe = selectedGroup.map(recipeData => new Recipe(recipeData));

            // Állítsd be a hints adattagot (egy random elem a groupból)
            const randomRecipe = selectedGroup[Math.floor(Math.random() * selectedGroup.length)];
            this.hints = this.generateHints(randomRecipe);
        } else {
            // Ha nem random, üres értékeket állítunk be
            this.recipe = [];
            this.hints = [];
        }
    }

    private generateHints(recipeData: any): string[] {
        // Ide jöhet a hint-generálás logikája
        return [`Hint for ${recipeData.name}`, `Another hint for ${recipeData.name}`];
    }
}