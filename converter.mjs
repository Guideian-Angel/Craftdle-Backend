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
}

async function fetchJSONFile(src) {
    try {
        const absolutePath = path.resolve(src);
        const data = await fs.readFile(absolutePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading or parsing the file:", err.message);
        throw err;
    }
}

function geatherDataAboutRecipe(recipe){
    
}

function analyzeRecipes(recipes){
    Object.keys(recipes).forEach(group => {
        recipes[group].forEach(recipe => {
            console.log(recipe);
        })
    });
    return true;
}

async function main() {
    try {
        //const filePath = await getFilePath();
        const filePath = "./newRecipes.json"
        const recipes = await fetchJSONFile(filePath);
        const analyzedData = analyzeRecipes(recipes.data);
        console.log(analyzedData)
    } catch (err) {
        console.error("An error occurred:", err.message);
    }
}

main();
