import { ApiProperty } from '@nestjs/swagger';

export class UserCountDto {
    @ApiProperty({ example: 9 })
    guests: number;

    @ApiProperty({ example: 8 })
    registeredUsers: number;
}
