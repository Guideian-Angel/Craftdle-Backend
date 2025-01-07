export class Recipe {
    name: string;
    id: string;
    materials: string[];
    layout: Array<Array<Array<string> | null>>;

    constructor(data: any) {
        this.name = data.name;
        this.id = data.id;
        this.materials = data.materials || [];
        this.layout = data.recipe || [];
    }
}
