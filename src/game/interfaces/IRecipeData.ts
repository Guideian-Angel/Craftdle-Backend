interface IbaseRecipeData {
    id: string;
    name: string;
    shapeless: boolean;
    src: string;
    enabledGamemodes: number[];
}

export interface IShapedRecipeData extends IbaseRecipeData {
    recipe: Array<string[] | null>;
}

export interface IShapelessRecipeData extends IbaseRecipeData {
    recipe: {optional?: string[], required: string[]};
}