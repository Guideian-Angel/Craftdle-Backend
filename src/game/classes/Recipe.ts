import { createMatrixFromArray } from 'src/shared/utilities/arrayFunctions';
import { IShapelessRecipeData, IShapedRecipeData } from '../interfaces/IRecipeData';
import { RecipeFunctions } from './RecipeFunctions';

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
        this.required = RecipeFunctions.collectMaterials(data);
        this.optionalMaterials = RecipeFunctions.isShapelessRecipeData(data) && data.recipe.optional ? data.recipe.optional : null;
        this.recipe = !data.shapeless ? createMatrixFromArray(data.recipe as Array<Array<string>>) : null;
        this.src = data.src;
        this.enabledGamemodes = data.enabledGamemodes;
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
