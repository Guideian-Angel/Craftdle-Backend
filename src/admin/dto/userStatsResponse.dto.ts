import { ApiProperty } from '@nestjs/swagger';
import { AchievementStatsDto } from './achievementStats.dto';
import { CollectionStatsDto } from './collectionStats.dto';

export class UserStatsResponseDto {
    @ApiProperty({ example: 6 })
    id: number;

    @ApiProperty({ example: 'Player112' })
    username: string;

    @ApiProperty({
        example: '2025-03-25T09:15:45.000Z',
        description: 'The date when the user registered',
    })
    registration_date: Date;

    @ApiProperty({ example: 0 })
    streak: number;

    @ApiProperty({ type: AchievementStatsDto })
    achievements: AchievementStatsDto;

    @ApiProperty({ type: CollectionStatsDto })
    collection: CollectionStatsDto;

    @ApiProperty({
        example: 'Resource',
        description: 'The gamemode that the user played the most',
    })
    favoriteGamemode: string;

    @ApiProperty({
        example: {
            '2025-03-25': {
                Resource: 1,
            },
        },
        description: 'A record of gamemodes played by the user, where the key is the date and the value is an object with gamemode names as keys and play counts as values.',
        type: 'object',
        additionalProperties: {
            type: 'object',
            additionalProperties: { type: 'number' },
        },
    })
    playedGamemodes: Record<string, Record<string, number>>;
}
