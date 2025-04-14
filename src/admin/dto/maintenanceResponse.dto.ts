import { ApiProperty } from '@nestjs/swagger';

export class MaintenanceResponseDto {
    @ApiProperty({ example: 2 })
    id: number;

    @ApiProperty({ example: 4, description: 'ID of the user who created the maintenance' })
    user: number;

    @ApiProperty({ example: '2025-04-02T00:00:00.000Z' })
    start: Date;

    @ApiProperty({ example: '2025-04-03T00:00:00.000Z' })
    end: Date;

    @ApiProperty({ example: false })
    active: boolean;
}
