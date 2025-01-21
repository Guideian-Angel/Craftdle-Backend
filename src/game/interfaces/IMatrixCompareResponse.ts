import { IItem } from "./IItem";

export interface IMatrixCompareResponse {
    solved: boolean;
    result: Array<{item: IItem, status: string} | null>;
    matches: number;
}