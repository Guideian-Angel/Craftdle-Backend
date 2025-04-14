import { ApiProperty } from '@nestjs/swagger';

export class CollectionStatsDto {
    @ApiProperty({ example: 0 })
    collected: number;

    @ApiProperty({ example: 899 })
    total: number;
}
