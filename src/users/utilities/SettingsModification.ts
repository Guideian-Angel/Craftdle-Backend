import { PrismaService } from "src/prisma/prisma.service";
import { ISettings } from "../interfaces/ISettings";
import { NotFoundException } from "@nestjs/common";
import { UpdateSettingsDto } from "../dtos/SettingsData.dto";

export async function modifySettings(settingsId: number, userId: number, settingsData: UpdateSettingsDto, prisma: PrismaService) {
    // Ellenőrizzük, hogy a beállítások a felhasználóhoz tartoznak-e
    const settings = getSettings(settingsId, userId, prisma)

    if (!settings) {
        throw new NotFoundException('Settings not found');
    }

    // Frissítjük a Settings rekordot
    updateSettings(settingsId, settingsData, prisma);

     // Frissítjük a Controls rekordot
    const updatedControlsId = (await updateControls(settingsId, settingsData, prisma)).id;

    // Frissítjük a TableMappings rekordokat
    updateTableMappings(updatedControlsId, settingsData, prisma);
}

async function getSettings(settingsId: number, userId: number, prisma: PrismaService) {
    const result = await prisma.settings.findFirst({
        where: {
            id: settingsId,
            user: userId,
        },
    });

    return result;
}

function updateSettings(settingsId: number, settingsData: UpdateSettingsDto, prisma: PrismaService) {
    prisma.settings.update({
        where: { id: settingsId },
        data: {
            volume: settingsData.volume,
            image_size: settingsData.imagesSize,
            is_set: settingsData.isSet,
        },
    });
}

async function updateControls(settingsId: number, settingsData: UpdateSettingsDto, prisma: PrismaService) {
    const result = await prisma.controls.update({
        where: { settings: settingsId },
        data: {
            is_tap_mode: settingsData.controls.isTapMode,
            copy: settingsData.controls.copy,
            remove: settingsData.controls.remove,
        },
    });

    return result;
}

function updateTableMappings(updatedControlsId: number, settingsData: UpdateSettingsDto, prisma: PrismaService) {
    settingsData.controls.tableMapping.map((hotKey, index) =>
        prisma.table_mappings.updateMany({
            where: {
                control: updatedControlsId,
                slot: index,
            },
            data: { hot_key: hotKey },
        }),
    )
}