import { ApiProperty } from '@nestjs/swagger';

export class GamesTodayDto {
    @ApiProperty({ example: 0 })
    played: number;

    @ApiProperty({ example: 0 })
    solved: number;
}
