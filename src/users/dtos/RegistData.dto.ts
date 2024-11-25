import { IsString, IsEmail, IsBoolean, Length, Matches } from 'class-validator';

export class RegistDataDto {
    @IsString()
    @Length(5, 16, { message: 'Username must be between 5 and 16 characters.' })
    @Matches(/^[A-Za-z0-9.,;:$#'!"/?%&()@]+$/, {
        message: 'Username contains invalid characters.',
    })
    username: string;

    @IsEmail({}, { message: 'Invalid email address.' })
    email: string;

    @IsString()
    @Length(5, 16, { message: 'Password must be between 5 and 16 characters.' })
    @Matches(/^[A-Za-z0-9.,;:$#'!"/?%&()@]+$/, {
        message: 'Password contains invalid characters.',
    })
    password: string;

    @IsBoolean()
    stayLoggedIn: boolean;
}