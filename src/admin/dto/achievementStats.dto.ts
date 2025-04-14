import { ApiProperty } from '@nestjs/swagger';

export class AchievementStatsDto {
    @ApiProperty({ example: 1 })
    collected: number;

    @ApiProperty({ example: 56 })
    total: number;
}
