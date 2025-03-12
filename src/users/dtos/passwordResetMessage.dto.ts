import { ApiProperty } from "@nestjs/swagger"

export class PasswordResetMessageDto {
    @ApiProperty({ example: "Verification successful", description: 'The title of the message' })
    text: string

    @ApiProperty({ example: "#00aa00", description: 'The color of the title' })
    color: string
}