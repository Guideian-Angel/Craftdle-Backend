import { ApiProperty } from '@nestjs/swagger';

export class UserListItemDto {
    @ApiProperty({ example: 4 })
    id: number;

    @ApiProperty({ example: 'Admin' })
    username: string;

    @ApiProperty({
        example: ['modifyUsers', 'modifyMaintenance', 'modifyAdmins'],
        description: 'Rigths of the user',
        isArray: true,
        enum: ['modifyUsers', 'modifyMaintenance', 'modifyAdmins'],
    })
    rights: string[];

    @ApiProperty({ example: 0, description: 'Number of games played on the following days (streak)' })
    streak: number;

    @ApiProperty({
        oneOf: [
            { type: 'string', format: 'date-time', example: '2025-04-11T14:11:05.000Z' },
            { type: 'string', example: 'This player did not play any games yet.' },
        ],
        description: 'Data of last played game or a message if the player has not played any games yet.',
    })
    lastplayed: string; // Vagy Date, de Swaggernek string
}
