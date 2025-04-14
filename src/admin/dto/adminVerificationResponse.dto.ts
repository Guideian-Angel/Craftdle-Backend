import { ApiProperty } from '@nestjs/swagger';
import { AdminRightsDto } from './adminRigths.dto';
import { AdminVerificationDto } from './adminVerisfication.dto';

export class AdminVerificationResponseDto {
    @ApiProperty({ example: 4 })
    id: number;

    @ApiProperty({ example: 'Admin' })
    username: string;

    @ApiProperty({ example: false })
    isGuest: boolean;

    @ApiProperty({ example: 'c4a2c645-5a45-41c1-add0-3600cc85aa76' })
    token: string;

    @ApiProperty({ example: null, nullable: true })
    socketId?: string;

    @ApiProperty({ example: null, nullable: true })
    passwordReset?: any;

    @ApiProperty({ type: AdminRightsDto })
    adminRights: AdminRightsDto;

    @ApiProperty({ type: AdminVerificationDto })
    adminVerification: AdminVerificationDto;
}
