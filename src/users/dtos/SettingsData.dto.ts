import { IsBoolean, IsNumber, IsString, IsArray, Length, ValidateNested, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateControlsDto {
    @IsBoolean({ message: 'isTapMode must be a boolean value.' })
    isTapMode: boolean;

    @IsString({ message: 'Copy must be a string.' })
    @Length(1, 3, { message: 'Copy must be between 1 and 3 characters.' })
    copy: string;

    @IsString({ message: 'Remove must be a string.' })
    @Length(1, 3, { message: 'Remove must be between 1 and 3 characters.' })
    remove: string;

    @IsArray({ message: 'TableMapping must be an array.' })
    @Length(9, 9, { each: true, message: 'Each entry in TableMapping must have a length of 9 characters.' })
    @IsString({ each: true, message: 'Each entry in TableMapping must be a string.' })
    tableMapping: string[];
}

export class UpdateSettingsDto {
    @IsNumber({}, { message: 'Volume must be a number.' })
    @Min(0, { message: 'Volume must be at least 0.' })
    @Max(100, { message: 'Volume cannot exceed 100.' })
    volume: number;

    @IsNumber({}, { message: 'ImagesSize must be a number.' })
    @Min(0, { message: 'ImagesSize must be at least 0.' })
    @Max(100, { message: 'ImagesSize cannot exceed 100.' })
    imagesSize: number;

    @IsBoolean({ message: 'isSet must be a boolean value.' })
    isSet: boolean;

    @ValidateNested({ message: 'Controls validation failed.' })
    @Type(() => UpdateControlsDto)
    controls: UpdateControlsDto;
}
