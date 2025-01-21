import { IItem } from "./IItem";

export interface IMatrixCompareResponse {
    solved: boolean;
    result: Array<{item: string, status: string} | null>;
    matches: number;
}