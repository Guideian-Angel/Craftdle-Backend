import { IAsset } from "src/assets/interfaces/assets.interface";
import { IUserData } from "../interfaces/user.interface";
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { AssetsDataDto } from "src/assets/dtos/assetsData.dto";
import { applyDecorators, Type } from "@nestjs/common";

export class UserDataDto implements IUserData {
    @ApiProperty({ example: 'Guest316', description: 'The username of the user' })
    username: string;

    @ApiProperty({ example: '1550a132-c984-4593-adc9-43e8822fd0fa', description: 'The login token of the user' })
    loginToken: string;

    @ApiProperty({ example: false, description: 'User wants to stay logged in' })
    stayLoggedIn: boolean;

    @ApiProperty({ example: true, description: 'User is a guest' })
    isGuest: boolean;

    @ApiProperty({type: AssetsDataDto, description: 'The profile picture of the user' })
    profilePicture: IAsset;

    @ApiProperty({type: AssetsDataDto, description: 'The profile border of the user' })
    profileBorder: IAsset;
}