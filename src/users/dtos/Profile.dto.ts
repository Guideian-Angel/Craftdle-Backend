import { IsDefined, IsNumber } from "class-validator";

export class ProfileDto {
    @IsDefined()
    @IsNumber()
    profilePicture: number;

    @IsDefined()
    @IsNumber()
    profileBorder: number;
}