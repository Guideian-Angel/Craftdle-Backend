import { CacheService } from "src/cache/cache.service";
import { IShapedRecipeData, IShapelessRecipeData } from "../interfaces/IRecipeData";
import { Recipe } from "./Recipe";

export class RecipeFunctions {

    static collectMaterials(data: IShapelessRecipeData | IShapedRecipeData): Array<Array<string>> {
        if (this.isShapelessRecipeData(data)) { // Ellenőrizzük, hogy shapeless típusú-e
            let materials: Array<Array<string>> = [];
            data.recipe.required.forEach(material => {
                if (!Array.isArray(material)) {
                    materials.push([material]);
                } else {
                    materials.push(material);
                }
            });
            return materials;
        }

        // Ha nem shapeless, akkor feltételezzük, hogy IShapedRecipeData típusú
        return data.recipe.filter(Boolean) as Array<Array<string>>;
    }


    static isShapelessRecipeData(data: IShapelessRecipeData | IShapedRecipeData): data is IShapelessRecipeData {
        return data.shapeless;
    }

    // static validateRecipe(tip : Array<Array<Array<string>> | null>, itemData: {group: string, id: string}, cacheService: CacheService): Boolean{
    //     const baseRecipe = this.getRecipeById(itemData.id, itemData.group, cacheService);
    //     return baseRecipe.shapeless ? this.compareShapelessRecipes(tip, baseRecipe) : this.compareShapedRecipes(tip, baseRecipe);
    // }

    static getRecipeById(group: string, id: string, cacheService: CacheService): Recipe {
        cacheService.getCachedData('recipes')[group].forEach((recipe: Recipe) => {
            if (recipe.id == id) {
                return recipe;
            }
        });
        throw new Error('Invalid recipe error: Not found');
    }

    // Statikus metódus a mátrix tisztítására
    static trimMatrix(matrix: (any[] | null)[][]): (any[] | null)[][] {
        // Eltávolítja az üres sorokat
        matrix = matrix.filter(row => row.some(cell => cell !== null && cell !== undefined));

        let columnCount = matrix[0]?.length || 0; // Ellenőrizzük, hogy van-e oszlop

        // Eltávolítja az üres oszlopokat
        for (let col = 0; col < columnCount; col++) {
            let isEmptyColumn = true;

            // Ellenőrizzük, hogy az oszlop minden sora üres-e
            for (let row of matrix) {
                if (row[col] !== null && row[col] !== undefined) {
                    isEmptyColumn = false;
                    break;
                }
            }

            // Ha üres az oszlop, akkor eltávolítjuk
            if (isEmptyColumn) {
                for (let row of matrix) {
                    row.splice(col, 1);
                }
                col--; // Csökkentjük az indexet, mert egy oszlopot eltávolítottunk
                columnCount--; // Csökkentjük az oszlopok számát
            }
        }

        console.log("TRIMMELT CUCC: ", matrix)

        RecipeFunctions.generateMatrices(matrix)

        return matrix;
    }

    static generateMatrices(recipe) {
        let matrices = [];

        // Iterálás minden lehetséges pozícióra a 3x3-as mátrixban
        for (let i = 0; i <= 3 - recipe.length; i++) { // Sor eltolása
            for (let j = 0; j <= 3 - recipe[0].length; j++) { // Oszlop eltolása
                let matrix = [];

                // Mátrix kitöltése
                for (let k = 0; k < 3; k++) {
                    let row = [];

                    if (k < i || k >= i + recipe.length) {
                        // Ha a sor nem tartozik a recepthez, üres sor (3 darab null)
                        row = [null, null, null];
                    } else {
                        // Recept sorok kitöltése
                        for (let l = 0; l < j; l++) row.push(null); // Bal oldali nullok
                        row.push(...recipe[k - i]); // Recept tartalma
                        for (let l = 0; l < 3 - j - recipe[0].length; l++) row.push(null); // Jobb oldali nullok
                    }

                    matrix.push(row);
                }

                matrices.push(matrix);
            }
        }

        // Szimmetria ellenőrzése és tükrözött mátrixok generálása
        const mirroredMatrices = matrices
            .filter(matrix => !RecipeFunctions.isVerticallySymmetric(matrix)) // Csak nem szimmetrikus mátrixok tükrözése
            .map(matrix => matrix.map(row => [...row].reverse()));

        // Eredeti és tükrözött mátrixok összefűzése
        const result = [...matrices, ...mirroredMatrices];
        console.log("EREDMÉNY: ", result);

        return result;
    }

    // Új szimmetriaellenőrzés
    static isVerticallySymmetric(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            const row = matrix[i];
            const reversedRow = [...row].reverse();
            if (!RecipeFunctions.arraysEqual(row, reversedRow)) {
                return false; // Ha bármelyik sor nem szimmetrikus, az egész mátrix nem szimmetrikus
            }
        }

        return true; // Ha minden sor és oszlop szimmetrikus, a mátrix is az
    }

    // Segédfüggvény két tömb összehasonlítására
    static arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] && arr2[i]) {
            } else if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }



    static compareShapedRecipes(tip: Array<Array<Array<string>> | null>, riddle: Recipe) {
        let result = [];
        let correctCount = 0;

        // Iterálás a mátrix celláin
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const tipCell = tip[i][j];
                const riddleCell = riddle[i][j];

                if (tipCell === null) {
                    // Ha a tipp cellája null, akkor az eredmény is null
                    result.push(null);
                } else if (Array.isArray(tipCell) && tipCell.length === 1) {
                    // Ellenőrizzük, hogy a tippben szereplő elem helyes-e
                    const tipItem = tipCell[0];
                    const isCorrect = Array.isArray(riddleCell) && riddleCell.includes(tipItem);

                    // Ha helyes az item, növeljük a correctCount-ot
                    if (isCorrect) {
                        correctCount++;
                    }

                    result.push({
                        item: tipItem,
                        status: isCorrect ? "correct" : null
                    });
                } else {
                    // Ha a tipp cellája nem megfelelő formátumú, null-t adunk hozzá az eredményhez
                    result.push(null);
                }
            }
        }

        return { result, correctCount };
    }

    // static compareShapelessRecipes(tip: Array<Array<Array<string>> | null>, baseRecipe: Recipe): Boolean{
    //     if
    // }
}