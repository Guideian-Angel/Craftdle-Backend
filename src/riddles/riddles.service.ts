import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getCurrentDate } from 'src/sharedComponents/utilities/date.util';

@Injectable()
export class RiddlesService {

    constructor(
        private readonly prisma: PrismaService
    ){}

    async findPlayersDailyGameToday(playerId){
        const today = getCurrentDate();
        today.setHours(0, 0, 0, 0); // Dátumot nullázzuk, hogy csak a nap számítson

        let dailyGame = await this.findDailyGameToday(playerId, today);
        if(!dailyGame){
            console.log("Nincs ma még játék, keresünk másikat")
            dailyGame = await this.findDailyGameToday(null, today);
        }
        return dailyGame;
    }

    async findDailyGameToday(playerId, today) {
        const whereCondition = {
            type: 3, // Daily riddle gamemode
            date: {
                gte: today,                      // Nap eleje
                lt: new Date(today.getTime() + 86400000), // Másnap eleje (tehát csak az adott nap)
            },
            ...(playerId && { player: playerId }) // Csak akkor adja hozzá, ha létezik
        };
    
        const game = await this.prisma.games.findFirst({
            where: whereCondition,
        });

        return game;
    }
}
