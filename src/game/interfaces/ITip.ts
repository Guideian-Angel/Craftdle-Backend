import { IItem } from "./IItem";

export interface ITip {
    item: IItem;
    table: {item: string, status: string}
}