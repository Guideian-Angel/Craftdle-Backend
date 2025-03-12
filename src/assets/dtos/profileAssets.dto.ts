import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";

export class ProfileAssetsDataDto {
    @IsDefined()
    @IsNumber()
    @ApiProperty({ example: 1, description: 'The id of the asset' })
    profilePicture: number;

    @IsDefined()
    @IsNumber()
    @ApiProperty({ example: 1, description: 'The id of the asset' })
    profileBorder: number;
}