import { PartialType } from "@nestjs/mapped-types";
import { AddAdminRightsDto } from "./addAdminRights.dto";

export class UpdateAdminRightsDto extends PartialType(AddAdminRightsDto) {}