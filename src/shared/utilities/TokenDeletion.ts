import { PrismaService } from '../../prisma/prisma.service';

/**
 * Token törlése az adatbázisból egy adott felhasználóhoz.
 * Ez a függvény csak a tokent törli, a felhasználói adatok érintetlenek maradnak.
 * @param prisma - A Prisma szolgáltatás példánya.
 * @param userId - A felhasználó azonosítója, akinek a tokene törlésre kerül.
 * @returns Boolean érték, amely jelzi, hogy sikeres volt-e a törlés.
 */
export async function deleteToken(prisma: PrismaService, userId: number): Promise<boolean> {
    try {
        const deletedToken = await prisma.tokens.delete({
            where: { user: userId },
        });

        return !!deletedToken; // Sikeres törlés esetén `true`
    } catch (error) {
        console.error('Token törlése sikertelen:', error.message);
        return false; // Hibás törlés esetén `false`
    }
}