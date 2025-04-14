import { ApiProperty } from '@nestjs/swagger';

export class AdminRightsDto {
    @ApiProperty({ example: true })
    modifyUsers: boolean;

    @ApiProperty({ example: true })
    modifyMaintenance: boolean;

    @ApiProperty({ example: true })
    modifyAdmins: boolean;
}
