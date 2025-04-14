import { ApiProperty } from '@nestjs/swagger';

export class PlayedGamesDto {
    @ApiProperty({ example: 1 })
    solved: number;

    @ApiProperty({ example: 6 })
    unsolved: number;
}
