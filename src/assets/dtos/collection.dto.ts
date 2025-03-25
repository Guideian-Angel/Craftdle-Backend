import { ApiProperty } from "@nestjs/swagger";

class ProfileAssetsDataDto {
    @ApiProperty({ example: 1, description: 'The id of the asset' })
    id: number;

    @ApiProperty({ example: 'Test', description: 'The name of the asset' })
    name: string;

    @ApiProperty({ example: 'test.png', description: 'The source of the asset' })
    src: string;

    @ApiProperty({ example: true, description: 'The asset is collected' })
    collected: boolean;

    @ApiProperty({ example: true, description: 'The asset is active' })
    active: boolean;

    @ApiProperty({ example: 'unlock', description: 'The unlock condition of the asset' })
    unlock: string;
}

class InventoryDataDto {
    @ApiProperty({ example: 1, description: 'The id of the asset' })
    id: number;

    @ApiProperty({ example: 'Test', description: 'The name of the asset' })
    name: string;

    @ApiProperty({ example: 'test.png', description: 'The source of the asset' })
    src: string;

    @ApiProperty({ example: true, description: 'The asset is collected' })
    collected: boolean;
}

class AchievementDataDto {
    @ApiProperty({ example: 1, description: 'The id of the achievement' })
    id: number;

    @ApiProperty({ example: 'Test.png', description: 'The icon of the achievement' })
    icon: string;

    @ApiProperty({ example: 'Test', description: 'The title of the achievement' })
    title: string;

    @ApiProperty({ example: 'Test', description: 'The description of the achievement' })
    description: string;

    @ApiProperty({ example: 10, description: 'The goal of the achievement' })
    goal: number;

    @ApiProperty({ example: 1, description: 'The rarity of the achievement' })
    rarity: number;

    @ApiProperty({ example: 0, description: 'The progress of the achievement' })
    progress: number;

    @ApiProperty({ example: true, description: 'The achievement is completed' })
    collected: boolean;
}

export class CollectionDataDto {
    @ApiProperty({
        description: 'Profile pictures',
        type: ProfileAssetsDataDto,
        isArray: true,
        example: [
            { id: 1, name: 'Desert Villager Base', src: 'Desert Villager Base.png', collected: true, active: true, unlock: 'Welcome to the Database!' }
        ]
    })
    profilePictures: ProfileAssetsDataDto[];

    @ApiProperty({
        description: 'Profile borders',
        type: ProfileAssetsDataDto,
        isArray: true,
        example: [
            { id: 2, name: 'Grass', src: 'Grass.png', collected: false, active: false, unlock: 'Welcome to the Database!' }
        ]
    })
    profileBorders: ProfileAssetsDataDto[];

    @ApiProperty({
        description: 'Inventory items',
        type: InventoryDataDto,
        isArray: true,
        example: [
            { id: 3, name: 'Iron Sword', src: 'Iron_Sword.png', collected: true }
        ]
    })
    inventory: InventoryDataDto[];

    @ApiProperty({
        description: 'Achievements',
        type: AchievementDataDto,
        isArray: true,
        example: [
            { id: 4, icon: 'Craftdle_Logo.png', title: 'Welcome to the Database!', description: 'Create a Craftdle account', goal: 1, rarity: 1, progress: 0, collected: false }
        ]
    })
    achievements: AchievementDataDto[];
}