interface BaseGamemode{
    id: number;
    icon: string;
    name: string;
    description: string;
};

interface Difficulty{
    id: number;
    name: string;
    color_code: string;
};

export interface IGamemode extends BaseGamemode {
    difficulty: Omit<Difficulty, 'id'>;
    continueGame: boolean;
}

export interface IGamemodeWithDifficulties extends BaseGamemode{
    difficulties: Difficulty;
};