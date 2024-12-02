import { PrismaService } from "src/prisma/prisma.service";
import { ISettings } from "../interfaces/ISettings";

export async function geatherSettings(userId: number, prisma: PrismaService): Promise<ISettings[]> {
    // Lekérdezzük a felhasználó settings adatait, beleértve a controls és tableMappings táblákat
    const settingsRecords = await settingsQuery(userId, prisma);

    if (!settingsRecords || settingsRecords.length === 0) {
        throw new Error('Settings not found for this user.');
    }

    // A visszatérési struktúra összeállítása
    return settingsRecords.map((settings) => {
        const control = settings.controls_controls_settingsTosettings;

        // Alapértelmezett tableMapping értékek
        const defaultTableMapping: [string, string, string, string, string, string, string, string, string] = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9",
        ];

        // Ha van tableMappings, illesszük a fix hosszúságú tömbre
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

async function settingsQuery(userId: number, prisma: PrismaService){
    const result = await prisma.settings.findMany({
        where: { user: userId },
        include: {
            controls_controls_settingsTosettings: {
                include: {
                    table_mappings: true, // Betöltjük a tableMappings adatait is
                },
            },
        },
    });

    return result;
}
