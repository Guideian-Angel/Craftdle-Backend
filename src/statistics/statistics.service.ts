import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getCurrentDate } from 'src/sharedComponents/utilities/date.util';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StatisticsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService
    ) { }

    async getStatistics(authHeader: string) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));
            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            const playedGames = await this.getActiveGamesToday();
            const totalGamesPlayed = await this.getPlayedGames();

            return {
                numberOfUsers: {
                    guests: await this.countGuests(),
                    registeredUsers: await this.countRegisteredUsers()
                },
                numberOfGames: await this.countGames(),
                numberOfActiveUsersToday: new Set(playedGames.map(game => game.id)).size,
                numberOfPlayedGamesToday: {
                    played: playedGames.length,
                    solved: playedGames.filter(game => game.is_solved).length
                },
                playedGames: {
                    solved: totalGamesPlayed.filter(game => game.is_solved).length,
                    unsolved: totalGamesPlayed.filter(game => !game.is_solved).length
                },
                gamemodes: await this.getGamemodesSortedByDate(),
                registrationsByDate: await this.getRegistrationsByDate()
            }
        } catch (err) {
            console.log(err)
            return { error: err.message }
        }
    }

    async countGuests() {
        return await this.prismaService.users.count({
            where: {
                is_guest: true
            }
        });
    }

    async countRegisteredUsers() {
        return await this.prismaService.users.count({
            where: {
                is_guest: false
            }
        });
    }

    async countGames() {
        return await this.prismaService.games.count();
    }

    async getActiveGamesToday() {
        return await this.prismaService.games.findMany({
            where: {
                OR: [
                    {
                        date: getCurrentDate()
                    },
                    {
                        tips: {
                            some: {
                                date: getCurrentDate()
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                is_solved: true
            }
        });
    }

    async getPlayedGames() {
        return await this.prismaService.games.findMany();
    }

    async getGamemodesSortedByDate() {
        const games = await this.prismaService.games.findMany({
            select: {
                gamemodes: {
                    select: {
                        name: true
                    }
                },
                tips: {
                    select: {
                        date: true
                    },
                    orderBy: {
                        date: 'desc'
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        const gamemodes: { [key: string]: { [key: string]: number } } = {};

        games.forEach(game => {
            if(game.tips. length > 0){
                const date = game.tips[0].date.toLocaleDateString();
                const gamemodeName = game.gamemodes.name;
                if (date in gamemodes) {
                    if (gamemodeName in gamemodes[date]) {
                        gamemodes[date][gamemodeName]++;
                    } else {
                        gamemodes[date][gamemodeName] = 1;
                    }
                } else {
                    gamemodes[date] = {
                        [gamemodeName]: 1
                    }
                }
            }
        });

        return gamemodes;
    }

    async getRegistrationsByDate(){
        const users = await this.prismaService.users.findMany({
            select: {
                registration_date: true
            },
            where: {
                is_guest: false
            },
            orderBy: {
                registration_date: 'asc'
            }
        });

        const registrations: { [key: string]: number } = {};

        users.forEach(user => {
            const date = user.registration_date.toLocaleDateString();
            if (date in registrations) {
                registrations[date]++;
            } else {
                registrations[date] = 1;
            }
        });

        return registrations;
    }
}