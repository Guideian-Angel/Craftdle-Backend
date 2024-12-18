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
    },
};

function collectMaterialsForGraph(materials, recipes){
    let graph = new Set(materials);
    let elementAdded = true;
    while(elementAdded && graph.size < 20){
        Object.keys(recipes).forEach(group => {
            recipes[group].forEach(recipe => {
                let mats;
                if(recipe.shapeless){
                    mats = recipe.recipe.required;
                }else{
                    mats = recipe.recipe;
                }
                if(checkForSameMaterial(graph, mats)){
                    graph = addMaterialsToSet(graph, mats)
                }
            });
        });
    };
    return graph.size >= 20;
};

function checkForSameMaterial(set, mats){
    mats.forEach(mat => {
        if(mat != null){
            if(Array.isArray(mat)){
                mat.forEach(element => {
                    if(set.includes(element)){
                        return true;
                    };
                });
            } else{
                if(set.includes(mat)){
                    return true;
                };
            };
        };
    });
    return false;
};

function addMaterialsToSet(set, mats){
    let result = set;
    mats.forEach(mat => {
        if(mat != null){
            if(Array.isArray(mat)){
                result.add(mat[Math.floor(Math.random()*mat.length)]);
            } else{
                result.add(mat)
            }
        };
    });
    return result;
};

function geatherDataAboutRecipe(recipes, recipe){
    const hasGraphScore20 = collectMaterialsForGraph(recipes);
};

function analyzeRecipes(recipes){
    Object.keys(recipes).forEach(group => {
        recipes[group].forEach(recipe => {
            console.log(recipe);
        })
    });
    return true;
};

async function main() {
    try {
        //const filePath = await getFilePath();
        const filePath = "./newRecipes.json";
        const recipes = await fetchJSONFile(filePath);
        const analyzedData = analyzeRecipes(recipes.data);
        console.log(analyzedData);
    } catch (err) {
        console.error("An error occurred:", err.message);
    };
};

main();
