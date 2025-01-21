import { IItem } from "./IItem";

export interface ICheckedTip{
    item: IItem
    table: Array<{item: string, status: string}>
}