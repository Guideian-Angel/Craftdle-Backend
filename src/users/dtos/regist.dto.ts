import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, Length, Matches, IsNotEmpty } from 'class-validator';

export class RegistDataDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required.' })
    @Length(5, 16, { message: 'Username must be between 5 and 16 characters.' })
    @Matches(/^[A-Za-z0-9.,;:$#!/?%&()]+$/, {
        message: 'Username contains invalid characters.',
    })
    @ApiProperty({ example: 'User123', description: 'The username of the user' })
    username: string;

    @IsEmail({}, { message: 'Invalid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    @ApiProperty({ example: 'The email of the user', description: 'The email of the user' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required.' })
    @Length(5, 16, { message: 'Password must be between 5 and 16 characters.' })
    @ApiProperty({ example: 'Password123', description: 'The password of the user' })
    password: string;

    @IsBoolean()
    @IsNotEmpty({ message: 'StayLoggedIn flag is required.' })
    @ApiProperty({ example: false, description: 'User wants to stay logged in' })
    stayLoggedIn: boolean;
}
