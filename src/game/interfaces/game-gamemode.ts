export interface IGamemode {
    id: number;
    icon: string;
    name: string;
    description: string;
    difficulty: {
        name: string;
        color_code: string;
    };
    continueGame: boolean;
}