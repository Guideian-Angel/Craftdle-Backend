import { ApiProperty } from "@nestjs/swagger";
import { IAsset } from "../interfaces/assets.interface";

export class AssetsDataDto implements IAsset{
    @ApiProperty({ example: 1, description: 'The id of the asset' })
    id: number;

    @ApiProperty({ example: 'Test', description: 'The name of the asset' })
    name: string;

    @ApiProperty({ example: 'test.png', description: 'The source of the asset' })
    src: string;
}