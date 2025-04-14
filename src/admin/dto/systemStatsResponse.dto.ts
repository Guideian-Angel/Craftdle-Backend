import { ApiProperty } from '@nestjs/swagger';
import { UserCountDto } from './userCount.dto';
import { GamesTodayDto } from './gamesToday.dto';
import { PlayedGamesDto } from './playedGames.dto';

export class SystemStatsResponseDto {
    @ApiProperty({ type: UserCountDto })
    numberOfUsers: UserCountDto;

    @ApiProperty({ example: 7 })
    numberOfGames: number;

    @ApiProperty({ example: 0 })
    numberOfActiveUsersToday: number;

    @ApiProperty({ type: GamesTodayDto })
    numberOfPlayedGamesToday: GamesTodayDto;

    @ApiProperty({ type: PlayedGamesDto })
    playedGames: PlayedGamesDto;

    @ApiProperty({
        example: {
            '2025. 03. 25.': { Resource: 1 },
            '2025. 04. 11.': { Resource: 1 },
            '2025. 04. 12.': { Tutorial: 1 },
        },
        description: 'Games played by date and gamemode',
        type: 'object',
        additionalProperties: {
            type: 'object',
            additionalProperties: { type: 'number' },
        },
    })
    gamemodes: Record<string, Record<string, number>>;

    @ApiProperty({
        example: {
            '2025. 03. 17.': 1,
            '2025. 03. 24.': 1,
            '2025. 03. 25.': 4,
            '2025. 04. 03.': 1,
            '2025. 04. 12.': 1,
        },
        description: 'Registrations by date',
        type: 'object',
        additionalProperties: { type: 'number' },
    })
    registrationsByDate: Record<string, number>;
}
