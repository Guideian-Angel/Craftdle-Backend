export class Graph {
    content: Array<string[]> = [];

    get(){
        return this.content;
    }

    size(){
        return this.content.length;
    }

    add(element: string[]){
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