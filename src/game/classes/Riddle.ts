import { Recipe } from './Recipe';

export class Riddle {
    recipe: Recipe;
    hints: string[];
    numberOfGuesses: number;
    guessedRecipes: string[];
    gamemode: number;
}