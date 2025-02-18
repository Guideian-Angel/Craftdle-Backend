import { PartialType } from "@nestjs/mapped-types";
import { AddAdminRightsDto } from "./add-admin-rights.dto";

export class UpdateAdminRightsDto extends PartialType(AddAdminRightsDto) {}