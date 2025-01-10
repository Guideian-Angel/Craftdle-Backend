export class Recipe {
    name: string;
    id: string;
    shapeless: boolean;
    materials: string[];
    optionalMaterials: string[];
    layout: Array<Array<Array<string> | null>>;

    constructor(data: any) {
        this.name = data.name;
        this.id = data.id;
        this.shapeless = data.shapeless;
        this.materials = this.collectMaterials(data);
        this.optionalMaterials = data.shapeless? data.recipe.optional : null;
        this.layout = data.recipe || [];
    }

    private collectMaterials(data): string[] {
        return data.shapeless? data.recipe.required : data.recipe.flat().filter(Boolean);
    }
}
