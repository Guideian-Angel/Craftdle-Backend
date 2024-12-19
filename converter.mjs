import readline from 'node:readline';
import { promises as fs } from 'fs';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function getFilePath() {
    return new Promise((resolve) => {
        rl.question("Path to the file: ", (filePath) => {
            rl.close();
            resolve(filePath.trim());
        });
    });
};

async function fetchJSONFile(src) {
    try {
        const absolutePath = path.resolve(src);
        const data = await fs.readFile(absolutePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading or parsing the file:", err.message);
        throw err;
    };
};

function collectMaterialsForGraph(materials, recipes) {
    let graph = new Set(materials);
    let elementAdded = true;
    while (elementAdded && graph.size < 20) {
        elementAdded = false;
        Object.keys(recipes).forEach(group => {
            recipes[group].forEach(recipe => {
                let mats;
                if (recipe.shapeless) {
                    mats = recipe.recipe.required;
                } else {
                    mats = recipe.recipe;
                }
                if (checkForSameMaterial(graph, mats)) {
                    graph = addMaterialsToSet(graph, mats)
                    elementAdded = true;
                }
            });
        });
    };
    return graph.size >= 20;
};

function checkForSameMaterial(set, mats) {
    mats.forEach(mat => {
        if (mat != null) {
            if (Array.isArray(mat)) {
                mat.forEach(element => {
                    if (set.has(element)) {
                        return true;
                    };
                });
            } else {
                if (set.has(mat)) {
                    return true;
                };
            };
        };
    });
    return false;
};

function addMaterialsToSet(set, mats) {
    let result = set;
    mats.forEach(mat => {
        if (mat) {
            if (Array.isArray(mat)) {
                result.add(mat[Math.floor(Math.random() * mat.length)]);
            } else {
                result.add(mat)
            }
        };
    });
    return result;
};

function getMaterialsForRecipe(recipe) {
    let materials = [];
    if (recipe.shapeless) {
        return recipe.recipe.required;
    };
    recipe.recipe.forEach(slot => {
        if (slot) {
            if (Array.isArray(slot)) {
                materials.push(slot[Math.floor(Math.random() * slot.length)]);
            } else {
                materials.push(slot)
            };
        };
    });
    return materials;
};

function checkRightGridSizeOfRecipe(recipe) {
    if (recipe.shapeless) {
        return recipe.recipe.required.length <= 4;
    }
    const matrix = converRecipeGridToMatrix(recipe.recipe);
    let rightSizeMatrix = matrix.length < 3;
    matrix.forEach(row => {
        if (row.length > 2) {
            rightSizeMatrix = false;
        };
    });
    return rightSizeMatrix;
};

function converRecipeGridToMatrix(grid) {
    let matrix = [];
    for (let i = 0; i < grid.length; i += 3) {
        let subArray = [];
        for (let j = 0; j < 3; j++) {
            subArray.push(grid[i + j]);
        };
        matrix.push(subArray);
    };
    return matrix;
}

function geatherDataAboutRecipe(recipes, recipe) {
    const materialsOfRecipe = getMaterialsForRecipe(recipe);
    const hasGraphScore20 = collectMaterialsForGraph(materialsOfRecipe, recipes);
    const validMatrixForPocketMode = checkRightGridSizeOfRecipe(recipe);
    const hasMoreThanOneTypeOfMaterial = new Set(materialsOfRecipe).size > 1;
    const isSelfCraftRecipe = materialsOfRecipe.includes(recipe.id)
    const enabledGamemodesForRecipe = [4];
    if (hasMoreThanOneTypeOfMaterial && !isSelfCraftRecipe) {
        enabledGamemodesForRecipe.push(2);
        enabledGamemodesForRecipe.push(3);
        enabledGamemodesForRecipe.push(7);
        if (hasGraphScore20) {
            enabledGamemodesForRecipe.push(6);
        }
        if (validMatrixForPocketMode) {
            enabledGamemodesForRecipe.push(5);
        }
    }
    return enabledGamemodesForRecipe;
};

function convertDictToValidArray(dict) {
    let result = [];
    const slots = Object.keys(dict);
    for (let i = 0; i <= Number(slots[slots.length - 1]); i++) {
        const key = i.toString();
        if (slots.includes(key)) {
            result.push(dict[key]);
        } else {
            result.push(null);
        };
    };
    return result;
};

function analyzeRecipes(data) {
    let recipes = data
    Object.keys(recipes).forEach(group => {
        let availableGamemodes = geatherDataAboutRecipe(recipes, recipes[group][0])
        recipes[group].forEach(recipe => {
            recipe["enabledGamemodes"] = availableGamemodes;
        });
    });
    return recipes;
};

function convertEveryRecipeToArray(data) {
    let recipes = data
    Object.keys(recipes).forEach(group => {
        if (!recipes[group][0].shapeless && !Array.isArray(recipes[group][0].recipe)) {
            recipes[group].forEach(recipe => {
                recipe.recipe = convertDictToValidArray(recipe.recipe);
            });
        };
    });
    return recipes;
}

async function main() {
    //const filePath = await getFilePath();
    const filePath = "./newRecipes.json";
    let recipes = await fetchJSONFile(filePath);
    recipes = convertEveryRecipeToArray(recipes.data);
    const analyzedData = analyzeRecipes(recipes);
    console.log(analyzedData);
};

main();
