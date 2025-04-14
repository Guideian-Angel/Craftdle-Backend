import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        example: 'c4a2c645-5a45-41c1-add0-3600cc85aa76',
        description: 'Generated token for the user',
    })
    token: string;
}
