import { IsBoolean, IsDefined } from "class-validator";

export class AddAdminRightsDto {
    @IsDefined()
    @IsBoolean()
    modifyMaintenance: boolean;

    @IsDefined()
    @IsBoolean()
    modifyUsers: boolean;

    @IsDefined()
    @IsBoolean()
    modifyAdmins: boolean;
}