import { ApiProperty } from "@nestjs/swagger";

export class PasswordResetDto {
    @ApiProperty({ example: "example@email.com", description: 'The email of the user' })
    emial: string;
}

export class PasswordResetResponseDto {
    @ApiProperty({ example: 1, description: 'The id of the picture' })
    id: number;

    @ApiProperty({ example: "test_test", description: 'The id of the picture' })
    item_id: string;

    @ApiProperty({ example: "Test", description: 'The name of the picture' })
    name: string;

    @ApiProperty({ example: 'Test.png', description: 'The source of the picture' })
    src: string;
}