import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceDto {
    @ApiProperty({
        example: '2025-04-02T00:00:00.000Z',
        description: 'Date of start of maintenance (ISO format)',
    })
    @IsDefined()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    start: Date;

    @ApiProperty({
        example: '2025-04-03T00:00:00.000Z',
        description: 'Date of end of maintenance (ISO format)',
    })
    @IsDefined()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    end: Date;
}
