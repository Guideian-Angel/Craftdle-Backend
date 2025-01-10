import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import tokenValidation from 'src/shared/utilities/tokenValidation';


export async function createToken(prisma: PrismaService): Promise<string> {
    let token: string = uuidv4();

    // Ellenőrizzük, hogy a generált token már létezik-e az adatbázisban
    while (await tokenValidation.validateToken(token, prisma, true)) {
        // Ha létezik, újat generálunk
        token = uuidv4();
    }

    // Visszaadjuk az új, egyedi tokent
    return token;
}