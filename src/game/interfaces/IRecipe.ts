export interface IRecipe{
    id: string,
    name: string,
    layout?: Array<Array<string[] | null>>,
    materials: string[],
    optionalMaterials?: string[],
    shapeless: boolean,
    src?: string,
    availableGamemodes?: number[];
}