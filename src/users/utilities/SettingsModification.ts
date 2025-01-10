import { PrismaService } from "src/prisma/prisma.service";
import { ISettings } from "../interfaces/ISettings";
import { NotFoundException } from "@nestjs/common";
import { UpdateSettingsDto } from "../dtos/SettingsData.dto";

/**
 * Beállítások és hozzájuk tartozó kapcsolódó adatok frissítése.
 * @param {number} settingsId - A módosítandó beállítás egyedi azonosítója.
 * @param {number} userId - A felhasználó egyedi azonosítója.
 * @param {UpdateSettingsDto} settingsData - Az új beállításokat tartalmazó adatok.
 * @param {PrismaService} prisma - A Prisma ORM példánya az adatbázis műveletekhez.
 * @throws {NotFoundException} - Ha a beállítások nem találhatók.
 */
export async function modifySettings(settingsId: number, userId: number, settingsData: UpdateSettingsDto, prisma: PrismaService) {
    const settings = getSettings(settingsId, userId, prisma);

    if (!settings) {
        throw new NotFoundException('Settings not found');
    }

    updateSettings(settingsId, settingsData, prisma);
    const updatedControlsId = (await updateControls(settingsId, settingsData, prisma)).id;
    updateTableMappings(updatedControlsId, settingsData, prisma);
}

/**
 * Egy adott beállítás rekordjának lekérése a felhasználó azonosítója alapján.
 * @param {number} settingsId - A keresett beállítás egyedi azonosítója.
 * @param {number} userId - A felhasználó egyedi azonosítója.
 * @param {PrismaService} prisma - A Prisma ORM példánya az adatbázis műveletekhez.
 * @returns {Promise<any>} - A lekérdezett beállítás rekord, vagy null, ha nem található.
 */
async function getSettings(settingsId: number, userId: number, prisma: PrismaService) {
    const result = await prisma.settings.findFirst({
        where: {
            id: settingsId,
            user: userId,
        },
    });

    return result;
}

/**
 * A Settings rekord frissítése az adatbázisban.
 * @param {number} settingsId - A módosítandó beállítás azonosítója.
 * @param {UpdateSettingsDto} settingsData - Az új beállításokat tartalmazó adatok.
 * @param {PrismaService} prisma - A Prisma ORM példánya az adatbázis műveletekhez.
 */
async function updateSettings(settingsId: number, settingsData: UpdateSettingsDto, prisma: PrismaService) {
    await prisma.settings.update({
        where: { id: settingsId },
        data: {
            volume: settingsData.volume,
            image_size: settingsData.imagesSize,
            is_set: settingsData.isSet,
        },
    });
}

/**
 * Controls rekord frissítése egy adott beállításhoz.
 * @param {number} settingsId - A beállítás azonosítója.
 * @param {UpdateSettingsDto} settingsData - Az új beállításokat tartalmazó adatok.
 * @param {PrismaService} prisma - A Prisma ORM példánya az adatbázis műveletekhez.
 * @returns {Promise<any>} - A frissített Controls rekord.
 */
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

/**
 * TableMappings rekordok frissítése egy adott Controls rekordhoz.
 * @param {number} updatedControlsId - A frissített Controls rekord azonosítója.
 * @param {UpdateSettingsDto} settingsData - Az új beállításokat tartalmazó adatok.
 * @param {PrismaService} prisma - A Prisma ORM példánya az adatbázis műveletekhez.
 */
function updateTableMappings(updatedControlsId: number, settingsData: UpdateSettingsDto, prisma: PrismaService) {
    settingsData.controls.tableMapping.map((hotKey, index) =>
        prisma.table_mappings.updateMany({
            where: {
                control: updatedControlsId,
                slot: index,
            },
            data: { hot_key: hotKey },
        }),
    );
}