import readline from 'node:readline';
import { promises as fs } from 'fs';
import path from 'path';

class Graph {
    content = [];

    get(){
        return this.content;
    }

    size(){
        return this.content.length;
    }

    add(element){
        let notIncluded = true;
        element.forEach(e => {
            this.content.forEach(c => {
                if(c.includes(e)){
                    notIncluded = false;
                }
            })
        })
        if(notIncluded){
            this.content.push(element);
        }
    }
}

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
    }
};

async function writeJSONToFile(src, data) {
    try {
        const absolutePath = path.resolve(src);
        const jsonData = JSON.stringify({ data }, null, 2);
        await fs.writeFile(absolutePath, jsonData, 'utf-8');
        console.log("File successfully updated.");
    } catch (err) {
        console.error("Error writing to the file:", err.message);
        throw err;
    }
};

function isValidMaterial(material) {
    return material !== null && material !== undefined;
}

function processMaterials(materials, callback) {
    let result = [];
    materials.forEach(material => {
        if (isValidMaterial(material)) {
            if (Array.isArray(material)) {
                result.push(material[Math.floor(Math.random() * material.length)]);
            } else {
                result.push(material);
            }
        }
    });
    return callback ? callback(result) : result;
}

function getMaterialsForRecipe(recipe) {
    return recipe.shapeless
        ? recipe.recipe.required
        : processMaterials(recipe.recipe);
}

function countDifferentMaterials(materials){
    let result = new Set();
    materials.forEach(material => {
        if(material){
            result.add(material[0])
        }
    });
    return result.size > 1;
}

function converRecipeGridToMatrix(grid) {
    const matrix = [];
    for (let i = 0; i < grid.length; i += 3) {
        matrix.push(grid.slice(i, i + 3));
    }
    return matrix;
}

function checkRightGridSizeOfRecipe(recipe) {
    if (recipe.shapeless) {
        return recipe.recipe.required.length <= 4;
    }
    const matrix = converRecipeGridToMatrix(recipe.recipe);
    return matrix.length < 3 && matrix.every(row => row.length < 3);
}

function createResourceInventory(recipes, mats) {
    let graph = createSetFromMaterials(mats);
    while (graph.size() < 20) {
        for (const group of shuffleArray(Object.keys(recipes))) {
            if (group !== "gaLogo0") {
                for (const recipe of shuffleArray(recipes[group])) {
                    const mats = recipe.required;
                    if (checkForSameMaterial(graph, mats)) {
                        addMaterialsToSet(graph, mats);
                        break;
                    }
                };
                if (graph.size() >= 20) {
                    break;
                }
            }
        };
    }
    return graph.size() >= 20;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
};

function checkForSameMaterial(set, mats) {
    return mats.some(mat =>
        mat.some(element => set.content.some(row => row.includes(element)))
    );
}

function addMaterialsToSet(set, materials) {
    materials.forEach(material => {
        set.add(material);
    })
}

function createSetFromMaterials(materials) {
    let result = new Graph();
    materials.forEach(material => {
        result.add(material);
    });
    return result;
}

function geatherDataAboutRecipe(recipes, recipe) {
    const materialsOfRecipe = getMaterialsForRecipe(recipe);
    const hasGraphScore20 = createResourceInventory(materialsOfRecipe, recipes);
    const validMatrixForPocketMode = checkRightGridSizeOfRecipe(recipe);
    const hasMoreThanOneTypeOfMaterial = countDifferentMaterials(recipe.shapeless ? recipe.recipe.required : recipe.recipe);
    const isSelfCraftRecipe = materialsOfRecipe.includes(recipe.id);

    const enabledGamemodesForRecipe = [4];
    if (hasMoreThanOneTypeOfMaterial && !isSelfCraftRecipe) {
        enabledGamemodesForRecipe.push(2, 3, 7);
        if (hasGraphScore20) {
            enabledGamemodesForRecipe.push(6);
        }
        if (validMatrixForPocketMode) {
            enabledGamemodesForRecipe.push(5);
        }
    }
    return enabledGamemodesForRecipe;
}

function convertDictToValidArray(dict) {
    const maxIndex = Math.max(...Object.keys(dict).map(Number));
    return Array.from({ length: maxIndex + 1 }, (_, i) => dict[i.toString()] || null);
}

function convertCellsToList(recipe) {
    let result = [];
    recipe.forEach(element => {
        let cell = element && !Array.isArray(element) ? [element] : element;
        result.push(cell);
    });
    return result;
}

function analyzeRecipes(data) {
    Object.keys(data).forEach(group => {
        const availableGamemodes = geatherDataAboutRecipe(data, data[group][0]);
        data[group].forEach(recipe => {
            recipe["enabledGamemodes"] = availableGamemodes;
        });
    });
    return data;
}

function convertEveryRecipeToArray(data) {
    Object.keys(data).forEach(group => {
        data[group].forEach(recipe => {
            if(!recipe.shapeless){
                if(!Array.isArray(recipe.recipe)){
                    recipe.recipe = convertDictToValidArray(recipe.recipe);
                };
                recipe.recipe = convertCellsToList(recipe.recipe);
            };
        });
    });
    return data;
}

async function main() {
    const filePath = "./localData/recipes.json";
    let recipes = await fetchJSONFile(filePath);
    recipes = convertEveryRecipeToArray(recipes.data);
    const analyzedData = analyzeRecipes(recipes);
    await writeJSONToFile(filePath, analyzedData);
}

main();