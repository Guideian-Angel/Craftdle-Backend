type item = {
    id: string
    name: string
    src: string
}

type tableSlot = {
    item: string
    status: string
}

export class Tip {
    item: item
    table: tableSlot[]
}