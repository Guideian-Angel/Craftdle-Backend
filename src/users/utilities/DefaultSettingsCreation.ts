import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ISettings } from "../interfaces/ISettings";

export async function createDefaultSettings(prisma: PrismaService, userId: number): Promise<ISettings[]> {
    return await prisma.$transaction(async (tx) => {
        // 1. Létrehozzuk a 3 Settings rekordot
        const settingsRecords = await generateSettingsRecords(tx, userId);

        // 2. Létrehozzuk a hozzájuk tartozó Controls rekordokat
        const controlsRecords = await generateControlRecords(tx, settingsRecords);

        // 3. Létrehozzuk a TableMapping rekordokat (bár itt most nem kell visszavezetni az adatokat)
        await generateTableMappingRecords(tx, controlsRecords);

        // 4. Összeállítjuk a végső visszatérési struktúrát
        return settingsRecords.map((settings) => {
            const control = controlsRecords.find((ctrl) => ctrl.settings === settings.id);

            return {
                id: settings.id,
                volume: settings.volume,
                imageSize: settings.image_size,
                isSet: settings.is_set,
                controls: {
                    isTapMode: control?.is_tap_mode ?? false,
                    copy: control?.copy ?? "LMB",
                    remove: control?.remove ?? "RMB",
                    // Az alap billentyű shortcutok
                    tableMapping: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
                },
            };
        });
    });
}

async function generateSettingsRecords(tx: Prisma.TransactionClient, userId: number) {
    return Promise.all(
        [0, 1, 2].map((isSetIndex) =>
            tx.settings.create({
                data: {
                    user: userId,
                    is_set: isSetIndex === 0,
                },
            })
        )
    );
}

async function generateControlRecords(tx: Prisma.TransactionClient, settingsRecords: any[]) {
    return Promise.all(
        settingsRecords.map((settings) =>
            tx.controls.create({
                data: {
                    settings: settings.id,
                    is_tap_mode: false,
                },
            })
        )
    );
}

async function generateTableMappingRecords(tx: Prisma.TransactionClient, controlsRecords: any[]) {
    return Promise.all(
        controlsRecords.flatMap((control) =>
            Array.from({ length: 9 }).map((_, index) =>
                tx.table_mappings.create({
                    data: {
                        control: control.id,
                        slot: index,
                        hot_key: (index + 1).toString(),
                    },
                })
            )
        )
    );
}