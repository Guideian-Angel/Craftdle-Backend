import { ApiProperty } from '@nestjs/swagger';

export class PlayedGamemodesDto {
    @ApiProperty({
        example: {
            '2025-03-25': {
                Resource: 1,
            },
        },
        description: 'A record of gamemodes played by the user, where the key is the date and the value is an object with gamemode names as keys and play counts as values.',
        type: 'object',
        additionalProperties: {
            type: 'object',
            additionalProperties: { type: 'number' },
        },
    })
    playedGamemodes: Record<string, Record<string, number>>;
}
