import { ISettings } from "../interfaces/ISettings";
import { PrismaService } from "src/prisma/prisma.service";

export async function createDefaultSettings(prisma: PrismaService, userId: string): Promise<ISettings[]>{
    for(let i = 0; i < 3; i++){
        prisma.settings.create({
            data: {
                
            }
        })
    }
}