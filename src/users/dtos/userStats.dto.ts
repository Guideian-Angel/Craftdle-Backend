import { ApiProperty } from "@nestjs/swagger";
import { AssetsDataDto } from "src/assets/dtos/assetsData.dto";

class GamemodesDto {
    @ApiProperty({ example: "Classic", description: 'The name of the gamemode' })
    gamemodeName: string;

    @ApiProperty({ example: 10, description: 'The amount of games played' })
    played: number;

    @ApiProperty({ example: 5, description: 'The amount of games solved' })
    solved: number;

    @ApiProperty({ example: 3, description: 'The amount of the tips of the game with the fewest tips' })
    fastestSolve: number;

    @ApiProperty({ example: "FFFF55", description: 'The color code of the gamemode' })
    color: string;
}

export class UserStatsDto {
    @ApiProperty({ example: "User123", description: 'The username of the user' })
    username: string;

    @ApiProperty({ description: 'The profile picture of the user', type: AssetsDataDto })
    profilePicture: AssetsDataDto;

    @ApiProperty({ description: 'The profile border of the user', type: AssetsDataDto })
    profileBorder: AssetsDataDto;

    @ApiProperty({ example: 16, description: 'The streak of the user' })
    streak: number;

    @ApiProperty({
        description: 'The games of the user',
        type: GamemodesDto,
        isArray: true,
        example: [
            { gamemodeName: "Classic", played: 10, solved: 5, fastestSolve: 3, color: "FFFF55" }
        ]
    })
    gamemodes: GamemodesDto[];

    @ApiProperty({ example: "2/26/2025", description: 'The registration date of the user' })
    registrationDate: string;

    @ApiProperty({
        description: 'Performed achievements stats',
        example: { collected: 5, collectable: 10 }
    })
    performedAchievements: {
        collected: number;
        collectable: number;
    };

    @ApiProperty({
        description: 'Collected recipes stats',
        example: { collected: 2, collectable: 5 }
    })
    collectedRecipes: {
        collected: number;
        collectable: number;
    };
}