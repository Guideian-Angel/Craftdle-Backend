import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

//DTO a frontendtől érkező login adatok validálására
export class LoginDataDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Guest123', description: 'The username or email of the user' })
    usernameOrEmail: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Password123', description: 'The password of the user' })
    password: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: false, description: 'User wants to stay logged in' })
    stayLoggedIn: boolean;
}