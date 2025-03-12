import { IsBoolean, IsNumber, IsString, IsArray, Length, ValidateNested, Min, Max, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UpdateControlsDto {
    @IsBoolean({ message: 'isTapMode must be a boolean value.' })
    @ApiProperty({ example: true, description: 'User wants to use tap mode' })
    isTapMode: boolean;

    @IsString({ message: 'Copy must be a string.' })
    @Length(1, 3, { message: 'Copy must be between 1 and 3 characters.' })
    @ApiProperty({ example: 'LMB', description: 'The copy button key' })
    copy: string;

    @IsString({ message: 'Remove must be a string.' })
    @Length(1, 3, { message: 'Remove must be between 1 and 3 characters.' })
    @ApiProperty({ example: 'RMB', description: 'The remove button key' })
    remove: string;

    @IsArray({ message: 'TableMapping must be an array.' })
    @ArrayMinSize(9, { message: 'TableMapping must have at least 9 entries.' })
    @ArrayMaxSize(9, { message: 'TableMapping must have at most 9 entries.' })
    @IsString({ each: true, message: 'Each entry in TableMapping must be a string.' })
    @ApiProperty({ example: ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'], description: 'The table mapping' })
    tableMapping: string[];
}

export class UpdateSettingsDto {
    @IsNumber({}, { message: 'Volume must be a number.' })
    @Min(0, { message: 'Volume must be at least 0.' })
    @Max(100, { message: 'Volume cannot exceed 100.' })
    @ApiProperty({ example: 50, description: 'The volume of the game' })
    volume: number;

    @IsNumber({}, { message: 'ImagesSize must be a number.' })
    @Min(1, { message: 'ImagesSize must be at least 1.' })
    @Max(100, { message: 'ImagesSize cannot exceed 100.' })
    @ApiProperty({ example: 50, description: 'The size of the images' })
    imagesSize: number;

    @IsBoolean({ message: 'isSet must be a boolean value.' })
    @ApiProperty({ example: true, description: 'User has set the settings' })
    isSet: boolean;

    @ValidateNested({ message: 'Controls validation failed.' })
    @Type(() => UpdateControlsDto)
    @ApiProperty({ type: UpdateControlsDto, description: 'The control settings' })
    controls: UpdateControlsDto;
}
