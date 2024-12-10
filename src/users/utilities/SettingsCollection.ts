import { PrismaService } from "src/prisma/prisma.service";
import { ISettings } from "../interfaces/ISettings";

/**
 * A felhasználó beállításainak lekérdezése és transzformálása.
 *
 * @param {number} userId - A felhasználó egyedi azonosítója.
 * @param {PrismaService} prisma - A Prisma ORM példánya az adatbázis műveletekhez.
 * @returns {Promise<ISettings[]>} - A transzformált beállítások listája.
 * @throws {Error} - Ha nem található beállítás a felhasználóhoz.
 */
export async function geatherSettings(userId: number, prisma: PrismaService): Promise<ISettings[]> {
    // Lekérdezzük a beállításokat, beleértve a vezérlési adatokat és a táblázati kiosztásokat
    const settingsRecords = await settingsQuery(userId, prisma);

    if (!settingsRecords || settingsRecords.length === 0) {
        throw new Error('Settings not found for this user.');
    }

    // Transzformáljuk a beállításokat
    return settingsRecords.map((settings) => {
        const control = settings.controls_controls_settingsTosettings;

        // Alapértelmezett táblázati kiosztás
        const defaultTableMapping: [string, string, string, string, string, string, string, string, string] = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9",
        ];

        // Táblázati kiosztás betöltése vagy alapérték használata
        const tableMapping: [string, string, string, string, string, string, string, string, string] =
            control?.table_mappings?.map((mapping) => mapping.hot_key).slice(0, 9) as [string, string, string, string, string, string, string, string, string] || defaultTableMapping;

        return {
            id: settings.id,
            volume: settings.volume,
            imagesSize: settings.image_size,
            isSet: settings.is_set,
            controls: {
                isTapMode: control?.is_tap_mode ?? false,
                copy: control?.copy ?? "LMB",
                remove: control?.remove ?? "RMB",
                tableMapping,
            },
        };
    });
}

/**
 * Lekérdezés a beállítások és kapcsolódó táblák adatainak betöltéséhez.
 *
 * @param {number} userId - A felhasználó egyedi azonosítója.
 * @param {PrismaService} prisma - A Prisma ORM példánya az adatbázis műveletekhez.
 * @returns {Promise<any[]>} - A lekérdezett nyers adatok.
 */
async function settingsQuery(userId: number, prisma: PrismaService) {
    return await prisma.settings.findMany({
        where: { user: userId },
        include: {
            controls_controls_settingsTosettings: {
                include: {
                    table_mappings: true, // Táblázati kiosztások betöltése
                },
            },
        },
    });
}