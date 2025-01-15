export class Recipe {
    name: string;
    id: string;
    shapeless: boolean;
    materials: Array<Array<string>>;
    optionalMaterials?: string[];
    layout?: Array<Array<string[] | null>>;
    src: string;
    availableGamemodes: number[];

    constructor(data: any) {
        this.name = data.name;
        this.id = data.id;
        this.shapeless = data.shapeless;
        this.materials = this.collectMaterials(data);
        this.optionalMaterials = data.shapeless ? data.recipe.optional : null;
        this.layout = data.recipe || [];
    }

    private collectMaterials(data): Array<Array<string>> {
        return data.shapeless? data.recipe.required : data.recipe.flat().filter(Boolean);
    }
}
