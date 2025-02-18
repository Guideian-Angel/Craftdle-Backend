import { IsBoolean, IsDefined } from "class-validator";

export class AddAdminRightsDto {
    @IsDefined()
    @IsBoolean()
    modify_maintenance: boolean;

    @IsDefined()
    @IsBoolean()
    modify_users: boolean;

    @IsDefined()
    @IsBoolean()
    modify_admins: boolean;
}