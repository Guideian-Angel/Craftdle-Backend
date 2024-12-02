import { PrismaService } from "src/prisma/prisma.service";

/**
 * Létrehozza az alapértelmezett beállításokat egy felhasználó számára.
 * @param prisma PrismaService példa.
 * @param userId A felhasználó azonosítója.
 */
export async function createDefaultSettings(prisma: PrismaService, userId: number) {
    await prisma.$transaction(async (tx) => {
        // Settings generálása
        const settingsRecords = await generateRecords(tx.settings, [0, 1, 2], (isSetIndex) => ({
            user: userId,
            volume: 50,
            image_size: 50,
            is_set: isSetIndex === 0,
        }));

        // Controls generálása
        const controlsRecords = await generateRecords(tx.controls, settingsRecords, (settings) => ({
            settings: settings.id,
            copy: "LMB",
            remove: "RMB",
            is_tap_mode: false,
        }));

        // TableMappings generálása
        await generateRecords(
            tx.table_mappings,
            controlsRecords.flatMap((control) =>
                Array.from({ length: 9 }, (_, index) => ({
                    control: control.id,
                    slot: index,
                    hot_key: (index + 1).toString(),
                }))
            ),
            (mappingData) => mappingData
        );
    });
}

/**
 * Általános rekord generáló függvény.
 * @param model Prisma modell referencia.
 * @param source Adatok a generáláshoz (tömb vagy egyedi elemek).
 * @param mapper Térkép, amely a forrást adatokká alakítja.
 * @returns A létrehozott rekordok, amelyek tartalmazzák az `id` mezőt.
 */
async function generateRecords<T, R>(
    model: any,
    source: T[],
    mapper: (item: T) => R
): Promise<Array<R & { id: number }>> {
    return Promise.all(
        source.map(async (item) => {
            const createdRecord = await model.create({ data: mapper(item) });
            return createdRecord; // A Prisma automatikusan tartalmazza az `id` mezőt.
        })
    );
}