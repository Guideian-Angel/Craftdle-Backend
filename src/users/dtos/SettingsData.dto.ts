import { IsBoolean, IsNumber, IsString, IsArray, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateControlsDto {
    @IsBoolean()
    isTapMode: boolean;

    @IsString()
    @Length(1, 3)
    copy: string;

    @IsString()
    @Length(1, 3)
    remove: string;

    @IsArray()
    @Length(9, 9, { each: true })
    @IsString({ each: true })
    tableMapping: string[];
}

export class UpdateSettingsDto {
    @IsNumber()
    volume: number;

    @IsNumber()
    imagesSize: number;

    @IsBoolean()
    isSet: boolean;

    @ValidateNested()
    @Type(() => UpdateControlsDto)
    controls: UpdateControlsDto;
}
