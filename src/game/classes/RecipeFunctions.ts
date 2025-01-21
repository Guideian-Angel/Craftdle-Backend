import { CacheService } from "src/cache/cache.service";
import { IShapedRecipeData, IShapelessRecipeData } from "../interfaces/IRecipeData";
import { Recipe } from "./Recipe";
import { mergeMatrixRows } from "src/shared/utilities/arrayFunctions";
import { Riddle } from "./Riddle";
import { IMatrixCompareResponse } from "../interfaces/IMatrixCompareResponse";

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

    static validateRecipe(tip: Array<Array<Array<string>> | null>, baseRecipe: Recipe): Boolean {
        return baseRecipe.shapeless? !!this.compareShapelessRecipes(tip, baseRecipe) : this.arraysEqual(mergeMatrixRows(tip).filter(Boolean), mergeMatrixRows(baseRecipe.recipe).filter(Boolean))
    }

    static getRecipeById(group: string, id: string, cacheService: CacheService): Recipe {
        let result;
        cacheService.getCachedData('recipes')[group].forEach((recipe: Recipe) => {
            console.log(recipe.id, id)
            if (recipe.id == id) {
                result = recipe;
            }
        });
        if (result) {
            return result;
        }
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

        console.log("TRIMMELT CUCC: ", matrix);

        return matrix;
    }

    static generateMatrices(recipe: (any[] | null)[][], gridSize: number): (any[] | null)[][][] {
        let matrices = [];

        // 1. Recept validálása és hiányzó sorok kitöltése nullokkal
        recipe = recipe.map(row => row || Array(recipe[0]?.length || gridSize).fill(null));

        // 2. Iterálás minden lehetséges pozícióra a gridSize x gridSize mátrixban
        for (let i = 0; i <= gridSize - recipe.length; i++) { // Sor eltolása
            for (let j = 0; j <= gridSize - recipe[0].length; j++) { // Oszlop eltolása
                let matrix = [];

                // 3. Mátrix kitöltése
                for (let k = 0; k < gridSize; k++) {
                    let row = [];

                    if (k < i || k >= i + recipe.length) {
                        // Sor kívül esik a recept hatókörén -> csak nullok
                        row = Array(gridSize).fill(null);
                    } else {
                        // Recept sorok kitöltése
                        const recipeRow = recipe[k - i];
                        row = [
                            ...Array(j).fill(null),            // Bal oldali nullok
                            ...recipeRow,                     // Recept tartalma
                            ...Array(gridSize - j - recipeRow.length).fill(null) // Jobb oldali nullok
                        ];
                    }

                    matrix.push(row);
                }

                matrices.push(matrix);
            }
        }

        // 4. Szimmetria ellenőrzése és tükrözött mátrixok generálása
        const mirroredMatrices = matrices
            .filter(matrix => !this.isVerticallySymmetric(matrix)) // Csak nem szimmetrikus mátrixok tükrözése
            .map(matrix => matrix.map(row => [...row].reverse()));

        // 5. Eredeti és tükrözött mátrixok összefűzése
        return [...matrices, ...mirroredMatrices];
    }

    // Új szimmetriaellenőrzés
    static isVerticallySymmetric(matrix: (any[] | null)[][]): boolean {
        for (let i = 0; i < matrix.length; i++) {
            const row = matrix[i];
            const reversedRow = [...row].reverse();
            if (!this.arraysEqual(row, reversedRow)) {
                return false; // Ha bármelyik sor nem szimmetrikus, az egész mátrix nem szimmetrikus
            }
        }

        return true; // Ha minden sor szimmetrikus, a mátrix is az
    }

    // Segédfüggvény két tömb összehasonlítására
    static arraysEqual(arr1: any[], arr2: any[]): boolean {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] && arr2[i]) {
            } else if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    static compareTipWithRiddle(tip: Array<Array<Array<string> | null>>, riddle: Riddle) {
        let result;
        if(riddle.templateRecipe.shapeless){
            result = this.compareShapelessRecipes(tip, riddle.templateRecipe)
        } else{
            const trimmedRiddle = this.trimMatrix(riddle.templateRecipe.recipe);
            const matrices = this.generateMatrices(trimmedRiddle, riddle.gamemode == 5 ? 2 : 3);
            for(const recipe of riddle.recipe){
                result = this.compareShapedRecipes(matrices[0], recipe, tip, riddle.gamemode == 5 ? 2 : 3);
                for (let i = 1; i < matrices.length; i++) {
                    const tempResult = this.compareShapedRecipes(matrices[0], recipe, tip, riddle.gamemode == 5 ? 2 : 3);
                    if (tempResult.matches > result.matches) {
                        result = tempResult;
                    }
                }
            }
        }
        return result;
    }

    static compareShapedRecipes(recipe: Array<Array<Array<string> | null>>, riddle: Recipe, tip: Array<Array<Array<string> | null>>, gridSize: number): IMatrixCompareResponse {
        let result = [];
        let correctCount = 0;
        let materials = [...riddle.required]

        // Iterálás a mátrix celláin
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                console.log("riddle: ", riddle.recipe, "tipCell: ", tip)
                const tipCell = tip[i][j];
                const riddleCell = recipe[i][j];

                if (tipCell === null) {
                    // Ha a tipp cellája null, akkor az eredmény is null
                    result.push(null);
                } else {
                    // Ellenőrzés, hogy a tipp cella megegyezik-e a riddle cellával
                    if (riddleCell && riddleCell.includes(tipCell[0])) {
                        // Ha megegyezik, akkor a tipp helyes
                        result.push({ item: tipCell[0], status: "correct" });
                        correctCount++;
                        materials = this.removeMaterial(materials, tipCell[0])
                    } else {
                        // Ha nem egyezik meg, akkor a tipp helytelen
                        result.push({ item: tipCell[0], status: "wait" });
                    }
                }
            }
        }

        result.forEach(element => {
            if (element && element.status == "wait") {
                const lengthBeforeCompare = materials.length;
                materials = this.removeMaterial(materials, element.item)
                if (materials.length < lengthBeforeCompare) {
                    element.status = "semi-correct";
                } else {
                    element.status = "wrong";
                }
            }
        })

        const solved = correctCount == riddle.required.length && correctCount == mergeMatrixRows(tip).filter(Boolean).length

        return { result: result, matches: correctCount, solved: solved };
    }

    static removeMaterial(materials: Array<Array<string>>, toRemove: string) {
        for (let i = 0; i < materials.length; i++) {
            if (materials[i].includes(toRemove)) {
                materials.splice(i, 1);
                break;
            }
        }
        return materials;
    }

    static compareShapelessRecipes(tip: Array<Array<Array<string> | null>>, baseRecipe: Recipe): IMatrixCompareResponse {
        let result = [];
        let correctCount = 0;
        let reqMats = baseRecipe.required.filter(Boolean);
        let optMats = [...baseRecipe.optionalMaterials ?? []];
        let wrongMat = false;

        tip.flat().forEach(item => {
            console.log(item)
            if (item === null) {
                result.push(null);
            } else {
                let found = false;
                reqMats.forEach((reqMat, index) => {
                    if (reqMat.includes(item[0])) {
                        result.push({ item: item, status: "correct" });
                        correctCount++;
                        reqMats.splice(index, 1);
                        found = true;
                    }
                });
                if (!found && optMats.includes(item[0])) {
                    result.push({ item: item, status: "correct" });
                    correctCount++;
                    let index = optMats.indexOf(item[0]);
                    optMats.splice(index, 1);
                    found = true;

                } else if (!found) {
                    result.push({ item: item, status: "wrong" });
                    wrongMat = true;
                }
            };
        });

        const solved = reqMats.length == 0 && !wrongMat;

        return { result: result, matches: correctCount, solved: solved };
    }
}