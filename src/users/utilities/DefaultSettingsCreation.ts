import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

export async function createDefaultSettings(prisma: PrismaService, userId: number) {
    await prisma.$transaction(async (tx) => {
        // 1. Létrehozzuk a 3 Settings rekordot
        const settingsRecords = await generateSettingsRecords(tx, userId);

        // 2. Létrehozzuk a hozzájuk tartozó Controls rekordokat
        const controlsRecords = await generateControlRecords(tx, settingsRecords);

        // 3. Létrehozzuk a TableMapping rekordokat (bár itt most nem kell visszavezetni az adatokat)
        await generateTableMappingRecords(tx, controlsRecords);
    });
}

async function generateSettingsRecords(tx: Prisma.TransactionClient, userId: number) {
    return Promise.all(
        [0, 1, 2].map((isSetIndex) =>
            tx.settings.create({
                data: {
                    user: userId,
                    volume: 50,
                    image_size: 50,
                    is_set: isSetIndex === 0,
                },
            })
        )
    );
}

async function generateControlRecords(tx: Prisma.TransactionClient, settingsRecords) {
    return Promise.all(
        settingsRecords.map((settings) =>
            tx.controls.create({
                data: {
                    settings: settings.id,
                    copy: "LMB",
                    remove: "RMB",
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