import { ApiProperty } from "@nestjs/swagger"
import { IsDefined } from "class-validator"

export class PasswordChangeDto {
    @IsDefined()
    @ApiProperty({ example: "1550a132-c984-4593-adc9-43e8822fd0fa", description: 'The token for the password changing' })
    token: string

    @IsDefined()
    @ApiProperty({ example: "Test1234", description: 'The new password' })
    password: string
}