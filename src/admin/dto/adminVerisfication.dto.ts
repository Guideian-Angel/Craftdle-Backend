import { ApiProperty } from '@nestjs/swagger';

export class AdminVerificationDto {
    @ApiProperty({ example: '801404' })
    code: string;

    @ApiProperty({ example: '2025-04-14T16:47:35.304Z', description: 'Verification code expiration date' })
    expiration: Date;

    @ApiProperty({ example: true })
    verified: boolean;
}
