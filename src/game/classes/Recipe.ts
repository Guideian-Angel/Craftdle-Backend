import { createMatrixFromArray } from 'src/shared/utilities/arrayFunctions';
import { IShapelessRecipeData, IShapedRecipeData } from '../interfaces/IRecipeData';

export class Recipe {
    name: string;
    id: string;
    shapeless: boolean;
    required: Array<Array<string>>;
    optionalMaterials?: string[] | null;
    recipe?: Array<Array<string[] | null>> | null;
    src: string;
    enabledGamemodes: number[];

    constructor(data: IShapedRecipeData | IShapelessRecipeData) {
        this.name = data.name;
        this.id = data.id;
        this.shapeless = data.shapeless;
        this.required = this.collectMaterials(data);
        this.optionalMaterials = this.isShapelessRecipeData(data) && data.recipe.optional ? data.recipe.optional : null;
        this.recipe = !data.shapeless ? createMatrixFromArray(data.recipe as Array<Array<string>>) : null;
        this.src = data.src;
        this.enabledGamemodes = data.enabledGamemodes;
    }

    private collectMaterials(data): Array<Array<string>> {
        if(data.shapeless) {
            let materials = [];
            data.recipe.required.forEach(material => {
                if(!Array.isArray(material)) {
                    materials.push([material]);
                } else{
                    materials.push(material);
                }
            });
            return materials;
        }
        return data.recipe.filter(Boolean);
    }

    private isShapelessRecipeData(data: IShapelessRecipeData | IShapedRecipeData): data is IShapelessRecipeData {
        return data.shapeless;
    }

    private createRecipeObject(){
        if(this.shapeless){
            return {
                required: this.required,
                optional: this.optionalMaterials
            }
        }
        return this.recipe;
    }

    toJSON(){
        return {
            id: this.id,
            name: this.name,
            recipe: this.createRecipeObject(),
            shapeless: this.shapeless,
            src: this.src,
        }
    }
}
