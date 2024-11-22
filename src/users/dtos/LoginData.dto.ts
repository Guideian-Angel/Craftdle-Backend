import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

//DTO a frontendtől érkező login adatok validálására
export class LoginDataDto {
    @IsString()
    @IsNotEmpty()
    usernameOrEmail: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    stayLoggedIn: boolean;
}